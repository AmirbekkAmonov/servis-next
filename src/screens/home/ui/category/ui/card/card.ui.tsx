import { useState } from 'react';
import {
  Card as MantineCard,
  Text,
  Flex,
  Box,
  Image,
  UnstyledButton,
  Checkbox,
  Group,
} from '@mantine/core';
import { useNavigate } from '@/shared/lib/router';
import theme from '@/shared/theme';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { HoverCard, Drawer, Button } from '@mantine/core';
import type { ISubCategory } from '@/shared/api/services/home/home.types';
import { useMediaQuery } from '@mantine/hooks';

type CardProps = {
  image: string;
  title: string;
  services_count: number;
  slug: string;
  sub_categories?: ISubCategory[];
};

function Card({
  image,
  title,
  services_count,
  slug,
  sub_categories,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMobile && sub_categories && sub_categories.length > 0) {
      setIsOpen(true);
    } else {
      navigate(`/category/${slug}`);
    }
  };

  const handleApply = () => {
    const query =
      selectedSubIds.length > 0
        ? `?${selectedSubIds.map((id, i) => `sub_category_ids[${i}]=${id}`).join('&')}`
        : '';
    navigate(`/category/${slug}${query}`);
    setIsOpen(false);
  };

  const hasValidImage = image && image.trim() !== '' && !imageError;

  return (
    <>
      <HoverCard
        width={300}
        position="right-start"
        offset={15}
        shadow="xl"
        radius="lg"
        openDelay={100}
        closeDelay={200}
        disabled={isMobile || !sub_categories || sub_categories.length === 0}
        styles={{
          dropdown: {
            padding: 16,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            animation: 'fadeSlideIn 0.3s ease-out',
          },
        }}
      >
        <HoverCard.Target>
          <MantineCard
            radius="xl"
            padding="lg"
            style={{
              border: `1px solid ${hovered ? theme.colors?.blue?.[2] : theme.colors?.gray?.[2]}`,
              height: '100%',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: hovered
                ? '0 16px 32px rgba(15, 23, 42, 0.1)'
                : '0 4px 12px rgba(0, 0, 0, 0.03)',
              transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
              cursor: 'pointer',
              background: hovered ? theme.colors?.blue?.[0] : '#fff',
              overflow: 'visible',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
          >
            <Flex direction="column" align="center" gap="sm">
              <Box
                style={{
                  position: 'relative',
                  borderRadius: theme.radius?.xl || 16,
                  background: hovered ? '#fff' : theme.colors?.blue?.[0],
                  color: theme.colors?.blue?.[6],
                  transition: 'all 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'clamp(60px, 9vw, 82px)',
                  height: 'clamp(60px, 9vw, 82px)',
                  boxShadow: hovered
                    ? '0 8px 16px rgba(46, 144, 250, 0.12)'
                    : 'none',
                }}
              >
                {hasValidImage ? (
                  <Image
                    src={image}
                    alt={title}
                    width="85%"
                    height="85%"
                    fit="contain"
                    style={{
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <MdOutlineImageNotSupported
                    size="65%"
                    color={theme.colors?.blue?.[6]}
                    style={{
                      transition: 'transform 0.4s ease',
                      transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                )}
              </Box>
              <Flex direction="column" align="center" gap={2}>
                <Text
                  fz={{ base: 14, sm: 15, md: 16 }}
                  fw={700}
                  ta="center"
                  c={hovered ? 'blue.7' : theme.colors?.gray?.[9]}
                  style={{ transition: 'color 0.3s ease' }}
                >
                  {title}
                </Text>
                <Box
                  px={8}
                  py={1}
                  style={{
                    borderRadius: 100,
                    background: hovered
                      ? theme.colors?.blue?.[1]
                      : theme.colors?.gray?.[1],
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Text
                    fz={11}
                    fw={600}
                    c={hovered ? 'blue.6' : theme.colors?.gray?.[6]}
                  >
                    {services_count} ta xizmat
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </MantineCard>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Box p="md">
            <Text fw={600} fz={14} mb="sm">
              {title} subkategoriyalari
            </Text>
            <Flex direction="column" gap="xs">
              {sub_categories?.map(sub => (
                <UnstyledButton
                  key={sub.id}
                  onClick={() => {
                    const newIds = selectedSubIds.includes(sub.id)
                      ? selectedSubIds.filter(id => id !== sub.id)
                      : [...selectedSubIds, sub.id];
                    setSelectedSubIds(newIds);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: selectedSubIds.includes(sub.id)
                      ? theme.colors?.blue?.[0]
                      : 'transparent',
                  }}
                >
                  <Group gap="sm">
                    <Checkbox
                      checked={selectedSubIds.includes(sub.id)}
                      onChange={() => {}}
                    />
                    <Text fz={13}>{sub.name}</Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Flex>
            <Button fullWidth mt="md" onClick={handleApply}>
              Natijalarni ko'rish
            </Button>
          </Box>
        </HoverCard.Dropdown>
      </HoverCard>

      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        size="auto"
        radius="24px 24px 0 0"
        title={
          <Text fw={800} fz={18} c="gray.9">
            {title}
          </Text>
        }
        styles={{
          header: {
            padding: '24px 24px 16px',
          },
          body: {
            padding: '0 24px 32px',
          },
        }}
      >
        <Box>
          <Flex direction="column" gap="xs">
            {sub_categories?.map(sub => (
              <UnstyledButton
                key={sub.id}
                onClick={() => {
                  const newIds = selectedSubIds.includes(sub.id)
                    ? selectedSubIds.filter(id => id !== sub.id)
                    : [...selectedSubIds, sub.id];
                  setSelectedSubIds(newIds);
                }}
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  backgroundColor: selectedSubIds.includes(sub.id)
                    ? theme.colors?.blue?.[0]
                    : theme.colors?.gray?.[0],
                }}
              >
                <Group gap="sm">
                  <Checkbox
                    checked={selectedSubIds.includes(sub.id)}
                    onChange={() => {}}
                  />
                  <Text fz={14} fw={500}>
                    {sub.name}
                  </Text>
                </Group>
              </UnstyledButton>
            ))}
          </Flex>
          <Flex gap="sm" mt="xl">
            <Button
              flex={1}
              size="lg"
              radius="md"
              onClick={handleApply}
              style={{
                boxShadow: '0 8px 20px rgba(46, 144, 250, 0.25)',
              }}
            >
              Natijalarni ko'rish
            </Button>
          </Flex>
        </Box>
      </Drawer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `,
        }}
      />
    </>
  );
}

export default Card;

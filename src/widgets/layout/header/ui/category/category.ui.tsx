import { Box, Flex, Text, UnstyledButton, rem, Image } from '@mantine/core';
import { useState } from 'react';
import type { ICategory } from '@/shared/api/services/header/header.types';
import { MdOutlineImageNotSupported } from 'react-icons/md';

type Item = {
  id: number;
  label: string;
  href: string;
  image?: string;
};

type ColumnProps = {
  items: Item[];
  onItemClick: (href: string) => void;
  fullWidth?: boolean;
};

function Column({ items, onItemClick, fullWidth = false }: ColumnProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  return (
    <Flex direction="column" gap="xs" w={fullWidth ? '100%' : '50%'}>
      {items.map(({ id, label, href, image }) => {
        const isHovered = hovered === id;
        const hasError = imageErrors.has(id);
        const hasValidImage = image && image.trim() !== '' && !hasError;

        return (
          <UnstyledButton
            key={id}
            onClick={() => onItemClick(href)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%',
              borderRadius: rem(8),
            }}
          >
            <Flex
              align="center"
              gap="sm"
              p="sm"
              bg={isHovered ? 'gray.2' : 'gray.0'}
              mih={44}
              style={{
                borderRadius: rem(8),
                transition: 'background-color 120ms ease, transform 120ms ease',
                transform: isHovered ? 'translateX(2px)' : 'none',
              }}
            >
              <Box
                w={18}
                h={18}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {hasValidImage ? (
                  <Image
                    src={image}
                    alt={label}
                    width={18}
                    height={18}
                    fit="contain"
                    style={{ display: 'block' }}
                    onError={() => handleImageError(id)}
                  />
                ) : (
                  <MdOutlineImageNotSupported size={18} />
                )}
              </Box>
              <Text size="sm" fw={500}>
                {label}
              </Text>
            </Flex>
          </UnstyledButton>
        );
      })}
    </Flex>
  );
}

type CategoryProps = {
  onItemClick?: (href: string) => void;
  singleColumn?: boolean;
  categories?: ICategory[];
};

function Category({
  onItemClick,
  singleColumn = false,
  categories = [],
}: CategoryProps) {
  const handleClick = (href: string) => {
    if (onItemClick) {
      onItemClick(href);
    }
  };

  const items: Item[] = categories.map(category => ({
    id: category.id,
    label: category.name,
    href: `/category/${category.slug}`,
    image: category.image,
  }));

  if (items.length === 0) {
    return (
      <Box p="sm" bg="white" w={rem(420)}>
        <Text size="sm" c="gray.6" ta="center" py="md">
          Kategoriyalar yuklanmoqda...
        </Text>
      </Box>
    );
  }

  const midPoint = Math.ceil(items.length / 2);
  const column1 = items.slice(0, midPoint);
  const column2 = items.slice(midPoint);

  return (
    <Box p="sm" bg="white" w={singleColumn ? '100%' : rem(420)}>
      {singleColumn ? (
        <Flex direction="column" gap="sm" w="100%">
          <Column items={items} onItemClick={handleClick} fullWidth />
        </Flex>
      ) : (
        <Flex gap="sm" w="100%">
          <Column items={column1} onItemClick={handleClick} />
          <Column items={column2} onItemClick={handleClick} />
        </Flex>
      )}
    </Box>
  );
}

export default Category;

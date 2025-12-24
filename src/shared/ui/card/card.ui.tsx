import { useState } from 'react';
import {
  Card as MantineCard,
  Image,
  Text,
  Button,
  Flex,
  Box,
  Badge,
  rem,
} from '@mantine/core';
import { IoLocationOutline } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import { LuCrown } from 'react-icons/lu';
import { useNavigate } from '@/shared/lib/router';
import theme from '@/shared/theme';
import { MdOutlineImageNotSupported } from 'react-icons/md';

type CardProps = {
  image?: string;
  category?: string;
  title: string;
  description?: string;
  location: string;
  rating?: number;
  reviewsCount?: number;
  price: string;
  views?: number;
  isPremium?: boolean;
  href?: string;
};

function Card({
  image,
  category,
  title,
  description,
  location,
  rating,
  reviewsCount,
  price,
  views,
  isPremium,
  href,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  const hasValidImage = Boolean(image && image.trim() !== '' && !imageError);
  const showRating =
    typeof rating === 'number' && typeof reviewsCount === 'number';
  const showViews = typeof views === 'number';

  const getBorderStyle = () => {
    if (isPremium) {
      return hovered ? '2px solid #FFD700' : '2px solid #FFD700';
    }
    return '1px solid transparent';
  };

  return (
    <MantineCard
      padding={0}
      radius="md"
      h="100%"
      style={{
        cursor: href ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 24px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: getBorderStyle(),
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <Box
        pos="relative"
        style={{
          overflow: 'hidden',
          borderRadius: `${rem(8)} ${rem(8)} 0 0`,
        }}
      >
        {hasValidImage ? (
          <Image
            src={image}
            alt={title}
            height={200}
            fit="cover"
            style={{
              borderRadius: `${rem(8)} ${rem(8)} 0 0`,
              transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            h={200}
            bg={theme.colors?.gray?.[1]}
            style={{
              borderRadius: `${rem(8)} ${rem(8)} 0 0`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MdOutlineImageNotSupported
              size={44}
              color={theme.colors?.gray?.[6]}
            />
          </Box>
        )}

        {category ? (
          <Badge
            pos="absolute"
            top={12}
            left={12}
            color="blue"
            size="md"
            radius="md"
            style={{
              backgroundColor: theme.colors?.blue?.[6],
              color: theme.other?.mainWhite,
              fontWeight: 500,
              zIndex: 2,
            }}
          >
            {category}
          </Badge>
        ) : null}
        {isPremium ? (
          <Badge
            pos="absolute"
            top={12}
            right={12}
            size="md"
            radius="md"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: theme.colors?.gray?.[9],
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <LuCrown size={14} />
            Premium
          </Badge>
        ) : null}
      </Box>

      <Box
        p={{ base: 'sm', sm: 'md' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 12,
        }}
      >
        <Text
          fw={600}
          fz={{ base: 15, sm: 16 }}
          c={theme.colors?.gray?.[9]}
          lineClamp={2}
          style={{
            minHeight: '2.5em',
          }}
        >
          {title}
        </Text>

        {description && (
          <Text
            fz={{ base: 12, sm: 13 }}
            c={theme.colors?.gray?.[6]}
            lineClamp={2}
            style={{
              minHeight: '2.8em',
              lineHeight: 1.4,
            }}
          >
            {description.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </Text>
        )}

        <Flex align="center" gap={6}>
          <IoLocationOutline size={16} color={theme.colors?.gray?.[6]} />
          <Text
            fz={{ base: 12, sm: 13 }}
            c={theme.colors?.gray?.[6]}
            lineClamp={1}
          >
            {location}
          </Text>
        </Flex>

        <Flex justify="space-between" align="center">
          {showRating ? (
            <Flex align="center" gap={6}>
              <FaStar size={14} color="#FFB800" />
              <Text fz={{ base: 12, sm: 13 }} c={theme.colors?.gray?.[7]}>
                {rating} ({reviewsCount} sharh)
              </Text>
            </Flex>
          ) : (
            <Box />
          )}
          {showViews ? (
            <Flex align="center" gap={4}>
              <LuEye size={14} color={theme.colors?.gray?.[6]} />
              <Text fz={{ base: 11, sm: 12 }} c={theme.colors?.gray?.[6]}>
                {views}
              </Text>
            </Flex>
          ) : null}
        </Flex>

        <Flex justify="space-between" align="center" mt="auto">
          <Text fw={600} fz={{ base: 14, sm: 15 }} c={theme.colors?.blue?.[6]}>
            {price}
          </Text>
          <Button
            radius="md"
            size="sm"
            variant={hovered ? 'filled' : 'light'}
            color="blue"
            styles={{
              root: {
                backgroundColor: hovered
                  ? theme.colors?.blue?.[6]
                  : theme.colors?.gray?.[1],
                color: hovered
                  ? theme.other?.mainWhite
                  : theme.colors?.gray?.[7],
                transition: 'all 0.2s ease',
                fontWeight: 500,
              },
            }}
          >
            Ko'rish
          </Button>
        </Flex>
      </Box>
    </MantineCard>
  );
}

export default Card;

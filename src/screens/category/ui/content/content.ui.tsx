import { Box, Flex, Text, Title, Skeleton, Image, Select } from '@mantine/core';
import { useState } from 'react';
import theme from '@/shared/theme';
import { Card, CardSkeleton } from '@/shared/ui/card';
import { Pagination } from '@/shared/ui/pagination';
import { MdOutlineImageNotSupported } from 'react-icons/md';

type Service = {
  id: number;
  slug: string;
  name: string;
  images?: Array<{
    small?: string | null;
    medium?: string | null;
    large?: string | null;
  }>;
  category?: {
    image?: string;
    type?: string;
  };
  city?: {
    name?: string;
  };
  district?: {
    name?: string;
  };
  rating?: number;
  comment_count?: number;
  price_from: number;
  price_to: number;
  view_count?: number;
  is_premium?: boolean;
  description?: string;
};

type ContentProps = {
  title: string;
  categoryImage?: string;
  searchQuery?: string;
  services: Service[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSortChange?: (value: string | null) => void;
  sortValue?: string | null;
  isLoading?: boolean;
  totalCount?: number;
  hideHeader?: boolean;
};

const formatUZS = (value: number) =>
  new Intl.NumberFormat('uz-UZ').format(value);

const formatPrice = (priceFrom: number, priceTo: number) => {
  if (priceFrom === priceTo) {
    return `${formatUZS(priceFrom)} so'm`;
  }
  return `${formatUZS(priceFrom)} - ${formatUZS(priceTo)} so'm`;
};

const SORT_OPTIONS = [
  { value: 'popular', label: 'Mashhur' },
  { value: 'cheap', label: 'Narx: pastdan yuqoriga' },
  { value: 'expensive', label: 'Narx: yuqoridan pastga' },
  { value: 'new', label: 'Yangi' },
  { value: 'rating', label: 'Reyting' },
];

function Content({
  title,
  categoryImage,
  searchQuery,
  services,
  totalPages,
  currentPage,
  onPageChange,
  onSortChange,
  sortValue,
  isLoading = false,
  totalCount,
  hideHeader = false,
}: ContentProps) {
  const [imageError, setImageError] = useState(false);
  const displayTitle = searchQuery || title;
  const showPagination = totalPages > 1;
  const showCategoryImage = categoryImage && !searchQuery && !imageError;

  if (isLoading) {
    return (
      <Box flex={1}>
        {!hideHeader && (
          <Flex justify="space-between" align="center" mb="lg">
            <Flex align="center" gap="sm">
              <Skeleton height={40} width={40} radius="md" />
              <Skeleton height={24} width={200} />
            </Flex>
            <Skeleton height={36} width={180} />
          </Flex>
        )}
        <Flex gap="md" wrap="wrap">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Box key={idx} w={{ base: '48%', sm: '48%', md: '31%' }}>
              <CardSkeleton />
            </Box>
          ))}
        </Flex>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      {!hideHeader && (
        <Flex
          justify="space-between"
          align="center"
          mb="lg"
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'md', sm: 'lg' }}
        >
          <Flex align="center" gap="sm">
            {showCategoryImage ? (
              <Box
                w={40}
                h={40}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors?.gray?.[1],
                }}
              >
                <Image
                  src={categoryImage}
                  alt={title}
                  width={40}
                  height={40}
                  fit="contain"
                  style={{ display: 'block' }}
                  onError={() => setImageError(true)}
                />
              </Box>
            ) : categoryImage && !searchQuery ? (
              <Box
                w={40}
                h={40}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors?.gray?.[1],
                }}
              >
                <MdOutlineImageNotSupported
                  size={24}
                  color={theme.colors?.gray?.[6]}
                />
              </Box>
            ) : null}
            <Box>
              <Title order={3} fw={700} c={theme.colors?.gray?.[9]}>
                {displayTitle}
              </Title>
              {typeof totalCount === 'number' && (
                <Text fz={13} c={theme.colors?.gray?.[6]} mt={4}>
                  {totalCount} ta xizmat topildi
                </Text>
              )}
            </Box>
          </Flex>

          {onSortChange && (
            <Select
              placeholder="Saralash"
              data={SORT_OPTIONS}
              value={sortValue}
              onChange={onSortChange}
              clearable
              w={{ base: '100%', sm: 200 }}
              styles={{
                input: {
                  borderColor: theme.colors?.gray?.[3],
                },
              }}
            />
          )}
        </Flex>
      )}

      {services.length === 0 ? (
        <Box py={60} ta="center">
          <Text fz={16} c={theme.colors?.gray?.[6]}>
            Xizmatlar topilmadi
          </Text>
        </Box>
      ) : (
        <>
          <Flex gap="md" wrap="wrap">
            {services.map(service => (
              <Box key={service.id} w={{ base: '48%', sm: '48%', md: '31%' }}>
                <Card
                  image={
                    service.images?.[0]?.medium ||
                    service.images?.[0]?.small ||
                    service.images?.[0]?.large ||
                    service.category?.image ||
                    ''
                  }
                  category={service.category?.type || ''}
                  title={service.name}
                  description={service.description}
                  location={`${service.city?.name || ''}${service.city?.name && service.district?.name ? ', ' : ''}${service.district?.name || ''}`}
                  rating={service.rating}
                  reviewsCount={service.comment_count}
                  price={formatPrice(service.price_from, service.price_to)}
                  views={service.view_count}
                  isPremium={service.is_premium}
                  href={`/service/${service.slug}`}
                />
              </Box>
            ))}
          </Flex>

          {showPagination && (
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={onPageChange}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default Content;

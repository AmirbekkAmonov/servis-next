import { useEffect, useState } from 'react';
import theme from '@/shared/theme';
import Container from '@/shared/ui/Container';
import { Box, Flex, Text, Title } from '@mantine/core';
import { Card as CategoryCard } from './ui/card';
import { getHomeCategories } from './category.api';
import type { IHomeCategory } from '@/shared/api/services/home/home.types';
import CardSkeleton from './ui/cardSkeleton';

function Category() {
  const [categories, setCategories] = useState<IHomeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getHomeCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (!isLoading && categories.length === 0) {
    return null;
  }

  const displayCategories = categories.slice(0, 25);

  return (
    <Box w="100%" h="100%" bg={theme.colors?.gray?.[1]}>
      <Container py={60} ta="center">
        <Flex direction="column" gap="sm" align="center">
          <Title order={1} fw={700} c={theme.colors?.gray?.[9]}>
            Kategoriyalarni Tanlang
          </Title>
          <Text fz={16} fw={500} c={theme.colors?.gray?.[6]}>
            20+ kategoriyada minglab xizmatlarni ko'ring
          </Text>
          <Flex w="100%" gap="md" wrap="wrap" justify="center" mt="lg">
            {isLoading
              ? Array.from({ length: 25 }).map((_, i) => (
                <Box key={i} w={{ base: '48%', sm: '31%', md: '15.2%' }}>
                  <CardSkeleton />
                </Box>
              ))
              : displayCategories.map(category => (
                <Box
                  key={category.id}
                  w={{ base: '48%', sm: '31%', md: '15.2%' }}
                >
                  <CategoryCard
                    image={category.image}
                    title={category.name}
                    services_count={category.services_count}
                    slug={category.slug}
                    sub_categories={category.sub_categories}
                  />
                </Box>
              ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Category;

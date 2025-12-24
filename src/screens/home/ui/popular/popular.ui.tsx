import { Box, Title, Flex, Text, Button } from '@mantine/core';
import theme from '@/shared/theme';
import Container from '@/shared/ui/Container';
import { Card, CardSkeleton } from '@/shared/ui/card';
import { Pagination } from '@/shared/ui/pagination';
import { useState, useEffect, useMemo } from 'react';
import { getPopularServices } from '@/shared/api/services/service';
import type { IPopularService } from '@/shared/api/services/service/service.types';
import { useNavigate } from '@/shared/lib/router';
import { useAuthStore } from '@/shared/store/authStore';
import { IoAddCircleOutline, IoGridOutline } from 'react-icons/io5';

const formatUZS = (value: number) =>
  new Intl.NumberFormat('uz-UZ').format(value);

const formatPrice = (priceFrom: number, priceTo: number) => {
  if (priceFrom === priceTo) {
    return `${formatUZS(priceFrom)} so'm`;
  }
  return `${formatUZS(priceFrom)} - ${formatUZS(priceTo)} so'm`;
};

const ITEMS_PER_PAGE = 8;

function Popular() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<IPopularService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getPopularServices();
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(services.length / ITEMS_PER_PAGE);
  }, [services.length]);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return services.slice(startIndex, endIndex);
  }, [services, currentPage]);

  if (isLoading) {
    return (
      <Box
        w="100%"
        h="100%"
        bg={theme.colors?.gray?.[0]}
        py={{ base: 20, md: 40 }}
      >
        <Container>
          <Flex direction="column" gap="lg">
            <Title order={2} fw={700} c={theme.colors?.gray?.[9]}>
              Mashhur Xizmatlar
            </Title>
            <Flex
              gap="md"
              wrap="wrap"
              justify={{ base: 'center', md: 'start' }}
              align="stretch"
            >
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <Box
                  key={index}
                  w={{ base: '100%', sm: '48%', md: '32%', lg: '23%' }}
                  h="100%"
                >
                  <CardSkeleton />
                </Box>
              ))}
            </Flex>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg={theme.colors?.gray?.[0]}
      py={{ base: 20, md: 40 }}
    >
      <Container>
        <Flex direction="column" gap="lg">
          <Box>
            <Title order={2} fw={800} c={theme.colors?.gray?.[9]}>
              Mashhur xizmatlar — eng ko&apos;p ko&apos;rilganlari
            </Title>
            <Text fz={14} fw={500} c={theme.colors?.gray?.[6]} mt={6}>
              Reytingi yuqori, ishonchli va hamyonbop xizmatlarni bir joyda
              toping.
            </Text>
          </Box>
          <Flex
            gap="md"
            wrap="wrap"
            justify={{ base: 'center', md: 'start' }}
            align="stretch"
          >
            {paginatedServices.map(service => (
              <Box
                key={service.id}
                w={{ base: '48%', sm: '48%', md: '32%', lg: '23%' }}
                h="100%"
              >
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
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />

          <Flex
            gap={{ base: 10, md: 14 }}
            wrap="wrap"
            justify="space-between"
            align="center"
            mt="sm"
          >
            <Flex gap={10} wrap="wrap">
              <Button
                radius="md"
                leftSection={<IoGridOutline size={18} />}
                onClick={() => navigate('/category')}
              >
                Barcha xizmatlarni ko&apos;rish
              </Button>
              <Button
                radius="md"
                variant="light"
                leftSection={<IoAddCircleOutline size={18} />}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/profile#add-service');
                    return;
                  }

                  window.open('https://t.me/Servise_uz_bot', '_blank');
                }}
              >
                Xizmat qo&apos;shish
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Popular;

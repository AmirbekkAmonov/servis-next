import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex, Text, Title } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from '@/shared/lib/router';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { Card, CardSkeleton } from '@/shared/ui/card';
import { getPremiumServices } from '@/shared/api/services/service';
import type { IPopularService } from '@/shared/api/services/service/service.types';
import { useAuthStore } from '@/shared/store/authStore';
import {
  IoAddCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoGridOutline,
  IoSparkles,
} from 'react-icons/io5';

const formatUZS = (value: number) =>
  new Intl.NumberFormat('uz-UZ').format(value);

const formatPrice = (priceFrom: number, priceTo: number) => {
  if (priceFrom === priceTo) {
    return `${formatUZS(priceFrom)} so'm`;
  }
  return `${formatUZS(priceFrom)} - ${formatUZS(priceTo)} so'm`;
};

function Premium() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<IPopularService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const emblaRef = useRef<EmblaCarouselType | null>(null);
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getPremiumServices();
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const slides = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, idx) => (
        <Carousel.Slide key={idx}>
          <Box w="100%" h="100%">
            <CardSkeleton />
          </Box>
        </Carousel.Slide>
      ));
    }

    return services.map((item) => (
      <Carousel.Slide key={item.id}>
        <Box w="100%" h="100%">
          <Card
            image={
              item.images?.[0]?.medium ||
              item.images?.[0]?.small ||
              item.images?.[0]?.large ||
              item.category?.image ||
              ''
            }
            category={item.category?.type || ''}
            title={item.name}
            description={item.description}
            location={`${item.city?.name || ''}${
              item.city?.name && item.district?.name ? ', ' : ''
            }${item.district?.name || ''}`}
            rating={item.rating}
            reviewsCount={item.comment_count}
            price={formatPrice(item.price_from, item.price_to)}
            views={item.view_count}
            isPremium={true}
            href={`/service/${item.slug}`}
          />
        </Box>
      </Carousel.Slide>
    ));
  }, [isLoading, services]);

  if (!isLoading && services.length === 0) {
    return null;
  }

  return (
    <Box w="100%" bg={theme.colors?.gray?.[0]} py={{ base: 24, md: 44 }}>
      <Container>
        <Flex direction="column" gap="lg">
          <Box
            style={{
              borderRadius: 18,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              background:
                `linear-gradient(135deg, ${
                  theme.colors?.dark?.[9] || '#0B1020'
                } 0%, ` +
                `${theme.colors?.blue?.[9] || '#1e3a8a'} 42%, ` +
                `${theme.colors?.cyan?.[6] || '#06b6d4'} 100%)`,
              overflow: 'hidden',
            }}
          >
            <Box
              px={{ base: 16, sm: 22, md: 26 }}
              py={{ base: 18, sm: 20, md: 24 }}
              style={{
                background:
                  'radial-gradient(900px 300px at 20% 0%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%)',
              }}
            >
              <Flex
                justify="space-between"
                align="flex-start"
                wrap="wrap"
                gap="md"
              >
                <Box maw={620}>
                  <Flex align="center" gap={10}>
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.16)',
                        border: '1px solid rgba(255,255,255,0.24)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <IoSparkles size={18} color={theme.other?.mainWhite} />
                    </Flex>
                    <Text
                      fz={13}
                      fw={700}
                      c={theme.other?.mainWhite}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.18)',
                      }}
                    >
                      Premium tanlov
                    </Text>
                  </Flex>

                  <Title
                    order={2}
                    fw={900}
                    mt={12}
                    style={{
                      letterSpacing: -0.6,
                      color: theme.other?.mainWhite,
                    }}
                  >
                    Premium Xizmatlar
                  </Title>
                  <Text
                    fz={15}
                    fw={500}
                    mt={8}
                    style={{ color: 'rgba(255,255,255,0.86)' }}
                  >
                    Tekshirilgan va ishonchli xizmat ko&apos;rsatuvchilar.
                    Yuqori sifat kafolati.
                  </Text>
                </Box>

                <Flex direction="column" gap={10} style={{ minWidth: 240 }}>
                  <Flex gap={10} justify="flex-end" wrap="wrap">
                    <Button
                      radius="md"
                      leftSection={<IoGridOutline size={18} />}
                      variant="white"
                      onClick={() => navigate('/category')}
                      styles={{
                        root: {
                          color: theme.colors?.dark?.[9],
                          backgroundColor: theme.other?.mainWhite,
                        },
                      }}
                    >
                      Barcha xizmatlarni ko&apos;rish
                    </Button>
                    <Button
                      radius="md"
                      leftSection={<IoAddCircleOutline size={18} />}
                      variant="light"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate('/profile#add-service');
                          return;
                        }

                        window.open('https://t.me/Servise_uz_bot', '_blank');
                      }}
                      styles={{
                        root: {
                          backgroundColor: 'rgba(255,255,255,0.14)',
                          color: theme.other?.mainWhite,
                          border: '1px solid rgba(255,255,255,0.22)',
                        },
                      }}
                    >
                      Xizmat qo&apos;shish
                    </Button>
                  </Flex>

                  {!isMobile && (
                    <Flex gap={10} justify="flex-end">
                      <Button
                        variant="outline"
                        radius="md"
                        h={40}
                        w={40}
                        p={0}
                        bd="1px solid rgba(255,255,255,0.28)"
                        c={theme.other?.mainWhite}
                        onClick={() => emblaRef.current?.scrollPrev()}
                        styles={{
                          root: {
                            backgroundColor: 'rgba(255,255,255,0.10)',
                            '&:hover, &[dataHover]': {
                              backgroundColor: 'rgba(255,255,255,0.16)',
                            },
                          },
                        }}
                      >
                        <IoChevronBack size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        radius="md"
                        h={40}
                        w={40}
                        p={0}
                        bd="1px solid rgba(255,255,255,0.28)"
                        c={theme.other?.mainWhite}
                        onClick={() => emblaRef.current?.scrollNext()}
                        styles={{
                          root: {
                            backgroundColor: 'rgba(255,255,255,0.10)',
                            '&:hover, &[dataHover]': {
                              backgroundColor: 'rgba(255,255,255,0.16)',
                            },
                          },
                        }}
                      >
                        <IoChevronForward size={18} />
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Box>

            <Box
              w="100%"
              px={{ base: 12, sm: 16, md: 18 }}
              pb={{ base: 16, sm: 18, md: 20 }}
            >
              <Carousel
                getEmblaApi={(api) => {
                  emblaRef.current = api;
                }}
                withControls={false}
                slideGap="md"
                slideSize={{ base: '85%', sm: '45%', md: '30%', lg: '22%' }}
                emblaOptions={{
                  align: 'start',
                  loop: true,
                  dragFree: true,
                }}
                plugins={[autoplay.current]}
                styles={{
                  viewport: {
                    paddingTop: 8,
                    paddingBottom: 8,
                  },
                }}
              >
                {slides}
              </Carousel>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default Premium;

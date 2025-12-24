import { useEffect, useRef, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Image, Text, Stack, rem, Skeleton } from '@mantine/core';
import theme from '@/shared/theme';
import { fetchBanners } from '@/shared/api/services/banner';

type BannerItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

function Banner() {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [items, setItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchBanners();
        setItems(
          (res.data || []).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
          }))
        );
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Bannerlarni yuklashda xatolik'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box
        w="100%"
        mb="lg"
        style={{
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <Skeleton height={260} radius={16} />
      </Box>
    );
  }

  if (error || !items.length) return null;

  return (
    <Box
      w="100%"
      mb="lg"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 10px 30px ${theme.colors?.gray?.[2]}`,
      }}
    >
      <Carousel
        withControls={items.length > 1}
        withIndicators
        // @ts-expect-error loop mavjud, typingda yo'q
        loop
        plugins={[autoplay.current]}
        onMouseEnter={() => autoplay.current?.stop()}
        onMouseLeave={() => autoplay.current?.reset()}
        height={rem(260)}
        slideSize="100%"
        styles={{
          control: {
            backgroundColor: theme.other?.mainWhite,
            color: theme.colors?.gray?.[7],
            boxShadow: `0 4px 12px ${theme.colors?.gray?.[2]}`,
            borderRadius: 999,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
          },
          indicators: {
            bottom: rem(10),
          },
          indicator: {
            width: rem(24),
            height: rem(6),
            borderRadius: rem(6),
            transition: 'width 150ms ease',
          },
        }}
      >
        {items.map(item => (
          <Carousel.Slide key={item.id}>
            <Box
              w="100%"
              h="100%"
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                w="100%"
                h="100%"
                fit="cover"
              />
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: rem(24),
                }}
              >
                <Stack gap={6} maw={{ base: '100%', sm: '60%' }}>
                  <Text
                    fw={700}
                    fz={{ base: 22, sm: 26 }}
                    c={theme.other?.mainWhite}
                  >
                    {item.title}
                  </Text>
                  <Text
                    fz={{ base: 14, sm: 16 }}
                    c={theme.other?.mainWhite}
                    lineClamp={3}
                  >
                    {item.description}
                  </Text>
                </Stack>
              </Box>
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}

export default Banner;

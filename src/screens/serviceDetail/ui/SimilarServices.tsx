import { Carousel } from '@mantine/carousel';
import { Box, Title, Text, Loader, Center } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getSimilarServices } from '@/shared/api/services/service/service.api';
import type { IPopularService } from '@/shared/api/services/service/service.types';
import { Card } from '@/shared/ui/card';
import theme from '@/shared/theme';

interface SimilarServicesProps {
    slug: string;
}

const formatPrice = (priceFrom: number, priceTo: number) => {
    const formatUZS = (value: number) => new Intl.NumberFormat('uz-UZ').format(value);
    if (priceFrom === priceTo) {
        return `${formatUZS(priceFrom)} so'm`;
    }
    return `${formatUZS(priceFrom)} - ${formatUZS(priceTo)} so'm`;
};

export function SimilarServices({ slug }: SimilarServicesProps) {
    const [services, setServices] = useState<IPopularService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            setLoading(true);
            try {
                const data = await getSimilarServices(slug);
                setServices(data);
            } catch (error) {
                console.error('Error fetching similar services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSimilar();
    }, [slug]);

    if (loading) {
        return (
            <Center py={60}>
                <Loader size="md" color="blue" />
            </Center>
        );
    }

    if (services.length === 0) return null;

    return (
        <Box mt={80} mb={60}>
            <Box mb="xl">
                <Title order={2} fw={800} fz={32} c={theme.colors?.gray?.[9]} mb={8}>
                    O'xshash e'lonlar
                </Title>
                <Text c="dimmed" fz="lg">
                    Sizni qiziqtirishi mumkin bo'lgan boshqa takliflar
                </Text>
            </Box>

            <div style={{ margin: '0 -10px' }}>
                <Carousel
                    slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '25%' }}
                    slideGap="md"
                    controlsOffset="xs"
                    styles={{
                        control: {
                            backgroundColor: theme.other?.mainWhite,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: `1px solid ${theme.colors?.gray?.[2]}`,
                            width: 40,
                            height: 40,
                            '&[data-inactive]': {
                                opacity: 0,
                                cursor: 'default',
                            },
                            '&:hover': {
                                backgroundColor: theme.colors?.gray?.[0],
                                transform: 'scale(1.05)'
                            }
                        },
                        viewport: {
                            padding: '10px'
                        }
                    }}
                >
                    {services.map((service) => (
                        <Carousel.Slide key={service.id}>
                            <Card
                                image={
                                    service.images?.[0]?.medium ||
                                    service.images?.[0]?.small ||
                                    service.images?.[0]?.large ||
                                    service.category?.image ||
                                    ''
                                }
                                category={service.category?.name || ''}
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
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </div>
        </Box>
    );
}

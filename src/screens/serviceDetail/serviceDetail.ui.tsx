import { useState, useEffect, useMemo } from 'react';
import { useParams } from '@/shared/lib/router';
import {
  Box,
  Text,
  Stack,
  Flex,
  Group,
  Badge,
  Button,
  Paper,
  Grid,
  Image,
  Title,
} from '@mantine/core';
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoGlobeOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import { getServiceBySlug } from '@/shared/api/services/service/service.api';
import type { ServiceDetail } from '@/shared/api/services/service/service.types';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { ServiceDetailSkeleton } from './ui/serviceDetailSkeleton';
import { Breadcrumbs } from '@/screens/category/ui/breadcrumbs';
import ServiceReviews from './ui/ServiceReviews';
import { SimilarServices } from './ui/SimilarServices';

function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await getServiceBySlug(slug);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const breadcrumbItems = useMemo(() => {
    if (!service) return [];
    return [
      { label: 'Asosiy', href: '/' },
      {
        label: service.category.name,
        href: `/category/${service.category.slug}`,
      },
      { label: service.name },
    ];
  }, [service]);

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return (
      <Box
        w="100%"
        bg={theme.colors?.gray?.[0]}
        style={{ minHeight: '100vh' }}
        py="xl"
      >
        <Container>
          <Text>Xizmat topilmadi</Text>
        </Container>
      </Box>
    );
  }

  const images =
    service.images.length > 0
      ? service.images
        .map(img => img.large || img.medium || img.small)
        .filter(Boolean)
      : [];

  const mainImage = images[selectedImageIndex] || service.category.image || '';

  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      style={{ minHeight: '100vh' }}
      py="xl"
    >
      <Container>
        <Breadcrumbs items={breadcrumbItems} />

        <Grid gutter="xl">
          {/* Left Column - Images */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper
              radius="md"
              style={{
                backgroundColor: theme.other?.mainWhite,
                border: `1px solid ${theme.colors?.gray?.[2]}`,
                overflow: 'hidden',
              }}
            >
              {/* Main Image */}
              <Box
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={mainImage}
                  alt={service.name}
                  fit="cover"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <Box p="md">
                  <Flex gap="xs" wrap="wrap">
                    {images.map((img, index) => (
                      <Box
                        key={index}
                        style={{
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          borderRadius: 8,
                          overflow: 'hidden',
                          border:
                            selectedImageIndex === index
                              ? `2px solid ${theme.colors?.blue?.[6]}`
                              : `2px solid transparent`,
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                        onMouseEnter={e => {
                          if (selectedImageIndex !== index) {
                            e.currentTarget.style.borderColor =
                              theme.colors?.gray?.[4] || '#ced4da';
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedImageIndex !== index) {
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <Image
                          src={img}
                          alt={`${service.name} ${index + 1}`}
                          fit="cover"
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}
            </Paper>
          </Grid.Col>

          {/* Right Column - Info */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              {/* Header */}
              <Box>
                <Group gap="sm" mb="xs">
                  {service.category && (
                    <Badge
                      color="blue"
                      size="lg"
                      style={{
                        backgroundColor: theme.colors?.blue?.[6],
                        color: theme.other?.mainWhite,
                      }}
                    >
                      {service.category.name}
                    </Badge>
                  )}
                  {service.is_premium && (
                    <Badge
                      size="lg"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: theme.colors?.gray?.[9],
                        fontWeight: 700,
                      }}
                    >
                      Premium
                    </Badge>
                  )}
                </Group>
                <Title order={1} fw={700} mb="sm" c={theme.colors?.gray?.[9]}>
                  {service.name}
                </Title>
                <Group gap="md" mb="sm">
                  <Flex align="center" gap={6}>
                    <IoLocationOutline
                      size={18}
                      color={theme.colors?.gray?.[6]}
                    />
                    <Text fz={14} c={theme.colors?.gray?.[7]}>
                      {service.city.name}, {service.district.name}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={6}>
                    <FaStar size={16} color="#FFB800" />
                    <Text fz={14} c={theme.colors?.gray?.[7]}>
                      {service.rating} ({service.comments?.length || 0} sharh)
                    </Text>
                  </Flex>
                  <Flex align="center" gap={6}>
                    <LuEye size={16} color={theme.colors?.gray?.[6]} />
                    <Text fz={14} c={theme.colors?.gray?.[6]}>
                      {service.view_count}
                    </Text>
                  </Flex>
                </Group>
              </Box>

              {/* Price */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: theme.colors?.blue?.[0],
                  border: `1px solid ${theme.colors?.blue?.[2]}`,
                }}
              >
                <Text fw={600} fz={24} c={theme.colors?.blue?.[6]}>
                  {service.price_from === service.price_to
                    ? `${service.price_from.toLocaleString('uz-UZ')} so'm`
                    : `${service.price_from.toLocaleString('uz-UZ')} - ${service.price_to.toLocaleString('uz-UZ')} so'm`}
                </Text>
              </Paper>

              {/* Contact Info */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: theme.other?.mainWhite,
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                }}
              >
                <Stack gap="md">
                  <Text fw={600} fz={16} c={theme.colors?.gray?.[9]}>
                    Aloqa ma'lumotlari
                  </Text>
                  {service.phone && (
                    <Flex align="center" gap={10}>
                      <IoCallOutline
                        size={20}
                        color={theme.colors?.blue?.[6]}
                      />
                      <Text fz={14} c={theme.colors?.gray?.[8]}>
                        {service.phone}
                      </Text>
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        ml="auto"
                        onClick={() =>
                          window.open(`tel:${service.phone}`, '_self')
                        }
                      >
                        Qo'ng'iroq qilish
                      </Button>
                    </Flex>
                  )}
                  {service.email && (
                    <Flex align="center" gap={10}>
                      <IoMailOutline
                        size={20}
                        color={theme.colors?.blue?.[6]}
                      />
                      <Text fz={14} c={theme.colors?.gray?.[8]}>
                        {service.email}
                      </Text>
                    </Flex>
                  )}
                  {service.website && (
                    <Flex align="center" gap={10}>
                      <IoGlobeOutline
                        size={20}
                        color={theme.colors?.blue?.[6]}
                      />
                      <Text
                        fz={14}
                        c={theme.colors?.blue?.[6]}
                        style={{ cursor: 'pointer' }}
                        onClick={() => window.open(service.website!, '_blank')}
                      >
                        {service.website}
                      </Text>
                    </Flex>
                  )}
                  {service.address && (
                    <Flex align="flex-start" gap={10}>
                      <IoLocationOutline
                        size={20}
                        color={theme.colors?.blue?.[6]}
                        style={{ marginTop: 2 }}
                      />
                      <Text fz={14} c={theme.colors?.gray?.[8]}>
                        {service.address}
                      </Text>
                    </Flex>
                  )}
                  {service.working_hours && (
                    <Flex align="center" gap={10}>
                      <IoTimeOutline
                        size={20}
                        color={theme.colors?.blue?.[6]}
                      />
                      <Text fz={14} c={theme.colors?.gray?.[8]}>
                        {service.working_hours}
                      </Text>
                    </Flex>
                  )}
                </Stack>
              </Paper>

              {/* Social Links */}
              {service.socials &&
                Object.values(service.socials).some(v => v) && (
                  <Paper
                    p="md"
                    radius="md"
                    style={{
                      backgroundColor: theme.other?.mainWhite,
                      border: `1px solid ${theme.colors?.gray?.[2]}`,
                    }}
                  >
                    <Text fw={600} fz={16} c={theme.colors?.gray?.[9]} mb="sm">
                      Ijtimoiy tarmoqlar
                    </Text>
                    <Group gap="md">
                      {service.socials.instagram && (
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() =>
                            window.open(
                              service.socials!.instagram!.startsWith('http')
                                ? service.socials!.instagram
                                : `https://instagram.com/${service.socials!.instagram}`,
                              '_blank'
                            )
                          }
                        >
                          Instagram
                        </Button>
                      )}
                      {service.socials.telegram && (
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() =>
                            window.open(
                              service.socials!.telegram!.startsWith('http')
                                ? service.socials!.telegram
                                : `https://t.me/${service.socials!.telegram}`,
                              '_blank'
                            )
                          }
                        >
                          Telegram
                        </Button>
                      )}
                      {service.socials.facebook && (
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() =>
                            window.open(service.socials!.facebook!, '_blank')
                          }
                        >
                          Facebook
                        </Button>
                      )}
                      {service.socials.youtube && (
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() =>
                            window.open(service.socials!.youtube!, '_blank')
                          }
                        >
                          YouTube
                        </Button>
                      )}
                    </Group>
                  </Paper>
                )}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Description Section */}
        <Paper
          p="xl"
          radius="md"
          mt="xl"
          style={{
            backgroundColor: theme.other?.mainWhite,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
          }}
        >
          <Title order={2} fw={600} mb="md" c={theme.colors?.gray?.[9]}>
            Tavsif
          </Title>
          <Text
            fz={15}
            c={theme.colors?.gray?.[7]}
            style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
          >
            {service.description}
          </Text>
        </Paper>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <Paper
            p="xl"
            radius="md"
            mt="xl"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
            }}
          >
            <Title order={2} fw={600} mb="md" c={theme.colors?.gray?.[9]}>
              Xususiyatlar
            </Title>
            <Group gap="sm">
              {service.features.map(feature => (
                <Badge
                  key={feature.id}
                  size="lg"
                  variant="light"
                  style={{
                    backgroundColor: theme.colors?.blue?.[0],
                    border: `1px solid ${theme.colors?.blue?.[2]}`,
                    color: theme.colors?.blue?.[7],
                  }}
                >
                  {feature.name}
                </Badge>
              ))}
            </Group>
          </Paper>
        )}

        {/* Reviews Section */}
        {service && <ServiceReviews serviceId={service.id} />}

        {/* Similar Services Section */}
        {slug && <SimilarServices slug={slug} />}
      </Container>
    </Box>
  );
}

export default ServiceDetailPage;

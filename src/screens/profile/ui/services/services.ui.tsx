import {
  Box,
  Flex,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Button,
  Image,
  SimpleGrid,
  Loader,
  Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from '@/shared/lib/router';
import theme from '@/shared/theme';
import {
  TbEye,
  TbStar,
  TbMessageCircle,
  TbEdit,
  TbTrash,
  TbMapPin,
  TbCrown,
  TbCalendar,
  TbAlertCircle,
  TbCheck,
} from 'react-icons/tb';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { getProfileServices } from '@/shared/api/services/profile';
import { deleteService } from '@/shared/api/services/service';
import type { UserService } from '@/shared/api/services/profile/profile.types';
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal';

import { openNotification } from '@/shared/lib/notification';

interface ServicesProps {
  onEdit?: (service: UserService) => void;
  onDelete?: (serviceId: number) => void;
}

function Services({ onEdit }: ServicesProps) {
  const navigate = useNavigate();
  const [services, setServices] = useState<UserService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Delete modal state
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<UserService | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await getProfileServices();
      if (response.accept && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Xizmatlarni yuklashda xatolik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleDeleteClick = (service: UserService) => {
    setServiceToDelete(service);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);

      // Remove from list
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));

      // Show success notification
      openNotification({
        title: "Xizmat muvaffaqiyatli o'chirildi!",
        icon: <TbCheck size={20} />,
        type: 'success',
      });

      setDeleteModalOpened(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Xizmatni o'chirishda xatolik:", error);
      openNotification({
        title: "Xizmatni o'chirishda xatolik yuz berdi",
        icon: <TbAlertCircle size={24} />,
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (from: number, to: number) => {
    if (from === to) {
      return `${from.toLocaleString('uz-UZ')} so'm`;
    }
    return `${from.toLocaleString('uz-UZ')} - ${to.toLocaleString('uz-UZ')} so'm`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Center py={60}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="blue" />
          <Text c={theme.colors?.gray?.[6]} fz={14}>
            Xizmatlar yuklanmoqda...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (services.length === 0) {
    return (
      <Box>
        <Card
          p="xl"
          radius="md"
          style={{
            backgroundColor: theme.other?.mainWhite,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
            textAlign: 'center',
          }}
        >
          <Stack align="center" gap="md">
            <MdOutlineImageNotSupported
              size={64}
              color={theme.colors?.gray?.[5]}
            />
            <Text fw={600} fz={18} c={theme.colors?.gray?.[9]}>
              Hali xizmatlar yo'q
            </Text>
            <Text fz={14} c={theme.colors?.gray?.[6]}>
              Birinchi xizmatni qo'shing va mijozlar sizni topsin!
            </Text>
            <Button
              variant="filled"
              color="blue"
              onClick={() => navigate('/profile#add-service')}
            >
              Xizmat qo'shish
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb="xl"
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'md' }}
      >
        <Text fw={700} fz={{ base: 18, sm: 22 }} c={theme.colors?.gray?.[9]}>
          Mening xizmatlarim
        </Text>
        <Badge
          size="lg"
          radius="xl"
          color="blue"
          variant="light"
          style={{
            backgroundColor: theme.colors?.blue?.[0],
            border: `1px solid ${theme.colors?.blue?.[2]}`,
          }}
        >
          {services.length} ta
        </Badge>
      </Flex>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" verticalSpacing="lg">
        {services.map(service => (
          <Card
            key={service.id}
            p={{ base: 'md', sm: 'lg' }}
            radius="lg"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 16px 32px ${theme.colors?.gray?.[3]}`,
                  borderColor: theme.colors?.blue?.[4],
                },
              },
            }}
            onClick={() => navigate(`/service/${service.slug}`)}
          >
            {/* Premium badge */}
            {service.is_premium && (
              <Badge
                size="md"
                radius="md"
                variant="filled"
                leftSection={<TbCrown size={14} />}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  background: `linear-gradient(135deg, ${theme.colors?.yellow?.[6]} 0%, ${theme.colors?.orange?.[6]} 100%)`,
                  boxShadow: '0 4px 12px rgba(250, 197, 21, 0.4)',
                }}
              >
                Premium
              </Badge>
            )}

            <Stack gap="md">
              {/* Image */}
              <Box
                w="100%"
                h={200}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: theme.colors?.gray?.[1],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {imageErrors[service.id] || !service.images?.[0] ? (
                  <MdOutlineImageNotSupported
                    size={48}
                    color={theme.colors?.gray?.[5]}
                  />
                ) : (
                  <Image
                    src={service.images[0].medium || service.images[0].small}
                    alt={service.name}
                    w="100%"
                    h="100%"
                    fit="cover"
                    onError={() => handleImageError(service.id)}
                  />
                )}
              </Box>

              {/* Content */}
              <Stack gap="xs">
                {/* Title and category */}
                <Box>
                  <Text
                    fw={700}
                    fz={18}
                    c={theme.colors?.gray?.[9]}
                    lineClamp={1}
                    mb={4}
                  >
                    {service.name}
                  </Text>
                  <Badge
                    size="sm"
                    radius="md"
                    color="blue"
                    variant="light"
                    style={{ width: 'fit-content' }}
                  >
                    {service.category.name}
                  </Badge>
                </Box>

                {/* Description */}
                <Text
                  fz={14}
                  c={theme.colors?.gray?.[6]}
                  lineClamp={2}
                  style={{ minHeight: 40 }}
                >
                  {service.description}
                </Text>

                {/* Location */}
                <Group gap={6}>
                  <TbMapPin size={16} color={theme.colors?.blue?.[6]} />
                  <Text fz={13} c={theme.colors?.gray?.[7]} lineClamp={1}>
                    {service.city.name}, {service.district.name}
                  </Text>
                </Group>

                {/* Stats */}
                <Group gap="md" mt="xs" wrap="wrap">
                  <Group gap={4}>
                    <TbEye size={16} color={theme.colors?.gray?.[6]} />
                    <Text fz={13} c={theme.colors?.gray?.[6]}>
                      {service.view_count}
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <TbMessageCircle
                      size={16}
                      color={theme.colors?.gray?.[6]}
                    />
                    <Text fz={13} c={theme.colors?.gray?.[6]}>
                      {service.comment_count || 0}
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <TbStar size={16} color={theme.colors?.yellow?.[6]} />
                    <Text fz={13} c={theme.colors?.gray?.[6]} fw={600}>
                      {service.rating.toFixed(1)}
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <TbCalendar size={16} color={theme.colors?.gray?.[6]} />
                    <Text fz={12} c={theme.colors?.gray?.[6]}>
                      {formatDate(service.created_at)}
                    </Text>
                  </Group>
                </Group>

                {/* Price */}
                <Box
                  mt="xs"
                  p="sm"
                  style={{
                    backgroundColor: theme.colors?.blue?.[0],
                    borderRadius: 8,
                    border: `1px solid ${theme.colors?.blue?.[2]}`,
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Text fz={12} c={theme.colors?.gray?.[7]} fw={500}>
                      Narxi:
                    </Text>
                    <Text
                      fw={700}
                      fz={16}
                      c={theme.colors?.blue?.[6]}
                      style={{ letterSpacing: '0.3px' }}
                    >
                      {formatPrice(service.price_from, service.price_to)}
                    </Text>
                  </Flex>
                  {service.discount_percent > 0 && (
                    <Badge
                      size="sm"
                      color="red"
                      variant="filled"
                      mt={4}
                      style={{ width: 'fit-content' }}
                    >
                      -{service.discount_percent}% chegirma
                    </Badge>
                  )}
                </Box>

                {/* Actions */}
                <Group gap="xs" mt="sm">
                  {onEdit && (
                    <Button
                      variant="light"
                      size="sm"
                      color="blue"
                      leftSection={<TbEdit size={16} />}
                      onClick={e => {
                        e.stopPropagation();
                        onEdit(service);
                      }}
                      style={{ flex: 1 }}
                    >
                      Tahrirlash
                    </Button>
                  )}
                  <Button
                    variant="light"
                    size="sm"
                    color="red"
                    leftSection={<TbTrash size={16} />}
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteClick(service);
                    }}
                    style={{ flex: 1 }}
                  >
                    O'chirish
                  </Button>
                </Group>
              </Stack>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        serviceName={serviceToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </Box>
  );
}

export default Services;

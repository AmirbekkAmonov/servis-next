import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Stack,
  Box,
  Flex,
} from '@mantine/core';
import { useNavigate } from '@/shared/lib/router';
import theme from '@/shared/theme';
import {
  TbCalendar,
  TbMapPin,
  TbPhone,
  TbEye,
} from 'react-icons/tb';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { useState } from 'react';
import type { IOrderItem } from '@/shared/api/services/order/order.types';
import {
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusText,
  getStatusIcon,
} from '../../orders.const';

interface OrderCardProps {
  order: IOrderItem;
  onView?: (order: IOrderItem) => void;
  onCancel?: (orderId: number) => void;
}

function OrderCard({ order, onView, onCancel }: OrderCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleViewClick = () => {
    if (onView) {
      onView(order);
    } else if (order.category?.slug) {
      navigate(`/category/${order.category.slug}`);
    }
  };

  return (
    <Card
      p="md"
      radius="md"
      style={{
        backgroundColor: theme.other?.mainWhite,
        border: `1px solid ${theme.colors?.gray?.[2]}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 24px ${theme.colors?.gray?.[3]}`,
            borderColor: theme.colors?.blue?.[4],
          },
        },
      }}
    >
      {/* Status Badge */}
      <Badge
        size="lg"
        radius="xl"
        color={getStatusColor(order.status)}
        variant="light"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          backgroundColor:
            theme.colors?.[
            getStatusColor(order.status) as keyof typeof theme.colors
            ]?.[0],
          border: `1px solid ${theme.colors?.[getStatusColor(order.status) as keyof typeof theme.colors]?.[2]}`,
          fontWeight: 600,
        }}
      >
        <Group gap={4}>
          <span>{getStatusIcon(order.status)}</span>
          <Text fz={12}>{getStatusText(order.status)}</Text>
        </Group>
      </Badge>

      <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
        {/* Image */}
        <Box
          w={{ base: '100%', sm: 200 }}
          h={{ base: 180, sm: 160 }}
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: theme.colors?.gray?.[1],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {imageError ? (
            <MdOutlineImageNotSupported
              size={48}
              color={theme.colors?.gray?.[5]}
            />
          ) : (
            <Image
              src={order.category?.image || ''}
              alt={order.title}
              w="100%"
              h="100%"
              fit="cover"
              onError={() => setImageError(true)}
            />
          )}
          {order.category && (
            <Badge
              size="sm"
              color="blue"
              radius="md"
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: theme.colors?.blue?.[6],
                color: theme.other?.mainWhite,
              }}
            >
              {order.category.name}
            </Badge>
          )}
        </Box>

        {/* Content */}
        <Stack gap="sm" style={{ flex: 1 }}>
          <Stack gap={4}>
            <Text fw={700} fz={18} c={theme.colors?.gray?.[9]} lineClamp={1}>
              {order.title}
            </Text>
            {order.description && (
              <Text fz={14} c={theme.colors?.gray?.[6]} lineClamp={2}>
                {order.description}
              </Text>
            )}
          </Stack>

          {/* Order Info */}
          <Stack gap="xs">
            <Group gap="xs">
              <TbCalendar size={16} color={theme.colors?.gray?.[6]} />
              <Text fz={12} c={theme.colors?.gray?.[6]}>
                {formatDate(order.date)} {order.time}
              </Text>
            </Group>
            {(order.city || order.district) && (
              <Group gap="xs">
                <TbMapPin size={16} color={theme.colors?.gray?.[6]} />
                <Text fz={12} c={theme.colors?.gray?.[6]} lineClamp={1}>
                  {order.city?.name}{order.city?.name && order.district?.name ? ', ' : ''}{order.district?.name}
                </Text>
              </Group>
            )}
            {order.contacts?.phone && (
              <Group gap="xs">
                <TbPhone size={16} color={theme.colors?.gray?.[6]} />
                <Text fz={12} c={theme.colors?.gray?.[6]}>
                  {order.contacts.phone}
                </Text>
              </Group>
            )}
          </Stack>

          {/* Rate status checks replaced with relevant enums */}
          {order.status === 'closed' && (
            <Text fz={12} c="green" fw={600}>Yakunlangan</Text>
          )}

          {/* Price & Actions */}
          <Flex
            justify="space-between"
            align="center"
            gap="md"
            mt="xs"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Text fw={700} fz={20} c={theme.colors?.blue?.[6]}>
              {formatPrice(order.expected_price)}
            </Text>
            <Group gap="xs" wrap="nowrap">
              <Button
                variant="light"
                size="xs"
                color="blue"
                leftSection={<TbEye size={14} />}
                onClick={handleViewClick}
              >
                Ko'rish
              </Button>
              {order.status === 'new' && onCancel && (
                <Button
                  variant="light"
                  size="xs"
                  color="red"
                  onClick={() => onCancel(order.id)}
                >
                  Bekor qilish
                </Button>
              )}
            </Group>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
}

export default OrderCard;

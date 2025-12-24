import {
  Box,
  Flex,
  Text,
  Stack,
  Group,
  Badge,
  SimpleGrid,
  Paper,
  Center,
} from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import {
  TbShoppingCart,
  TbClock,
  TbCheck,
  TbRefresh,
  TbX,
} from 'react-icons/tb';
import { OrderCard } from './ui/orderCard';
import { Filters } from './ui/filters';
import {
  type OrderStatusFilter,
  type OrderSortOption,
} from './orders.const';
import { getOrders } from '@/shared/api/services/order/order.api';
import type { IOrderItem } from '@/shared/api/services/order/order.types';
import { getCategories, getRegions, getDistricts, type CategoryItem, type Region, type District } from '@/screens/category/category.api';
import { Loader, Pagination } from '@mantine/core';

function Orders() {
  const [orders, setOrders] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<OrderSortOption>('newest');

  // Metadata states
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  // Statistics from state or separate API call if needed (for now calculate from visible or local)
  // Realistically, stats should probably come from backend or we just show total

  // Fetch initial metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, regs] = await Promise.all([getCategories(), getRegions()]);
        setCategories(cats);
        setRegions(regs);
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (cityId) {
      const region = regions.find(r => r.id === cityId);
      if (region) {
        getDistricts(region.slug).then(setDistricts).catch(console.error);
      }
    } else {
      setDistricts([]);
    }
  }, [cityId, regions]);

  // Fetch orders
  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        category_id: categoryId || undefined,
        city_id: cityId || undefined,
        district_id: districtId || undefined,
        page: currentPage,
        size: 15,
        // Sort option handling could be added here if backend supports it
      });
      setOrders(response.data);
      setTotalCount(response.meta.total);
      setTotalPages(response.meta.last_page);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [searchQuery, statusFilter, categoryId, cityId, districtId, currentPage, sortOption]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: totalCount,
      pending: orders.filter(o => o.status === 'new').length, // This is just for currently visible
      inProgress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'closed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders, totalCount]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryId(null);
    setCityId(null);
    setDistrictId(null);
    setSortOption('newest');
    setCurrentPage(1);
  };

  const handleViewOrder = (order: IOrderItem) => {
    console.log('View order:', order);
    // TODO: Navigate to order detail
  };

  const handleCancelOrder = (orderId: number) => {
    console.log('Cancel order:', orderId);
    // TODO: Implement cancel order logic
  };

  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      style={{ minHeight: '100vh' }}
      py="xl"
    >
      <Container>
        {/* Header */}
        <Box mb="xl">
          <Flex
            justify="space-between"
            align="center"
            mb="lg"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 'md', sm: 'lg' }}
          >
            <Group gap="md">
              <Box
                p="md"
                style={{
                  backgroundColor: theme.colors?.blue?.[0],
                  borderRadius: 16,
                }}
              >
                <TbShoppingCart size={32} color={theme.colors?.blue?.[6]} />
              </Box>
              <Stack gap={4}>
                <Text fw={700} fz={28} c={theme.colors?.gray?.[9]}>
                  Mening zakazlarim
                </Text>
                <Text fz={14} c={theme.colors?.gray?.[6]}>
                  Barcha zakazlaringizni ko'ring va boshqaring
                </Text>
              </Stack>
            </Group>
            <Badge size="xl" radius="xl" color="blue" variant="light">
              {stats.total} ta zakaz
            </Badge>
          </Flex>

          {/* Statistics Cards */}
          <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="md">
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.other?.mainWhite,
                border: `1px solid ${theme.colors?.gray?.[2]}`,
              }}
            >
              <Stack gap={4} align="center">
                <Text fw={700} fz={24} c={theme.colors?.gray?.[9]}>
                  {stats.total}
                </Text>
                <Text fz={12} c={theme.colors?.gray?.[6]} ta="center">
                  Jami
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.yellow?.[0],
                border: `1px solid ${theme.colors?.yellow?.[2]}`,
              }}
            >
              <Stack gap={4} align="center">
                <Group gap={4}>
                  <TbClock size={16} color={theme.colors?.yellow?.[6]} />
                  <Text fw={700} fz={24} c={theme.colors?.gray?.[9]}>
                    {stats.pending}
                  </Text>
                </Group>
                <Text fz={12} c={theme.colors?.gray?.[6]} ta="center">
                  Kutilmoqda
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.orange?.[0],
                border: `1px solid ${theme.colors?.orange?.[2]}`,
              }}
            >
              <Stack gap={4} align="center">
                <Group gap={4}>
                  <TbRefresh size={16} color={theme.colors?.orange?.[6]} />
                  <Text fw={700} fz={24} c={theme.colors?.gray?.[9]}>
                    {stats.inProgress}
                  </Text>
                </Group>
                <Text fz={12} c={theme.colors?.gray?.[6]} ta="center">
                  Jarayonda
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.green?.[0],
                border: `1px solid ${theme.colors?.green?.[2]}`,
              }}
            >
              <Stack gap={4} align="center">
                <Group gap={4}>
                  <TbCheck size={16} color={theme.colors?.green?.[6]} />
                  <Text fw={700} fz={24} c={theme.colors?.gray?.[9]}>
                    {stats.completed}
                  </Text>
                </Group>
                <Text fz={12} c={theme.colors?.gray?.[6]} ta="center">
                  Yakunlangan
                </Text>
              </Stack>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.red?.[0],
                border: `1px solid ${theme.colors?.red?.[2]}`,
              }}
            >
              <Stack gap={4} align="center">
                <Group gap={4}>
                  <TbX size={16} color={theme.colors?.red?.[6]} />
                  <Text fw={700} fz={24} c={theme.colors?.gray?.[9]}>
                    {stats.cancelled}
                  </Text>
                </Group>
                <Text fz={12} c={theme.colors?.gray?.[6]} ta="center">
                  Bekor qilingan
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Box>

        {/* Filters */}
        <Box mb="xl">
          <Filters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryId={categoryId}
            cityId={cityId}
            districtId={districtId}
            sortOption={sortOption}
            categories={categories}
            regions={regions}
            districts={districts}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryId}
            onCityChange={setCityId}
            onDistrictChange={setDistrictId}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
            totalOrders={totalCount}
            filteredCount={orders.length}
          />
        </Box>

        {/* Orders List */}
        {loading ? (
          <Center py={50}>
            <Loader size="xl" />
          </Center>
        ) : orders.length > 0 ? (
          <Stack gap="lg">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleViewOrder}
                onCancel={handleCancelOrder}
              />
            ))}
            {totalPages > 1 && (
              <Flex justify="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                  radius="xl"
                  size="lg"
                />
              </Flex>
            )}
          </Stack>
        ) : (
          <Paper
            p="xl"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
            }}
          >
            <Stack gap="md" align="center">
              <Text fz={48}>📦</Text>
              <Text fw={600} fz={18} c={theme.colors?.gray?.[9]}>
                Zakazlar topilmadi
              </Text>
              <Text fz={14} c={theme.colors?.gray?.[6]} ta="center">
                Filtrlarni o'zgartiring yoki yangi zakaz qiling
              </Text>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default Orders;

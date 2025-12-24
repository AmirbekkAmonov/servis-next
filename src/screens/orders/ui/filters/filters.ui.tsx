import {
  Box,
  Flex,
  Text,
  Select,
  Button,
  Group,
  Badge,
  Stack,
  TextInput,
  SimpleGrid,
} from '@mantine/core';
import theme from '@/shared/theme';
import { TbFilter, TbX, TbSearch } from 'react-icons/tb';
import type { OrderStatusFilter, OrderSortOption } from '../../orders.const';
import type { CategoryItem, Region, District } from '@/screens/category/category.api';

interface FiltersProps {
  searchQuery: string;
  statusFilter: OrderStatusFilter;
  categoryId: number | null;
  cityId: number | null;
  districtId: number | null;
  sortOption: OrderSortOption;
  categories: CategoryItem[];
  regions: Region[];
  districts: District[];
  onSearchChange: (val: string) => void;
  onStatusChange: (status: OrderStatusFilter) => void;
  onCategoryChange: (id: number | null) => void;
  onCityChange: (id: number | null) => void;
  onDistrictChange: (id: number | null) => void;
  onSortChange: (sort: OrderSortOption) => void;
  onClearFilters: () => void;
  totalOrders: number;
  filteredCount: number;
}

function Filters({
  searchQuery,
  statusFilter,
  categoryId,
  cityId,
  districtId,
  sortOption,
  categories,
  regions,
  districts,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onCityChange,
  onDistrictChange,
  onSortChange,
  onClearFilters,
  totalOrders,
  filteredCount,
}: FiltersProps) {
  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    categoryId !== null ||
    cityId !== null ||
    districtId !== null ||
    sortOption !== 'newest';

  return (
    <Box
      p="md"
      style={{
        backgroundColor: theme.other?.mainWhite,
        borderRadius: 12,
        border: `1px solid ${theme.colors?.gray?.[2]}`,
      }}
    >
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Group gap="xs">
            <TbFilter size={20} color={theme.colors?.blue?.[6]} />
            <Text fw={600} fz={16} c={theme.colors?.gray?.[9]}>
              Filtrlar
            </Text>
          </Group>
          <Badge size="lg" radius="xl" color="blue" variant="light">
            {filteredCount} / {totalOrders}
          </Badge>
        </Flex>

        <TextInput
          placeholder="Qidiruv..."
          leftSection={<TbSearch size={18} />}
          value={searchQuery}
          onChange={e => onSearchChange(e.currentTarget.value)}
        />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Select
            label="Kategoriya"
            placeholder="Tanlang"
            value={categoryId ? String(categoryId) : 'all'}
            onChange={value => onCategoryChange(value === 'all' ? null : Number(value))}
            data={[{ value: 'all', label: 'Barchasi' }, ...categories.map(c => ({ value: String(c.id), label: c.name }))]}
            searchable
          />

          <Select
            label="Shahar"
            placeholder="Tanlang"
            value={cityId ? String(cityId) : 'all'}
            onChange={value => onCityChange(value === 'all' ? null : Number(value))}
            data={[{ value: 'all', label: 'Barchasi' }, ...regions.map(r => ({ value: String(r.id), label: r.name }))]}
            searchable
          />

          <Select
            label="Tuman"
            placeholder="Tanlang"
            value={districtId ? String(districtId) : 'all'}
            onChange={value => onDistrictChange(value === 'all' ? null : Number(value))}
            data={[{ value: 'all', label: 'Barchasi' }, ...districts.map(d => ({ value: String(d.id), label: d.name }))]}
            disabled={!cityId}
            searchable
          />

          <Select
            label="Status"
            placeholder="Statusni tanlang"
            value={statusFilter}
            onChange={value =>
              onStatusChange((value as OrderStatusFilter) || 'all')
            }
            data={[
              { value: 'all', label: 'Barchasi' },
              { value: 'new', label: 'Yangi' },
              { value: 'in_progress', label: 'Jarayonda' },
              { value: 'taken', label: 'Qabul qilingan' },
              { value: 'closed', label: 'Yakunlangan' },
              { value: 'cancelled', label: 'Bekor qilingan' },
            ]}
          />

          <Select
            label="Saralash"
            placeholder="Saralash turini tanlang"
            value={sortOption}
            onChange={value =>
              onSortChange((value as OrderSortOption) || 'newest')
            }
            data={[
              { value: 'newest', label: 'Yangi' },
              { value: 'oldest', label: 'Eski' },
              { value: 'price_high', label: 'Narx: Yuqori' },
              { value: 'price_low', label: 'Narx: Past' },
            ]}
          />
        </SimpleGrid>

        {hasActiveFilters && (
          <Button
            variant="light"
            color="gray"
            leftSection={<TbX size={16} />}
            onClick={onClearFilters}
            fullWidth
            size="sm"
          >
            Filtrlarni tozalash
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default Filters;

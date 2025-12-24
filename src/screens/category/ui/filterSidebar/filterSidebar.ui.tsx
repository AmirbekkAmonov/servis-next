import { Box, Button, Divider, Flex } from '@mantine/core';
import theme from '@/shared/theme';
import { Categories } from './ui/categories';
import { RegionSelect } from './ui/regionSelect';
import { PriceRange } from './ui/priceRange';
import { RatingFilter } from './ui/ratingFilter';
import type { IHomeCategory } from '@/shared/api/services/home/home.types';
import {
  DEFAULT_PRICE_MIN,
  DEFAULT_PRICE_MAX,
  type FilterState,
  isFilterActive,
} from './filterSidebar.const';
import { IoTrashOutline } from 'react-icons/io5';

type Category = IHomeCategory;

type Region = {
  id: number;
  name: string;
  slug: string;
};

type District = {
  id: number;
  name: string;
  slug: string;
};

type FilterSidebarProps = {
  categories: Category[];
  regions: Region[];
  districts: District[];
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onClearAll: () => void;
  isLoadingCategories?: boolean;
  isLoadingRegions?: boolean;
  isLoadingDistricts?: boolean;
  isMobile?: boolean;
};

function FilterSidebar({
  categories,
  regions,
  districts,
  filter,
  onFilterChange,
  onClearAll,
  isLoadingCategories = false,
  isLoadingRegions = false,
  isLoadingDistricts = false,
  isMobile = false,
}: FilterSidebarProps) {
  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filter,
      categorySlug: filter.categorySlug === slug ? null : slug,
      subCategoryIds: [], // Reset subcategories when category changes
    });
  };

  const handleRegionChange = (value: string | null) => {
    onFilterChange({
      ...filter,
      regionSlug: value,
      districtSlug: null, // Reset district when region changes
    });
  };

  const handleDistrictChange = (value: string | null) => {
    onFilterChange({
      ...filter,
      districtSlug: value,
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    onFilterChange({
      ...filter,
      priceRange: value,
    });
  };

  const handleRatingChange = (ratings: number[]) => {
    onFilterChange({
      ...filter,
      ratings,
    });
  };

  const hasActiveFilters = isFilterActive(filter);

  return (
    <Box
      w={isMobile ? '100%' : 280}
      p={isMobile ? 0 : 'md'}
      bg={isMobile ? 'transparent' : theme.other?.mainWhite}
      className="filter-sidebar"
      style={{
        borderRadius: isMobile ? 0 : 12,
        border: isMobile ? 'none' : `1px solid ${theme.colors?.gray?.[2]}`,
        position: isMobile ? 'relative' : 'sticky',
        top: isMobile ? 0 : 100,
        alignSelf: 'flex-start',
        maxHeight: isMobile ? 'none' : 'calc(100vh - 120px)',
        overflowY: isMobile ? 'visible' : 'auto',
      }}
    >
      <Flex direction="column" gap="md">
        <Categories
          categories={categories}
          activeSlug={filter.categorySlug}
          onSelect={handleCategorySelect}
          isLoading={isLoadingCategories}
        />

        <Divider color={theme.colors?.gray?.[2]} />

        <RegionSelect
          regions={regions}
          districts={districts}
          selectedRegion={filter.regionSlug}
          selectedDistrict={filter.districtSlug}
          onRegionChange={handleRegionChange}
          onDistrictChange={handleDistrictChange}
          isLoadingRegions={isLoadingRegions}
          isLoadingDistricts={isLoadingDistricts}
        />

        <Divider color={theme.colors?.gray?.[2]} />

        <PriceRange
          min={DEFAULT_PRICE_MIN}
          max={DEFAULT_PRICE_MAX}
          value={filter.priceRange}
          onChange={handlePriceChange}
        />

        <Divider color={theme.colors?.gray?.[2]} />

        <RatingFilter
          selectedRatings={filter.ratings}
          onChange={handleRatingChange}
        />

        <Divider color={theme.colors?.gray?.[2]} />
        <Button
          variant="light"
          color="red"
          fullWidth
          disabled={!hasActiveFilters}
          leftSection={<IoTrashOutline size={16} />}
          onClick={onClearAll}
          styles={{
            root: {
              transition: 'all 0.2s ease',
              opacity: hasActiveFilters ? 1 : 0.6,
            },
          }}
        >
          Hammasini tozalash
        </Button>
      </Flex>
    </Box>
  );
}

export default FilterSidebar;

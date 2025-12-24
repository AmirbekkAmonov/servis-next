export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 1000000;

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(value) + " so'm";
};

export const formatPriceShort = (value: number): string => {
  if (value >= 100000) {
    return (value / 100000).toFixed(1).replace('.0', '') + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(0) + 'K';
  }
  return value.toString();
};

export type FilterState = {
  categorySlug: string | null;
  regionSlug: string | null;
  districtSlug: string | null;
  priceRange: [number, number];
  ratings: number[];
  subCategoryIds: number[];
};

export const initialFilterState: FilterState = {
  categorySlug: null,
  regionSlug: null,
  districtSlug: null,
  priceRange: [DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX],
  ratings: [],
  subCategoryIds: [],
};

export const isFilterActive = (filter: FilterState): boolean => {
  return (
    filter.categorySlug !== null ||
    filter.regionSlug !== null ||
    filter.districtSlug !== null ||
    filter.priceRange[0] !== DEFAULT_PRICE_MIN ||
    filter.priceRange[1] !== DEFAULT_PRICE_MAX ||
    filter.ratings.length > 0 ||
    filter.subCategoryIds.length > 0
  );
};

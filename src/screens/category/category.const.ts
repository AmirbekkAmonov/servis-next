export const ITEMS_PER_PAGE = 6;

export const getCategoryTitle = (slug: string | undefined): string => {
  if (!slug) return 'Barcha xizmatlar';

  // Convert slug to readable title
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const buildQueryParams = (params: {
  categorySlug?: string | null;
  categoryId?: number | null;
  regionSlug?: string | null;
  districtSlug?: string | null;
  priceMin?: number;
  priceMax?: number;
  ratings?: number[];
  page?: number;
  limit?: number;
  sort?: string | null;
  search?: string | null;
  subCategoryIds?: number[];
}): Record<string, string> => {
  const query: Record<string, string> = {};

  if (params.categoryId) {
    query.category_id = params.categoryId.toString();
  } else if (params.categorySlug) {
    query.category_id = params.categorySlug;
  }
  if (params.regionSlug) {
    query.city_id = params.regionSlug;
  }
  if (params.districtSlug) {
    query.district_id = params.districtSlug;
  }
  if (params.priceMin && params.priceMin > 0) {
    query.price_min = params.priceMin.toString();
  }
  if (params.priceMax && params.priceMax < 1000000) {
    query.price_max = params.priceMax.toString();
  }
  if (params.ratings && params.ratings.length > 0) {
    query.rating = params.ratings.join(',');
  }
  if (params.sort) {
    query.sort = params.sort;
  }
  if (params.search) {
    query.search = params.search;
  }
  if (params.subCategoryIds && params.subCategoryIds.length > 0) {
    params.subCategoryIds.forEach((id, index) => {
      query[`sub_category_ids[${index}]`] = id.toString();
    });
  }
  if (params.page) {
    query.page = params.page.toString();
  }
  if (params.limit) {
    query.size = params.limit.toString();
  }

  return query;
};

export const buildApiLink = (params: {
  categoryId?: number | null;
  regionSlug?: string | null;
  districtSlug?: string | null;
  priceMin?: number;
  priceMax?: number;
  ratings?: number[];
  sort?: string | null;
  page?: number;
  limit?: number;
  search?: string | null;
  subCategoryIds?: number[];
}) => {
  const qs = new URLSearchParams(buildQueryParams(params)).toString();
  return `/service/view${qs ? `?${qs}` : ''}`;
};

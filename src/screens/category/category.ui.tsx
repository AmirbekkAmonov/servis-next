import { Box, Flex, Button, Drawer, Text, Stack, Radio } from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from '@/shared/lib/router';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { Breadcrumbs } from './ui/breadcrumbs';
import {
  FilterSidebar,
  initialFilterState,
  type FilterState,
} from './ui/filterSidebar';
import { Content } from './ui/content';
import {
  getCategories,
  getRegions,
  getDistricts,
  getServices,
  getCategoryBySlug,
  type CategoryItem,
  type Region,
  type District,
  type ServiceItem,
} from './category.api';
import {
  ITEMS_PER_PAGE,
  getCategoryTitle,
  buildQueryParams,
  buildApiLink,
} from './category.const';
import { useMediaQuery } from '@mantine/hooks';
import { Banner } from '@/shared/ui/banner';
import { TbFilter, TbArrowsSort } from 'react-icons/tb';

function Category() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Data states
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isServerPaginated, setIsServerPaginated] = useState(false);

  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const { search } = useLocation();

  // Filter state
  const [filter, setFilter] = useState<FilterState>(() => {
    const searchParams = new URLSearchParams(search);
    const subIds: number[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('sub_category_ids')) {
        const id = parseInt(value);
        if (!isNaN(id)) subIds.push(id);
      }
    });

    return {
      ...initialFilterState,
      categorySlug: slug || null,
      subCategoryIds: subIds,
    };
  });

  // Current category name and image
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [sortValue, setSortValue] = useState<string | null>('popular');

  // Mobile drawers
  const [filterDrawerOpened, setFilterDrawerOpened] = useState(false);
  const [sortDrawerOpened, setSortDrawerOpened] = useState(false);

  // Sort options
  const SORT_OPTIONS = [
    { value: 'popular', label: 'Mashhur' },
    { value: 'cheap', label: 'Narx: pastdan yuqoriga' },
    { value: 'expensive', label: 'Narx: yuqoridan pastga' },
    { value: 'new', label: 'Yangi' },
    { value: 'rating', label: 'Reyting' },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      const data = await getCategories();
      setCategories(data);
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      const data = await getRegions();
      setRegions(data);
      setIsLoadingRegions(false);
    };
    fetchRegions();
  }, []);

  // Fetch districts when region changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!filter.regionSlug) {
        setDistricts([]);
        return;
      }
      setIsLoadingDistricts(true);
      const data = await getDistricts(filter.regionSlug);
      setDistricts(data);
      setIsLoadingDistricts(false);
    };
    fetchDistricts();
  }, [filter.regionSlug]);

  // Update filter when URL slug changes
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const subIds: number[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('sub_category_ids')) {
        const id = parseInt(value);
        if (!isNaN(id)) subIds.push(id);
      }
    });

    setFilter(prev => ({
      ...prev,
      categorySlug: slug || null,
      subCategoryIds: subIds.length > 0 ? subIds : prev.subCategoryIds,
    }));
    setCurrentPage(1);
  }, [slug, search]);

  // Fetch category name and image
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (slug) {
        const category = await getCategoryBySlug(slug);
        setCategoryName(category?.name || getCategoryTitle(slug));
        setCategoryImage(category?.image || '');
      } else {
        setCategoryName('Barcha xizmatlar');
        setCategoryImage('');
      }
    };
    fetchCategoryName();
  }, [slug]);

  // Handle sort change
  const handleSortChange = (value: string | null) => {
    setSortValue(value);
    setCurrentPage(1);
  };

  // Fetch services when filters change
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      const categoryId = categories.find(
        c => c.slug === filter.categorySlug
      )?.id;
      const queryParams = buildQueryParams({
        categoryId: categoryId ?? undefined,
        regionSlug: filter.regionSlug,
        districtSlug: filter.districtSlug,
        priceMin: filter.priceRange[0],
        priceMax: filter.priceRange[1],
        ratings: filter.ratings,
        sort: sortValue || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        subCategoryIds: filter.subCategoryIds,
      });
      const response = await getServices(queryParams);
      const nextServices = response.data || [];
      setServices(nextServices);

      if (response.meta) {
        setIsServerPaginated(true);
        setTotalCount(response.meta.total);
        setTotalPages(response.meta.last_page);
      } else {
        // Fallback: backend didn't return meta/pagination — paginate on client
        setIsServerPaginated(false);
        setTotalCount(nextServices.length);
        setTotalPages(
          Math.max(1, Math.ceil(nextServices.length / ITEMS_PER_PAGE))
        );
      }
      setIsLoadingServices(false);
    };
    fetchServices();
  }, [filter, currentPage, categories, sortValue]);

  // Sync browser URL with current filters (shows in address bar)
  useEffect(() => {
    const categoryId = categories.find(c => c.slug === filter.categorySlug)?.id;
    const apiLink = buildApiLink({
      categoryId: categoryId ?? undefined,
      regionSlug: filter.regionSlug,
      districtSlug: filter.districtSlug,
      priceMin: filter.priceRange[0],
      priceMax: filter.priceRange[1],
      ratings: filter.ratings,
      sort: sortValue || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      subCategoryIds: filter.subCategoryIds,
    });
    const qs = apiLink.split('?')[1] || '';
    const path = slug ? `/category/${slug}` : '/category';
    navigate(qs ? `${path}?${qs}` : path, { replace: true });
  }, [
    categories,
    filter.categorySlug,
    filter.regionSlug,
    filter.districtSlug,
    filter.priceRange,
    filter.ratings,
    sortValue,
    currentPage,
    navigate,
    slug,
  ]);

  const displayedServices = useMemo(() => {
    if (isServerPaginated) return services;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return services.slice(startIndex, endIndex);
  }, [services, currentPage, isServerPaginated]);

  // Handle filter change
  const handleFilterChange = (newFilter: FilterState) => {
    setFilter(newFilter);
    setCurrentPage(1);

    // Update URL if category changes
    if (newFilter.categorySlug !== filter.categorySlug) {
      if (newFilter.categorySlug) {
        navigate(`/category/${newFilter.categorySlug}`);
      } else {
        navigate('/category');
      }
    }
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setFilter(initialFilterState);
    setCurrentPage(1);
    navigate('/category');
  };

  // Breadcrumbs items
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Bosh sahifa', href: '/' },
    ];

    if (slug) {
      items.push({ label: 'Kategoriyalar', href: '/category' });
      items.push({ label: categoryName || getCategoryTitle(slug) });
    } else {
      items.push({ label: 'Kategoriyalar' });
    }

    return items;
  }, [slug, categoryName]);

  // Get active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filter.categorySlug) count++;
    if (filter.regionSlug) count++;
    if (filter.districtSlug) count++;
    if (filter.priceRange[0] > 0 || filter.priceRange[1] < 1000000) count++;
    if (filter.ratings.length > 0) count++;
    if (filter.subCategoryIds.length > 0) count++;
    return count;
  }, [filter]);

  return (
    <Box w="100%" mih="100vh" bg={theme.colors?.gray?.[0]} py="lg">
      <Container>
        <Box mb="lg">
          <Banner />
        </Box>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Mobile: Title and Filter/Sort buttons */}
        {isMobile && (
          <Box mb="md">
            <Text fw={600} fz={18} c={theme.colors?.gray?.[9]} mb="sm">
              {categoryName || 'Barcha xizmatlar'}
              {totalCount !== undefined && (
                <Text
                  component="span"
                  fz={14}
                  c={theme.colors?.gray?.[6]}
                  ml="xs"
                >
                  ({totalCount})
                </Text>
              )}
            </Text>
            <Flex gap="sm">
              <Button
                variant="outline"
                color="gray"
                leftSection={<TbFilter size={18} />}
                onClick={() => setFilterDrawerOpened(true)}
                style={{
                  flex: 1,
                  borderColor:
                    activeFiltersCount > 0
                      ? theme.colors?.blue?.[5]
                      : theme.colors?.gray?.[3],
                  color:
                    activeFiltersCount > 0
                      ? theme.colors?.blue?.[6]
                      : theme.colors?.gray?.[7],
                }}
              >
                Filtr {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <Button
                variant="outline"
                color="gray"
                leftSection={<TbArrowsSort size={18} />}
                onClick={() => setSortDrawerOpened(true)}
                style={{
                  flex: 1,
                  borderColor: theme.colors?.gray?.[3],
                }}
              >
                {SORT_OPTIONS.find(o => o.value === sortValue)?.label ||
                  'Saralash'}
              </Button>
            </Flex>
          </Box>
        )}

        <Flex
          gap="lg"
          direction={{ base: 'column', md: 'row' }}
          align="flex-start"
        >
          {/* Desktop: FilterSidebar */}
          {!isMobile && (
            <FilterSidebar
              categories={categories}
              regions={regions}
              districts={districts}
              filter={filter}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              isLoadingCategories={isLoadingCategories}
              isLoadingRegions={isLoadingRegions}
              isLoadingDistricts={isLoadingDistricts}
            />
          )}

          <Content
            title={categoryName || 'Barcha xizmatlar'}
            categoryImage={categoryImage}
            services={displayedServices}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onSortChange={isMobile ? undefined : handleSortChange}
            sortValue={sortValue}
            isLoading={isLoadingServices}
            totalCount={totalCount}
            hideHeader={isMobile}
          />
        </Flex>
      </Container>

      {/* Mobile: Filter Drawer */}
      <Drawer
        opened={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        title={
          <Flex justify="space-between" align="center" w="100%">
            <Text fw={600} fz={18}>
              Filtrlar
            </Text>
          </Flex>
        }
        position="bottom"
        size="100%"
        radius="0"
        styles={{
          header: {
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors?.gray?.[2]}`,
          },
          body: {
            padding: 0,
            height: '100%',
            overflow: 'auto',
          },
          content: {
            borderRadius: 0,
          },
        }}
      >
        <Box p="md" style={{ height: '100%', overflow: 'auto' }}>
          <FilterSidebar
            categories={categories}
            regions={regions}
            districts={districts}
            filter={filter}
            onFilterChange={newFilter => {
              handleFilterChange(newFilter);
            }}
            onClearAll={() => {
              handleClearAll();
            }}
            isLoadingCategories={isLoadingCategories}
            isLoadingRegions={isLoadingRegions}
            isLoadingDistricts={isLoadingDistricts}
            isMobile
          />
          <Box pt="md" pb="xl">
            <Button
              fullWidth
              size="md"
              color="blue"
              onClick={() => setFilterDrawerOpened(false)}
            >
              Natijalarni ko'rish
            </Button>
            <Button
              fullWidth
              variant="subtle"
              color="gray"
              mt="sm"
              onClick={() => setFilterDrawerOpened(false)}
            >
              Yopish
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Mobile: Sort BottomSheet */}
      <Drawer
        opened={sortDrawerOpened}
        onClose={() => setSortDrawerOpened(false)}
        title={
          <Text fw={600} fz={18}>
            Saralash
          </Text>
        }
        position="bottom"
        size="39%"
        radius="lg"
        styles={{
          header: {
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors?.gray?.[2]}`,
          },
          body: {
            padding: '12px 20px 20px 20px',
            maxHeight: '70vh',
            overflowY: 'auto',
          },
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Radio.Group
          value={sortValue || 'popular'}
          onChange={value => {
            handleSortChange(value);
            setSortDrawerOpened(false);
          }}
        >
          <Stack gap="md">
            {SORT_OPTIONS.map(option => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                styles={{
                  radio: {
                    cursor: 'pointer',
                  },
                  label: {
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: sortValue === option.value ? 600 : 400,
                    color:
                      sortValue === option.value
                        ? theme.colors?.blue?.[6]
                        : theme.colors?.gray?.[8],
                  },
                }}
              />
            ))}
          </Stack>
        </Radio.Group>
        <Button
          fullWidth
          mt="lg"
          variant="subtle"
          color="gray"
          bd="1px solid #E4E7EC"
          onClick={() => setSortDrawerOpened(false)}
        >
          Yopish
        </Button>
      </Drawer>
    </Box>
  );
}

export default Category;

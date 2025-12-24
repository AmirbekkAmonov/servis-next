import { Box, Text, UnstyledButton, Skeleton } from '@mantine/core';
import { useState, useEffect } from 'react';
import theme from '@/shared/theme';
import type { ISubCategory } from '@/shared/api/services/home/home.types';
import { CategoryItem } from './CategoryItem';
import { Collapse } from './Collapse';

type Category = {
  id: number;
  name: string;
  slug: string;
  sub_categories?: ISubCategory[];
};

type CategoriesProps = {
  categories: Category[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
  isLoading?: boolean;
};

const INITIAL_CATEGORIES_COUNT = 8;
const ANIMATION_DURATION_MS = 600;
const ANIMATION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

function Categories({
  categories,
  activeSlug,
  onSelect,
  isLoading = false,
}: CategoriesProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [openedCategories, setOpenedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubCategories, setExpandedSubCategories] = useState<
    Set<string>
  >(new Set());
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const initialCategories = categories.slice(0, INITIAL_CATEGORIES_COUNT);
  const additionalCategories = categories.slice(INITIAL_CATEGORIES_COUNT);
  const hasMoreCategories = categories.length > INITIAL_CATEGORIES_COUNT;

  // Active slug o'zgarganda, agar u submenu bo'lsa, parent category'ni ochish
  useEffect(() => {
    if (!activeSlug || categories.length === 0 || isLoading) return;

    const additionalCategoriesList = categories.slice(INITIAL_CATEGORIES_COUNT);

    // Active slug asosiy category slug'imi?
    const isMainCategory = categories.some(cat => cat.slug === activeSlug);
    if (isMainCategory) {
      // Asosiy category bo'lsa, uni ochish
      setOpenedCategories(prev => {
        if (prev.has(activeSlug)) return prev;
        const newSet = new Set(prev);
        newSet.add(activeSlug);
        return newSet;
      });

      // Agar qo'shimcha kategoriyalar ichida bo'lsa, ularni ham ochish
      const isInAdditional = additionalCategoriesList.some(
        cat => cat.slug === activeSlug
      );
      if (isInAdditional) {
        setCategoriesExpanded(true);
      }
      return;
    }

    // Submenu slug'ini topish
    for (const category of categories) {
      if (category.sub_categories) {
        const hasActiveSub = category.sub_categories.some(
          sub => sub.slug === activeSlug
        );
        if (hasActiveSub) {
          // Parent category'ni ochish
          setOpenedCategories(prev => {
            if (prev.has(category.slug)) return prev;
            const newSet = new Set(prev);
            newSet.add(category.slug);
            return newSet;
          });

          // Agar parent category qo'shimcha kategoriyalar ichida bo'lsa, ularni ham ochish
          const isInAdditional = additionalCategoriesList.some(
            cat => cat.slug === category.slug
          );
          if (isInAdditional) {
            setCategoriesExpanded(true);
          }

          // Submenu ko'proq bo'lsa va active submenu ko'rsatilmayotgan bo'lsa, uni ham expand qilish
          const INITIAL_SUB_COUNT = 5;
          const activeSubIndex = category.sub_categories.findIndex(
            sub => sub.slug === activeSlug
          );
          if (activeSubIndex >= INITIAL_SUB_COUNT) {
            setExpandedSubCategories(prev => {
              if (prev.has(category.slug)) return prev;
              const newSet = new Set(prev);
              newSet.add(category.slug);
              return newSet;
            });
          }
          break;
        }
      }
    }
  }, [activeSlug, categories, isLoading]);

  if (isLoading) {
    return (
      <Box>
        <Text fw={600} fz={14} c={theme.colors?.gray?.[8]} mb="sm">
          Turkumlar
        </Text>
        <Box>
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} height={36} radius="sm" mb={6} />
          ))}
        </Box>
      </Box>
    );
  }

  const toggleCategory = (slug: string) => {
    setOpenedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const toggleSubCategoriesExpansion = (categorySlug: string) => {
    setExpandedSubCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categorySlug)) {
        newSet.delete(categorySlug);
      } else {
        newSet.add(categorySlug);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (category: Category) => {
    if (category.sub_categories && category.sub_categories.length > 0) {
      toggleCategory(category.slug);
    } else {
      onSelect(category.slug);
    }
  };

  const handleSubCategoryClick = (
    subCategorySlug: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onSelect(subCategorySlug);
  };

  return (
    <Box>
      <Text fw={600} fz={14} c={theme.colors?.gray?.[8]} mb="sm">
        Turkumlar
      </Text>
      <Box>
        {initialCategories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            isActive={activeSlug === category.slug}
            isHovered={hovered === category.slug}
            isOpened={openedCategories.has(category.slug)}
            activeSlug={activeSlug}
            onCategoryClick={handleCategoryClick}
            onSubCategoryClick={handleSubCategoryClick}
            onMouseEnter={() => setHovered(category.slug)}
            onMouseLeave={() => setHovered(null)}
            expandedSubCategories={expandedSubCategories}
            onToggleSubCategoriesExpansion={toggleSubCategoriesExpansion}
          />
        ))}

        {/* Qo'shimcha kategoriyalar - smooth animatsiya bilan */}
        {hasMoreCategories && (
          <Collapse
            opened={categoriesExpanded}
            durationMs={ANIMATION_DURATION_MS}
            easing={ANIMATION_EASING}
          >
            <Box>
              {additionalCategories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isActive={activeSlug === category.slug}
                  isHovered={hovered === category.slug}
                  isOpened={openedCategories.has(category.slug)}
                  activeSlug={activeSlug}
                  onCategoryClick={handleCategoryClick}
                  onSubCategoryClick={handleSubCategoryClick}
                  onMouseEnter={() => setHovered(category.slug)}
                  onMouseLeave={() => setHovered(null)}
                  expandedSubCategories={expandedSubCategories}
                  onToggleSubCategoriesExpansion={toggleSubCategoriesExpansion}
                />
              ))}
            </Box>
          </Collapse>
        )}

        {/* Ko'proq/Kamroq tugmasi - asosiy kategoriyalar uchun */}
        {hasMoreCategories && (
          <UnstyledButton
            w="100%"
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: 8,
              marginTop: 4,
              color: theme.colors?.blue?.[6],
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                theme.colors?.blue?.[0] || '#e7f5ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Text
              fz={13}
              fw={500}
              c={theme.colors?.blue?.[6]}
              style={{
                transition: 'color 0.15s ease',
              }}
            >
              {categoriesExpanded
                ? 'Kamroq'
                : `Ko'proq (${categories.length - INITIAL_CATEGORIES_COUNT})`}
            </Text>
          </UnstyledButton>
        )}
      </Box>
    </Box>
  );
}

export default Categories;

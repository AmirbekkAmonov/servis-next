import { Box, Text, UnstyledButton } from '@mantine/core';
import theme from '@/shared/theme';
import type { ISubCategory } from '@/shared/api/services/home/home.types';
import { Collapse } from './Collapse';

const INITIAL_SUB_CATEGORIES_COUNT = 5;

type SubCategoryListProps = {
  subCategories: ISubCategory[];
  activeSlug: string | null;
  onSubCategoryClick: (slug: string, e: React.MouseEvent) => void;
  categorySlug: string;
  expandedSubCategories: Set<string>;
  onToggleSubCategoriesExpansion: (slug: string) => void;
  animationDurationMs?: number;
  animationEasing?: string;
};

export function SubCategoryList({
  subCategories,
  activeSlug,
  onSubCategoryClick,
  categorySlug,
  expandedSubCategories,
  onToggleSubCategoriesExpansion,
  animationDurationMs = 600,
  animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
}: SubCategoryListProps) {
  const isSubCategoriesExpanded = expandedSubCategories.has(categorySlug);
  const initialSubCategories = subCategories.slice(
    0,
    INITIAL_SUB_CATEGORIES_COUNT
  );
  const additionalSubCategories = subCategories.slice(
    INITIAL_SUB_CATEGORIES_COUNT
  );
  const hasMoreSubCategories =
    subCategories.length > INITIAL_SUB_CATEGORIES_COUNT;

  const renderSubCategory = (subCategory: ISubCategory) => {
    const isSubActive = activeSlug === subCategory.slug;
    return (
      <UnstyledButton
        key={subCategory.id}
        w="100%"
        onClick={e => onSubCategoryClick(subCategory.slug, e)}
        style={{
          display: 'block',
          padding: '8px 12px',
          borderRadius: 6,
          marginBottom: 2,
          backgroundColor: isSubActive
            ? theme.colors?.blue?.[0]
            : 'transparent',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          if (!isSubActive) {
            e.currentTarget.style.backgroundColor =
              theme.colors?.gray?.[1] || '#f8f9fa';
          }
        }}
        onMouseLeave={e => {
          if (!isSubActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Text
          fz={13}
          fw={isSubActive ? 500 : 400}
          c={isSubActive ? theme.colors?.blue?.[6] : theme.colors?.gray?.[7]}
          style={{
            transition: 'color 0.15s ease',
          }}
        >
          {subCategory.name}
        </Text>
      </UnstyledButton>
    );
  };

  return (
    <>
      {/* Dastlabki 5 ta sub-kategoriya */}
      {initialSubCategories.map(renderSubCategory)}

      {/* Qo'shimcha sub-kategoriyalar - animatsiya bilan */}
      {hasMoreSubCategories && (
        <Collapse
          opened={isSubCategoriesExpanded}
          durationMs={animationDurationMs}
          easing={animationEasing}
        >
          <Box>{additionalSubCategories.map(renderSubCategory)}</Box>
        </Collapse>
      )}

      {/* Ko'proq/Kamroq tugmasi */}
      {hasMoreSubCategories && (
        <UnstyledButton
          w="100%"
          onClick={e => {
            e.stopPropagation();
            onToggleSubCategoriesExpansion(categorySlug);
          }}
          style={{
            display: 'block',
            padding: '6px 12px',
            borderRadius: 6,
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
            fz={12}
            fw={500}
            c={theme.colors?.blue?.[6]}
            style={{
              transition: 'color 0.15s ease',
            }}
          >
            {isSubCategoriesExpanded
              ? 'Kamroq'
              : `Ko'proq (${subCategories.length - INITIAL_SUB_CATEGORIES_COUNT})`}
          </Text>
        </UnstyledButton>
      )}
    </>
  );
}

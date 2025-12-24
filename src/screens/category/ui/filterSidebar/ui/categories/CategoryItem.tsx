import { Box, Text, UnstyledButton, Group } from '@mantine/core';
import { TbChevronDown } from 'react-icons/tb';
import theme from '@/shared/theme';
import type { ISubCategory } from '@/shared/api/services/home/home.types';
import { SubCategoryList } from './SubCategoryList';
import { Collapse } from './Collapse';

type Category = {
  id: number;
  name: string;
  slug: string;
  sub_categories?: ISubCategory[];
};

type CategoryItemProps = {
  category: Category;
  isActive: boolean;
  isHovered: boolean;
  isOpened: boolean;
  activeSlug: string | null;
  onCategoryClick: (category: Category) => void;
  onSubCategoryClick: (slug: string, e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  expandedSubCategories: Set<string>;
  onToggleSubCategoriesExpansion: (slug: string) => void;
};

const ANIMATION_DURATION_MS = 600;
const ANIMATION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function CategoryItem({
  category,
  isActive,
  isHovered,
  isOpened,
  activeSlug,
  onCategoryClick,
  onSubCategoryClick,
  onMouseEnter,
  onMouseLeave,
  expandedSubCategories,
  onToggleSubCategoriesExpansion,
}: CategoryItemProps) {
  const hasSubCategories =
    category.sub_categories && category.sub_categories.length > 0;

  return (
    <Box mb={4}>
      <UnstyledButton
        w="100%"
        onClick={() => onCategoryClick(category)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          display: 'block',
          padding: '10px 12px',
          borderRadius: 8,
          backgroundColor: isActive
            ? theme.colors?.blue?.[0]
            : isHovered
              ? theme.colors?.gray?.[1]
              : 'transparent',
          transition: 'all 0.15s ease',
        }}
      >
        <Group gap={8} justify="space-between" wrap="nowrap">
          <Text
            fz={14}
            fw={isActive ? 600 : 400}
            c={isActive ? theme.colors?.blue?.[6] : theme.colors?.gray?.[7]}
            style={{
              transition: 'color 0.15s ease',
              flex: 1,
            }}
          >
            {category.name}
          </Text>
          {hasSubCategories && (
            <Box
              style={{
                transform: isOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: `transform ${ANIMATION_DURATION_MS}ms ${ANIMATION_EASING}`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TbChevronDown size={16} color={theme.colors?.gray?.[6]} />
            </Box>
          )}
        </Group>
      </UnstyledButton>

      {/* Sub-categories */}
      {hasSubCategories && (
        <Box pl={20} mt={4}>
          <Collapse
            opened={isOpened}
            durationMs={ANIMATION_DURATION_MS}
            easing={ANIMATION_EASING}
          >
            <SubCategoryList
              subCategories={category.sub_categories || []}
              activeSlug={activeSlug}
              onSubCategoryClick={onSubCategoryClick}
              categorySlug={category.slug}
              expandedSubCategories={expandedSubCategories}
              onToggleSubCategoriesExpansion={onToggleSubCategoriesExpansion}
              animationDurationMs={ANIMATION_DURATION_MS}
              animationEasing={ANIMATION_EASING}
            />
          </Collapse>
        </Box>
      )}
    </Box>
  );
}

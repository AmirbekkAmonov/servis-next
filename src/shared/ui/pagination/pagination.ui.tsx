import { Pagination as MantinePagination, Box } from '@mantine/core';
import theme from '@/shared/theme';
import { rem } from '@mantine/core';

type PaginationProps = {
  total: number;
  page: number;
  onChange: (page: number) => void;
  siblings?: number;
  boundaries?: number;
};

function Pagination({
  total,
  page,
  onChange,
  siblings = 1,
  boundaries = 1,
}: PaginationProps) {
  if (total <= 1) {
    return null;
  }

  return (
    <Box
      w="100%"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      py="xl"
    >
      <MantinePagination
        total={total}
        value={page}
        onChange={onChange}
        siblings={siblings}
        boundaries={boundaries}
        size="md"
        radius="md"
        styles={{
          root: {
            gap: rem(8),
          },
          control: {
            border: `1px solid ${theme.colors?.gray?.[3]}`,
            backgroundColor: theme.other?.mainWhite,
            color: theme.colors?.gray?.[7],
            fontWeight: 500,
            minWidth: rem(40),
            height: rem(40),
            transition: 'all 0.2s ease',
            '&[dataActive]': {
              backgroundColor: theme.colors?.blue?.[6],
              borderColor: theme.colors?.blue?.[6],
              color: theme.other?.mainWhite,
              fontWeight: 600,
              boxShadow: `0 2px 8px ${theme.colors?.blue?.[6]}40`,
            },
            '&:hover:not([dataDisabled]):not([dataActive])': {
              backgroundColor: theme.colors?.gray?.[1],
              borderColor: theme.colors?.gray?.[4],
              transform: 'translateY(-1px)',
            },
            '&[dataDisabled]': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
          },
          dots: {
            color: theme.colors?.gray?.[6],
          },
        }}
      />
    </Box>
  );
}

export default Pagination;

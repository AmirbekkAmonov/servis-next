import { Box, Text, RangeSlider, Flex } from '@mantine/core';
import theme from '@/shared/theme';
import { formatPrice } from '../../filterSidebar.const';

type PriceRangeProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

function PriceRange({ min, max, value, onChange }: PriceRangeProps) {
  return (
    <Box>
      <Text fw={600} fz={14} c={theme.colors?.gray?.[8]} mb="sm">
        Narx oralig'i
      </Text>

      <RangeSlider
        min={min}
        max={max}
        step={10000}
        value={value}
        onChange={onChange}
        minRange={10000}
        label={val => formatPrice(val)}
        labelAlwaysOn={false}
        color="blue"
        size="sm"
        styles={{
          track: {
            backgroundColor: theme.colors?.gray?.[2],
          },
          bar: {
            backgroundColor: theme.colors?.blue?.[6],
          },
          thumb: {
            borderColor: theme.colors?.blue?.[6],
            backgroundColor: theme.other?.mainWhite,
          },
        }}
      />

      <Flex justify="space-between" mt="sm">
        <Text fz={12} c={theme.colors?.gray?.[6]}>
          {formatPrice(value[0])}
        </Text>
        <Text fz={12} c={theme.colors?.gray?.[6]}>
          {formatPrice(value[1])}
        </Text>
      </Flex>
    </Box>
  );
}

export default PriceRange;

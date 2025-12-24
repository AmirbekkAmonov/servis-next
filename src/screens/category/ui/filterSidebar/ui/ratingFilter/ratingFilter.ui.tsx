import { Box, Text, Checkbox, Flex, Group } from '@mantine/core';
import { FaStar } from 'react-icons/fa';
import theme from '@/shared/theme';

type RatingFilterProps = {
  selectedRatings: number[];
  onChange: (ratings: number[]) => void;
};

const RATINGS = [5, 4, 3, 2, 1];

function RatingFilter({ selectedRatings, onChange }: RatingFilterProps) {
  const handleToggle = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      onChange(selectedRatings.filter(r => r !== rating));
    } else {
      onChange([...selectedRatings, rating]);
    }
  };

  return (
    <Box>
      <Text fw={600} fz={14} c={theme.colors?.gray?.[8]} mb="sm">
        Reyting bo'yicha
      </Text>

      <Flex direction="column" gap={8}>
        {RATINGS.map(rating => (
          <Checkbox
            key={rating}
            checked={selectedRatings.includes(rating)}
            onChange={() => handleToggle(rating)}
            label={
              <Group gap={4}>
                {Array.from({ length: rating }).map((_, idx) => (
                  <FaStar key={idx} size={14} color="#FFB800" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, idx) => (
                  <FaStar
                    key={`empty-${idx}`}
                    size={14}
                    color={theme.colors?.gray?.[3]}
                  />
                ))}
                <Text fz={13} c={theme.colors?.gray?.[6]} ml={4}>
                  {rating} va yuqori
                </Text>
              </Group>
            }
            styles={{
              input: {
                cursor: 'pointer',
              },
              label: {
                cursor: 'pointer',
              },
            }}
          />
        ))}
      </Flex>
    </Box>
  );
}

export default RatingFilter;


import {
  Card as MantineCard,
  Skeleton,
  Flex,
  Box,
  Badge,
  rem,
} from '@mantine/core';

function CardSkeleton() {
  return (
    <MantineCard padding={0} radius="md">
      <Box pos="relative">
        <Skeleton height={200} radius={`${rem(8)} ${rem(8)} 0 0`} />
        <Badge
          pos="absolute"
          top={12}
          left={12}
          size="md"
          radius="md"
          style={{ pointerEvents: 'none' }}
        >
          <Skeleton height={20} width={60} radius="sm" />
        </Badge>
      </Box>

      <Box p="md">
        <Skeleton height={20} width="80%" radius="sm" mb="sm" />
        <Flex direction="column" gap={8}>
          <Flex align="center" gap={6}>
            <Skeleton height={16} width={16} radius="sm" />
            <Skeleton height={16} width="60%" radius="sm" />
          </Flex>
          <Flex align="center" gap={6}>
            <Skeleton height={14} width={14} radius="sm" />
            <Skeleton height={16} width="50%" radius="sm" />
          </Flex>
          <Flex align="center" justify="space-between" mt={4}>
            <Skeleton height={16} width="40%" radius="sm" />
            <Flex align="center" gap={4}>
              <Skeleton height={14} width={14} radius="sm" />
              <Skeleton height={12} width={30} radius="sm" />
            </Flex>
          </Flex>
        </Flex>
        <Skeleton height={36} width="100%" radius="md" mt="md" />
      </Box>
    </MantineCard>
  );
}

export default CardSkeleton;

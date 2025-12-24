import { Card as MantineCard, Skeleton, Flex, Box } from '@mantine/core';

function CardSkeleton() {
  return (
    <MantineCard
      withBorder
      radius="md"
      padding="lg"
      style={{
        border: 'none',
        height: '100%',
      }}
    >
      <Flex direction="column" align="center" gap="xs">
        <Box
          p="sm"
          style={{
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
          }}
        >
          <Skeleton height={56} width={56} radius="md" />
        </Box>
        <Skeleton height={20} width="80%" radius="sm" />
        <Skeleton height={16} width="60%" radius="sm" />
      </Flex>
    </MantineCard>
  );
}

export default CardSkeleton;

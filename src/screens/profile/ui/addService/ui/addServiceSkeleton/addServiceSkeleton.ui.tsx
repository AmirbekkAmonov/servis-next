import { Box, Skeleton, Stack, Paper, Group } from '@mantine/core';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';

function AddServiceSkeleton() {
  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      py="xl"
      style={{ minHeight: '100vh' }}
    >
      <Container>
        <Stack gap="xl">
          {/* Header Skeleton */}
          <Group gap="md" align="center">
            <Skeleton height={56} width={56} radius={16} />
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={32} width={200} radius="sm" />
              <Skeleton height={16} width={300} radius="sm" />
            </Stack>
          </Group>

          {/* Form Skeleton */}
          <Paper
            p="xl"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              boxShadow: `0 4px 12px ${theme.colors?.gray?.[1]}`,
            }}
          >
            {/* Stepper Skeleton */}
            <Skeleton height={60} width="100%" radius="md" mb="xl" />

            {/* Form Fields Skeleton */}
            <Stack gap="lg">
              <Stack gap="md">
                <Skeleton height={36} width="100%" radius="md" />
                <Skeleton height={36} width="100%" radius="md" />
                <Skeleton height={100} width="100%" radius="md" />
              </Stack>
            </Stack>

            {/* Buttons Skeleton */}
            <Group justify="space-between" mt="xl">
              <Skeleton height={36} width={120} radius="md" />
              <Skeleton height={36} width={120} radius="md" />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default AddServiceSkeleton;

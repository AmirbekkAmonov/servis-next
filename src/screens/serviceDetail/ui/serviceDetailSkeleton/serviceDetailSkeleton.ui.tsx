import { Box, Skeleton, Stack, Flex, Grid, Paper, Group } from '@mantine/core';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';

function ServiceDetailSkeleton() {
  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      style={{ minHeight: '100vh' }}
      py="xl"
    >
      <Container>
        {/* Back Button Skeleton */}
        <Skeleton height={36} width={100} radius="md" mb="md" />

        <Grid gutter="xl">
          {/* Left Column - Images */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper
              radius="md"
              style={{
                backgroundColor: theme.other?.mainWhite,
                border: `1px solid ${theme.colors?.gray?.[2]}`,
                overflow: 'hidden',
              }}
            >
              {/* Main Image Skeleton */}
              <Skeleton
                height={400}
                width="100%"
                radius="md"
                mb="md"
                style={{ aspectRatio: '16/10' }}
              />

              {/* Thumbnail Images Skeleton */}
              <Box p="md">
                <Flex gap="xs" wrap="wrap">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} height={80} width={80} radius={8} />
                  ))}
                </Flex>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Right Column - Info */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              {/* Header Skeleton */}
              <Box>
                <Group gap="sm" mb="xs">
                  <Skeleton height={28} width={80} radius="md" />
                  <Skeleton height={28} width={90} radius="md" />
                </Group>
                <Skeleton height={32} width="90%" radius="sm" mb="sm" />
                <Flex gap="md" mb="sm">
                  <Skeleton height={18} width={150} radius="sm" />
                  <Skeleton height={18} width={120} radius="sm" />
                  <Skeleton height={18} width={60} radius="sm" />
                </Flex>
              </Box>

              {/* Price Skeleton */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: theme.colors?.blue?.[0],
                  border: `1px solid ${theme.colors?.blue?.[2]}`,
                }}
              >
                <Skeleton height={28} width={200} radius="sm" />
              </Paper>

              {/* Contact Info Skeleton */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: theme.other?.mainWhite,
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                }}
              >
                <Stack gap="md">
                  <Skeleton height={20} width={150} radius="sm" />
                  <Skeleton height={24} width="100%" radius="sm" />
                  <Skeleton height={24} width="80%" radius="sm" />
                  <Skeleton height={24} width="90%" radius="sm" />
                  <Skeleton height={24} width="70%" radius="sm" />
                  <Skeleton height={24} width="85%" radius="sm" />
                </Stack>
              </Paper>

              {/* Social Links Skeleton */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: theme.other?.mainWhite,
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                }}
              >
                <Skeleton height={20} width={150} radius="sm" mb="sm" />
                <Group gap="md">
                  <Skeleton height={32} width={100} radius="md" />
                  <Skeleton height={32} width={100} radius="md" />
                  <Skeleton height={32} width={100} radius="md" />
                </Group>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Description Section Skeleton */}
        <Paper
          p="xl"
          radius="md"
          mt="xl"
          style={{
            backgroundColor: theme.other?.mainWhite,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
          }}
        >
          <Skeleton height={28} width={100} radius="sm" mb="md" />
          <Stack gap="xs">
            <Skeleton height={16} width="100%" radius="sm" />
            <Skeleton height={16} width="100%" radius="sm" />
            <Skeleton height={16} width="95%" radius="sm" />
            <Skeleton height={16} width="98%" radius="sm" />
            <Skeleton height={16} width="90%" radius="sm" />
            <Skeleton height={16} width="97%" radius="sm" />
          </Stack>
        </Paper>

        {/* Features Skeleton */}
        <Paper
          p="xl"
          radius="md"
          mt="xl"
          style={{
            backgroundColor: theme.other?.mainWhite,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
          }}
        >
          <Skeleton height={28} width={120} radius="sm" mb="md" />
          <Group gap="sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height={28} width={80} radius="md" />
            ))}
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}

export default ServiceDetailSkeleton;

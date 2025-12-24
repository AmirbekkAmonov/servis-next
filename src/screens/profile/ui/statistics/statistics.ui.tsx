import {
  Box,
  Flex,
  Text,
  Card,
  Stack,
  Group,
  Progress,
  RingProgress,
  SimpleGrid,
} from '@mantine/core';
import theme from '@/shared/theme';
import {
  TbEye,
  TbStar,
  TbMessageCircle,
  TbBriefcase,
  TbCheck,
  TbX,
  TbTrendingUp,
  TbTrendingDown,
} from 'react-icons/tb';
import type { IStatistics } from '../../profile.const';

interface StatisticsProps {
  statistics: IStatistics;
}

function Statistics({ statistics }: StatisticsProps) {
  const totalServices = statistics.totalServices;
  const activePercentage =
    totalServices > 0
      ? Math.round((statistics.activeServices / totalServices) * 100)
      : 0;
  const inactivePercentage =
    totalServices > 0
      ? Math.round((statistics.inactiveServices / totalServices) * 100)
      : 0;
  const ratingPercentage = (statistics.averageRating / 5) * 100;

  const statCards = [
    {
      label: 'Jami xizmatlar',
      value: statistics.totalServices,
      icon: TbBriefcase,
      color: theme.colors?.blue?.[6],
      bg: theme.colors?.blue?.[0],
      trend: '+12%',
      trendUp: true,
    },
    {
      label: "Jami ko'rishlar",
      value: statistics.totalViews,
      icon: TbEye,
      color: theme.colors?.green?.[6],
      bg: theme.colors?.green?.[0],
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Jami sharhlar',
      value: statistics.totalReviews,
      icon: TbMessageCircle,
      color: theme.colors?.orange?.[6],
      bg: theme.colors?.orange?.[0],
      trend: '+5%',
      trendUp: true,
    },
    {
      label: "O'rtacha reyting",
      value: statistics.averageRating.toFixed(1),
      icon: TbStar,
      color: theme.colors?.yellow?.[6],
      bg: theme.colors?.yellow?.[0],
      trend: '+0.2',
      trendUp: true,
    },
  ];

  return (
    <Box>
      <Stack gap="xl">
        {/* Main Statistics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trendUp ? TbTrendingUp : TbTrendingDown;
            return (
              <Card
                key={index}
                p="lg"
                radius="md"
                style={{
                  backgroundColor: theme.other?.mainWhite,
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 12px 24px ${theme.colors?.gray?.[3]}`,
                      borderColor: stat.color,
                    },
                  },
                }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${stat.bg} 0%, transparent 70%)`,
                    opacity: 0.3,
                    transform: 'translate(20px, -20px)',
                  }}
                />
                <Stack gap="sm" style={{ position: 'relative', zIndex: 1 }}>
                  <Flex align="center" justify="space-between">
                    <Box
                      p="md"
                      style={{
                        backgroundColor: stat.bg,
                        borderRadius: 16,
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform =
                          'scale(1.1) rotate(5deg)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform =
                          'scale(1) rotate(0deg)';
                      }}
                    >
                      <Icon
                        size={24}
                        color={stat.color}
                        style={{ display: 'block' }}
                      />
                    </Box>
                    <Group gap={4}>
                      <TrendIcon
                        size={16}
                        color={
                          stat.trendUp
                            ? theme.colors?.green?.[6]
                            : theme.colors?.red?.[6]
                        }
                      />
                      <Text
                        fz={12}
                        fw={600}
                        c={
                          stat.trendUp
                            ? theme.colors?.green?.[6]
                            : theme.colors?.red?.[6]
                        }
                      >
                        {stat.trend}
                      </Text>
                    </Group>
                  </Flex>
                  <Stack gap={2}>
                    <Text
                      fw={700}
                      fz={28}
                      c={theme.colors?.gray?.[9]}
                      style={{ fontSize: 'clamp(22px, 2.5vw, 28px)' }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      fz={14}
                      c={theme.colors?.gray?.[6]}
                      style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}
                    >
                      {stat.label}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        {/* Progress and Charts Section */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          {/* Active/Inactive Services Progress */}
          <Card
            p="lg"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              transition: 'all 0.3s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${theme.colors?.gray?.[2]}`,
                },
              },
            }}
          >
            <Stack gap="md">
              <Text fw={600} fz={18} c={theme.colors?.gray?.[9]}>
                Xizmatlar holati
              </Text>
              <Stack gap="sm">
                <Flex justify="space-between" align="center">
                  <Group gap="xs">
                    <TbCheck size={16} color={theme.colors?.green?.[6]} />
                    <Text fz={14} c={theme.colors?.gray?.[7]}>
                      Faol xizmatlar
                    </Text>
                  </Group>
                  <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                    {statistics.activeServices} ({activePercentage}%)
                  </Text>
                </Flex>
                <Progress
                  value={activePercentage}
                  color="green"
                  radius="xl"
                  size="lg"
                  style={{
                    backgroundColor: theme.colors?.green?.[0],
                  }}
                />
                <Flex justify="space-between" align="center" mt="xs">
                  <Group gap="xs">
                    <TbX size={16} color={theme.colors?.gray?.[6]} />
                    <Text fz={14} c={theme.colors?.gray?.[7]}>
                      Nofaol xizmatlar
                    </Text>
                  </Group>
                  <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                    {statistics.inactiveServices} ({inactivePercentage}%)
                  </Text>
                </Flex>
                <Progress
                  value={inactivePercentage}
                  color="gray"
                  radius="xl"
                  size="lg"
                  style={{
                    backgroundColor: theme.colors?.gray?.[0],
                  }}
                />
              </Stack>
            </Stack>
          </Card>

          {/* Rating Ring Progress */}
          <Card
            p="lg"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              transition: 'all 0.3s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${theme.colors?.gray?.[2]}`,
                },
              },
            }}
          >
            <Stack gap="md" align="center">
              <Text fw={600} fz={18} c={theme.colors?.gray?.[9]}>
                O'rtacha reyting
              </Text>
              <Box style={{ position: 'relative' }}>
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={[
                    {
                      value: ratingPercentage,
                      color: theme.colors?.yellow?.[6] || '#FDB022',
                    },
                  ]}
                  label={
                    <Text
                      ta="center"
                      fw={700}
                      fz={32}
                      c={theme.colors?.gray?.[9]}
                    >
                      {statistics.averageRating.toFixed(1)}
                    </Text>
                  }
                  styles={{
                    root: {
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease',
                      },
                    },
                  }}
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <Group gap={4}>
                    <TbStar size={16} color={theme.colors?.yellow?.[6]} />
                    <Text fz={12} c={theme.colors?.gray?.[6]}>
                      5.0 dan
                    </Text>
                  </Group>
                </Box>
              </Box>
              <Text fz={14} c={theme.colors?.gray?.[6]} ta="center">
                {statistics.totalReviews} ta sharh asosida
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card
            p="lg"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `2px solid ${theme.colors?.green?.[3]}`,
              background: `linear-gradient(135deg, ${theme.colors?.green?.[0]} 0%, ${theme.other?.mainWhite} 100%)`,
              transition: 'all 0.3s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${theme.colors?.green?.[2]}`,
                },
              },
            }}
          >
            <Flex align="center" gap="md">
              <Box
                p="md"
                style={{
                  backgroundColor: theme.colors?.green?.[1],
                  borderRadius: 16,
                }}
              >
                <TbCheck size={24} color={theme.colors?.green?.[6]} />
              </Box>
              <Stack gap={4}>
                <Text
                  fw={700}
                  fz={24}
                  c={theme.colors?.gray?.[9]}
                  style={{ fontSize: 'clamp(20px, 2vw, 24px)' }}
                >
                  {statistics.activeServices}
                </Text>
                <Text
                  fz={14}
                  c={theme.colors?.gray?.[6]}
                  style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}
                >
                  Faol xizmatlar
                </Text>
              </Stack>
            </Flex>
          </Card>

          <Card
            p="lg"
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `2px solid ${theme.colors?.gray?.[2]}`,
              transition: 'all 0.3s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 20px ${theme.colors?.gray?.[2]}`,
                },
              },
            }}
          >
            <Flex align="center" gap="md">
              <Box
                p="md"
                style={{
                  backgroundColor: theme.colors?.gray?.[0],
                  borderRadius: 16,
                }}
              >
                <TbX size={24} color={theme.colors?.gray?.[6]} />
              </Box>
              <Stack gap={4}>
                <Text
                  fw={700}
                  fz={24}
                  c={theme.colors?.gray?.[9]}
                  style={{ fontSize: 'clamp(20px, 2vw, 24px)' }}
                >
                  {statistics.inactiveServices}
                </Text>
                <Text
                  fz={14}
                  c={theme.colors?.gray?.[6]}
                  style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}
                >
                  Nofaol xizmatlar
                </Text>
              </Stack>
            </Flex>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}

export default Statistics;

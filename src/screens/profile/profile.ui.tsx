import {
  Box,
  Flex,
  Text,
  Tabs,
  Stack,
  Badge,
  Avatar,
  Group,
  Menu,
  ActionIcon,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from '@/shared/lib/router';
import { useAuthStore } from '@/shared/store/authStore';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import {
  TbUser,
  TbChartBar,
  TbBriefcase,
  TbMessageCircle,
  TbDots,
  TbLogout,
  TbSettings,
  TbHelp,
  TbPhone,
  TbAt,
  TbMapPin,
  TbCalendar,
  TbStar,
  TbCrown,
  TbUserCircle,
  TbBuildingStore,
} from 'react-icons/tb';
import { AddService } from './ui/addService';
import { Statistics } from './ui/statistics';
import { Services } from './ui/services';
import { Reviews } from './ui/reviews';
import { EditProfile } from './ui/editProfile';
import {
  generateFakeReviews,
  type IReview,
  type IStatistics,
} from './profile.const';
import { getProfileMe } from '@/shared/api/services/profile';

function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>('profile');

  const [profileUser, setProfileUser] = useState<{
    name: string;
    phone: string;
    email: string | null;
    role: string;
    is_premium: boolean;
    is_verified: boolean;
    created_at: string;
    city: { name: string } | null;
    district: { name: string } | null;
  } | null>(null);

  const [profileStats, setProfileStats] = useState<{
    total_views: number;
    services_count: number;
    rating: number;
    reviews_count: number;
    contact_stats: {
      phone: number;
      telegram: number;
      instagram: number;
      website: number;
      facebook: number;
      youtube: number;
      tiktok: number;
    };
  } | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [reviews] = useState<IReview[]>(generateFakeReviews());

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoadingProfile(true);
      try {
        const response = await getProfileMe();
        const apiUser = response?.data?.user;
        const apiStats = response?.data?.stats;

        if (apiUser) {
          setProfileUser(apiUser);

          if (updateUser) {
            updateUser({
              ...user,
              name: apiUser.name,
              phone: apiUser.phone,
              role: apiUser.role,
              is_premium: apiUser.is_premium,
            });
          }
        }

        if (apiStats) {
          setProfileStats(apiStats);
        }
      } catch {
        // ignore: keep fallback data from auth store
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hash-based navigation: URL hash o'zgarganda tabni o'zgartirish
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const validTabs = [
        'profile',
        'statistics',
        'services',
        'add-service',
        'reviews',
      ];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        // Hash noto'g'ri bo'lsa, default tabni o'rnatish
        setActiveTab('profile');
      }
    }
    // Hash bo'lmasa, default 'profile' tabni useState o'rnatadi
  }, [location.hash]);

  // Tab o'zgarganda URL hash yangilash
  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value) {
      window.history.replaceState(null, '', `#${value}`);
    }
  };

  const statistics: IStatistics = useMemo(() => {
    if (!profileStats) {
      return {
        totalServices: 0,
        totalViews: 0,
        totalReviews: 0,
        averageRating: 0,
        activeServices: 0,
        inactiveServices: 0,
      };
    }

    return {
      totalServices: profileStats.services_count,
      totalViews: profileStats.total_views,
      totalReviews: profileStats.reviews_count,
      averageRating: profileStats.rating,
      activeServices: profileStats.services_count,
      inactiveServices: 0,
    };
  }, [profileStats]);

  const displayName = profileUser?.name || user?.name || '';
  const displayPhone = profileUser?.phone || user?.phone || '';
  const displayEmail = profileUser?.email;
  const displayCity = profileUser?.city?.name || '';
  const displayDistrict = profileUser?.district?.name || '';
  const displayCreatedAt = profileUser?.created_at;
  const displayRole = profileUser?.role || user?.role || '';
  const displayIsPremium = profileUser?.is_premium ?? user?.is_premium ?? false;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = [
        'yanvar',
        'fevral',
        'mart',
        'aprel',
        'may',
        'iyun',
        'iyul',
        'avgust',
        'sentyabr',
        'oktyabr',
        'noyabr',
        'dekabr',
      ];
      return `${d.getFullYear()}-yil ${d.getDate()}-${months[d.getMonth()]}`;
    } catch {
      return dateStr;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'vendor':
        return TbBuildingStore;
      default:
        return TbUserCircle;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'vendor':
        return 'purple';
      default:
        return 'blue';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditService = (service: any) => {
    console.log('Edit service:', service);
    // TODO: Xizmatni tahrirlash logikasi
    navigate(`/edit-service/${service.slug}`);
  };

  const handleDeleteService = (serviceId: number) => {
    console.log('Delete service:', serviceId);
    // TODO: Implement delete service logic
  };

  const handleSaveProfile = (updatedUser: Partial<typeof user>) => {
    if (user && updateUser) {
      updateUser({ ...user, ...updatedUser } as typeof user);
    }
  };

  if (!user) {
    return (
      <Container>
        <Box py="xl" ta="center">
          <Text c={theme.colors?.gray?.[6]}>Profil ma'lumotlari topilmadi</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      style={{ minHeight: '100vh' }}
      py={{ base: 'md', sm: 'xl' }}
    >
      <Container>
        {/* Header Section */}
        <Box
          p={{ base: 'lg', sm: 'xl' }}
          mb="xl"
          style={{
            backgroundColor: theme.other?.mainWhite,
            borderRadius: 24,
            border: `1px solid ${theme.colors?.gray?.[2]}`,
            background: `linear-gradient(135deg, ${
              theme.colors?.blue?.[0]
            } 0%, ${
              theme.colors?.purple?.[0] || theme.colors?.blue?.[1]
            } 50%, ${theme.other?.mainWhite} 100%)`,
            boxShadow: `0 8px 24px ${theme.colors?.gray?.[2]}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative elements */}
          <Box
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.colors?.blue?.[2]} 0%, transparent 70%)`,
              opacity: 0.3,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                theme.colors?.purple?.[2] || theme.colors?.blue?.[2]
              } 0%, transparent 70%)`,
              opacity: 0.2,
            }}
          />

          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'center', sm: 'flex-start' }}
            gap="lg"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Box style={{ position: 'relative' }}>
              <Avatar
                size={120}
                radius="xl"
                color={theme.colors?.blue?.[6]}
                style={{
                  backgroundColor: theme.colors?.blue?.[1],
                  color: theme.colors?.blue?.[6],
                  fontWeight: 600,
                  fontSize: 48,
                  border: `4px solid ${theme.other?.mainWhite}`,
                  boxShadow: `0 8px 24px ${theme.colors?.gray?.[3]}`,
                  transition: 'transform 0.3s ease',
                  width: 'clamp(100px, 15vw, 120px)',
                  height: 'clamp(100px, 15vw, 120px)',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                {displayName ? displayName.charAt(0).toUpperCase() : ''}
              </Avatar>
            </Box>

            <Stack gap="xs" style={{ flex: 1 }} w="100%">
              <Box style={{ position: 'relative' }}>
                <Flex justify="space-between" align="flex-start" gap="md">
                  <Group
                    gap="md"
                    align="center"
                    wrap="wrap"
                    style={{ flex: 1 }}
                  >
                    <Text
                      fw={700}
                      fz={{ base: 24, sm: 28 }}
                      c={theme.colors?.gray?.[9]}
                    >
                      {displayName}
                    </Text>
                    {(() => {
                      const daysLeft =
                        user.premium_days_left !== undefined
                          ? user.premium_days_left
                          : null;

                      const RoleIcon = getRoleIcon(displayRole);
                      const roleColor = getRoleColor(displayRole);

                      const premiumLabel = displayIsPremium
                        ? daysLeft !== null && daysLeft > 0
                          ? `Premium • ${daysLeft} kun`
                          : 'Premium'
                        : 'Premium emas';

                      return (
                        <Group gap={8} wrap="wrap">
                          <Badge
                            size="lg"
                            radius="xl"
                            color={roleColor}
                            variant="light"
                            leftSection={<RoleIcon size={16} />}
                            style={{
                              border: `1px solid ${theme.colors?.[roleColor]?.[2]}`,
                              fontWeight: 600,
                            }}
                          >
                            {displayRole === 'vendor'
                              ? 'Biznesmen'
                              : displayRole
                              ? displayRole
                              : 'User'}
                          </Badge>

                          <Badge
                            size="lg"
                            radius="xl"
                            color={displayIsPremium ? 'yellow' : 'gray'}
                            variant={displayIsPremium ? 'filled' : 'light'}
                            leftSection={
                              displayIsPremium ? (
                                <TbCrown size={16} />
                              ) : (
                                <TbUserCircle size={16} />
                              )
                            }
                            style={{
                              ...(displayIsPremium
                                ? {
                                    background: `linear-gradient(135deg, ${theme.colors?.yellow?.[6]} 0%, ${theme.colors?.orange?.[6]} 100%)`,
                                    boxShadow: `0 6px 16px ${theme.colors?.yellow?.[4]}`,
                                    border: `1px solid ${theme.colors?.yellow?.[3]}`,
                                  }
                                : {
                                    backgroundColor: theme.colors?.gray?.[0],
                                    border: `1px solid ${theme.colors?.gray?.[2]}`,
                                  }),
                              fontWeight: 700,
                            }}
                          >
                            {premiumLabel}
                          </Badge>
                        </Group>
                      );
                    })()}
                  </Group>
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="light"
                        color="gray"
                        size="lg"
                        radius="xl"
                        style={{
                          backgroundColor: theme.colors?.gray?.[0],
                          border: `1px solid ${theme.colors?.gray?.[2]}`,
                        }}
                        styles={{
                          root: {
                            '&:hover': {
                              backgroundColor: theme.colors?.gray?.[1],
                              transform: 'scale(1.1)',
                            },
                          },
                        }}
                      >
                        <TbDots size={20} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>
                        <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                          {displayName}
                        </Text>
                        <Text fz={12} c={theme.colors?.gray?.[6]}>
                          {displayPhone}
                        </Text>
                      </Menu.Label>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<TbSettings size={16} />}
                        onClick={() => setActiveTab('profile')}
                      >
                        Sozlamalar
                      </Menu.Item>
                      <Menu.Item leftSection={<TbHelp size={16} />}>
                        Yordam
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<TbLogout size={16} />}
                        onClick={handleLogout}
                        color="red"
                      >
                        Chiqish
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
              </Box>
              <Flex gap="lg" wrap="wrap" align="center" mt="xs">
                <Group gap={8} align="center">
                  <TbPhone size={18} color={theme.colors?.blue?.[6]} />
                  <Text fz={15} fw={600} c={theme.colors?.gray?.[8]}>
                    {displayPhone || '-'}
                  </Text>
                </Group>

                {displayEmail && (
                  <Group gap={8} align="center">
                    <TbAt size={18} color={theme.colors?.blue?.[6]} />
                    <Text fz={15} fw={500} c={theme.colors?.gray?.[8]}>
                      {displayEmail}
                    </Text>
                  </Group>
                )}

                {(displayCity || displayDistrict) && (
                  <Group gap={8} align="center">
                    <TbMapPin size={18} color={theme.colors?.blue?.[6]} />
                    <Text fz={15} fw={500} c={theme.colors?.gray?.[8]}>
                      {`${displayCity}${
                        displayCity && displayDistrict ? ', ' : ''
                      }${displayDistrict}`}
                    </Text>
                  </Group>
                )}

                {displayCreatedAt && (
                  <Group gap={8} align="center">
                    <TbCalendar size={18} color={theme.colors?.blue?.[6]} />
                    <Text fz={15} fw={500} c={theme.colors?.gray?.[8]}>
                      {formatDate(displayCreatedAt)}
                    </Text>
                  </Group>
                )}

                {isLoadingProfile && (
                  <Text fz={13} c={theme.colors?.gray?.[6]}>
                    Yuklanmoqda...
                  </Text>
                )}
              </Flex>
              <Group gap="md" mt="xs" wrap="wrap">
                <Badge
                  size="md"
                  radius="xl"
                  color="blue"
                  variant="light"
                  leftSection={<TbBriefcase size={14} />}
                  style={{
                    backgroundColor: `${theme.colors?.blue?.[0]}`,
                    border: `1px solid ${theme.colors?.blue?.[2]}`,
                  }}
                >
                  {statistics.totalServices} xizmat
                </Badge>
                <Badge
                  size="md"
                  radius="xl"
                  color="green"
                  variant="light"
                  leftSection={<TbChartBar size={14} />}
                  style={{
                    backgroundColor: `${theme.colors?.green?.[0]}`,
                    border: `1px solid ${theme.colors?.green?.[2]}`,
                  }}
                >
                  {statistics.totalViews} ko'rish
                </Badge>
                <Badge
                  size="md"
                  radius="xl"
                  color="orange"
                  variant="light"
                  leftSection={<TbMessageCircle size={14} />}
                  style={{
                    backgroundColor: `${theme.colors?.orange?.[0]}`,
                    border: `1px solid ${theme.colors?.orange?.[2]}`,
                  }}
                >
                  {statistics.totalReviews} sharh
                </Badge>

                <Badge
                  size="md"
                  radius="xl"
                  color="yellow"
                  variant="light"
                  leftSection={<TbStar size={14} />}
                  style={{
                    backgroundColor: `${theme.colors?.yellow?.[0]}`,
                    border: `1px solid ${theme.colors?.yellow?.[2]}`,
                  }}
                >
                  {statistics.averageRating.toFixed(1)} reyting
                </Badge>
              </Group>
            </Stack>
          </Flex>
        </Box>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          styles={{
            list: {
              borderBottom: `2px solid ${theme.colors?.gray?.[2]}`,
              marginBottom: 24,
            },
            tab: {
              fontWeight: 500,
              fontSize: 15,
              padding: '12px 20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.colors?.gray?.[0],
              },
              '&[dataActive]': {
                color: theme.colors?.blue?.[6],
                borderColor: theme.colors?.blue?.[6],
                backgroundColor: theme.colors?.blue?.[0],
              },
            },
            panel: {
              paddingTop: 0,
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="profile"
              leftSection={<TbUser size={18} />}
              fw={500}
            >
              Profil
            </Tabs.Tab>
            <Tabs.Tab
              value="statistics"
              leftSection={<TbChartBar size={18} />}
              fw={500}
            >
              Statistika
            </Tabs.Tab>
            <Tabs.Tab
              value="services"
              leftSection={<TbBriefcase size={18} />}
              fw={500}
            >
              Xizmatlar
            </Tabs.Tab>
            <Tabs.Tab
              value="add-service"
              leftSection={<TbBriefcase size={18} />}
              fw={500}
            >
              Xizmat qo'shish
            </Tabs.Tab>
            <Tabs.Tab
              value="reviews"
              leftSection={<TbMessageCircle size={18} />}
              fw={500}
            >
              Sharhlar
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <EditProfile user={user} onSave={handleSaveProfile} />
          </Tabs.Panel>

          <Tabs.Panel value="statistics">
            <Statistics statistics={statistics} />
          </Tabs.Panel>

          <Tabs.Panel value="services">
            <Services
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          </Tabs.Panel>

          <Tabs.Panel value="add-service">
            <AddService embedded />
          </Tabs.Panel>

          <Tabs.Panel value="reviews">
            <Reviews reviews={reviews} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Profile;

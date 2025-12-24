import { useEffect, useState } from 'react';
import Container from '@/shared/ui/Container';
import Category from './ui/category/category.ui';
import {
  Box,
  Flex,
  Button,
  HoverCard,
  Drawer,
  Stack,
  Image,
  rem,
  Text,
  Avatar,
} from '@mantine/core';
import { UnstyledButton } from '@mantine/core';
import { Link, useNavigate, useLocation } from '@/shared/lib/router';
import { FaRegUser } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import theme from '@/shared/theme';
import { LuCrown } from 'react-icons/lu';
import { IoIosArrowDown, IoMdNotificationsOutline } from 'react-icons/io';
import { IoCloseOutline, IoMenu } from 'react-icons/io5';
import { TbClipboardText } from 'react-icons/tb';
import { useMediaQuery } from '@mantine/hooks';
import { fetchHeaderCategories } from './header.api';
import type { ICategory } from '@/shared/api/services/header/header.types';
import { Auth } from '@/shared/ui/auth';
import { useAuthStore } from '@/shared/store/authStore';
import { Categories } from '@/screens/category/ui/filterSidebar/ui/categories';
import { getCategories } from '@/screens/category/category.api';

function Header() {
  const logo = '/assets/images/logo.png';
  const [opened, setOpened] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [fullCategories, setFullCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { isAuthenticated, user, logout } = useAuthStore();

  const isPremiumActive = location.pathname === '/premium';

  const isOrdersActive = location.pathname === '/orders';

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchHeaderCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Full categories with sub_categories for mobile
  useEffect(() => {
    const loadFullCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await getCategories();
        setFullCategories(data);
      } catch {
        setFullCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    if (isMobile) {
      loadFullCategories();
    }
  }, [isMobile]);

  const handleCategoryClick = (href: string) => {
    navigate(href);
    setOpened(false);
    setDrawerOpened(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpened(false);
  };

  const handleProtectedNavigate = (path: string) => {
    if (isAuthenticated) {
      handleNavigate(path);
    } else {
      setAuthModalOpened(true);
      setDrawerOpened(false);
    }
  };

  const handleLoginClick = () => {
    setAuthModalOpened(true);
    setDrawerOpened(false);
  };

  const handleAuthVerify = (code: string) => {
    console.log('Verification code:', code);
    setAuthModalOpened(false);
    // If user was trying to access protected route, navigate after login
    const currentPath = location.pathname;
    if (currentPath === '/orders' || currentPath === '/add-service') {
      // Already on the page, no need to navigate
    }
  };

  const handleLogout = () => {
    logout();
    setDrawerOpened(false);
  };

  const desktopHeader = (
    <Container w="100%">
      <Flex w="100%" justify="space-between" align="center" py="sm">
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={logo}
            alt="logo"
            h={50}
            w="auto"
            fit="contain"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
          />
        </Link>
        <Flex gap="sm" align="center">
          <HoverCard
            withinPortal
            width="auto"
            shadow="xl"
            position="bottom-start"
            openDelay={100}
            closeDelay={200}
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            styles={{
              dropdown: {
                padding: 0,
                borderRadius: '16px',
                minWidth: rem(420),
                maxHeight: '315px',
                overflowY: 'auto',
                zIndex: 1000,
                border: 'none',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <HoverCard.Target>
              <Button
                variant={opened ? 'light' : 'subtle'}
                color="gray"
                size="md"
                radius="xl"
                rightSection={
                  <IoIosArrowDown
                    size={16}
                    style={{
                      transition: 'transform 200ms ease',
                      transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                }
                leftSection={<IoMenu size={18} />}
                styles={{
                  root: {
                    fontWeight: 600,
                    color: theme.colors?.gray?.[8],
                  },
                }}
              >
                Kategoriyalar
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Category
                onItemClick={handleCategoryClick}
                categories={categories}
              />
            </HoverCard.Dropdown>
          </HoverCard>

          <Button
            variant={isOrdersActive ? 'filled' : 'subtle'}
            color="blue"
            size="md"
            radius="xl"
            leftSection={<IoMdNotificationsOutline size={20} />}
            onClick={() => handleProtectedNavigate('/orders')}
            styles={{
              root: {
                fontWeight: 600,
                transition: 'all 0.2s ease',
              },
            }}
          >
            Zakazlar
          </Button>

          <Button
            variant={isPremiumActive ? 'filled' : 'subtle'}
            color="yellow"
            size="md"
            radius="xl"
            leftSection={<LuCrown size={20} />}
            onClick={() => handleNavigate('/premium')}
            styles={{
              root: {
                fontWeight: 600,
                color: isPremiumActive
                  ? theme.other?.mainWhite
                  : theme.colors?.yellow?.[7],
                transition: 'all 0.2s ease',
              },
            }}
          >
            Premium
          </Button>

          <Button
            variant="light"
            size="md"
            radius="xl"
            color="blue"
            leftSection={<TbClipboardText size={20} />}
            onClick={() => handleProtectedNavigate('/create-order')}
            styles={{
              root: {
                fontWeight: 600,
                transition: 'all 0.2s ease',
              },
            }}
          >
            Buyurtma berish
          </Button>

          <Button
            variant="filled"
            size="md"
            radius="xl"
            bg={theme.colors?.blue?.[6]}
            c={theme.other?.mainWhite}
            leftSection={<FaPlus size={16} />}
            onClick={() => handleProtectedNavigate('/profile#add-service')}
            styles={{
              root: {
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(34, 139, 230, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(34, 139, 230, 0.4)',
                },
              },
            }}
          >
            Xizmat qo'shish
          </Button>

          {isAuthenticated && user ? (
            <Button
              variant="light"
              color="gray"
              size="md"
              radius="xl"
              pl={8}
              leftSection={
                <Avatar
                  size={28}
                  radius="xl"
                  color={theme.colors?.blue?.[6]}
                  style={{
                    border: `2px solid ${theme.other?.mainWhite}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              onClick={() => handleNavigate('/profile')}
              styles={{
                root: {
                  backgroundColor: theme.colors?.gray?.[1],
                  color: theme.colors?.gray?.[9],
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.colors?.gray?.[2],
                  },
                },
              }}
            >
              {user.name}
            </Button>
          ) : (
            <Button
              variant="filled"
              color="gray"
              size="md"
              radius="xl"
              bg={theme.colors?.gray?.[9]}
              leftSection={<FaRegUser size={16} />}
              onClick={handleLoginClick}
              styles={{
                root: {
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  },
                },
              }}
            >
              Kirish
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );

  const mobileHeader = (
    <>
      <Container w="100%">
        <Flex w="100%" justify="space-between" align="center" py="xs">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={logo} alt="logo" h={40} w="auto" fit="contain" />
          </Link>
          <Button
            variant="subtle"
            color="gray"
            size="lg"
            radius="xl"
            onClick={() => setDrawerOpened(true)}
            styles={{
              root: { color: theme.colors?.gray?.[8] },
            }}
          >
            <IoMenu size={28} />
          </Button>
        </Flex>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="left"
        size="85%"
        padding={0}
        withCloseButton={false}
        styles={{
          content: {
            backgroundColor: theme.other?.mainWhite,
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
          },
        }}
      >
        <Box
          p="md"
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: theme.other?.mainWhite,
            zIndex: 10,
            borderBottom: `1px solid ${theme.colors?.gray?.[2]}`,
          }}
        >
          <Flex justify="space-between" align="center">
            <Image src={logo} alt="logo" h={40} w="auto" fit="contain" />
            <Button
              variant="subtle"
              color="gray"
              size="md"
              radius="xl"
              onClick={() => setDrawerOpened(false)}
            >
              <IoCloseOutline size={24} />
            </Button>
          </Flex>
        </Box>
        <Box
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <Stack gap="lg">
            {isAuthenticated && user ? (
              <Box
                p="md"
                style={{
                  borderRadius: 20,
                  backgroundColor: theme.colors?.gray?.[0],
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                }}
              >
                <UnstyledButton
                  w="100%"
                  onClick={() => {
                    handleNavigate('/profile');
                    setDrawerOpened(false);
                  }}
                  style={{
                    display: 'block',
                    marginBottom: 'md',
                  }}
                >
                  <Flex align="center" gap="md">
                    <Avatar
                      size="lg"
                      radius="xl"
                      color={theme.colors?.blue?.[6]}
                      style={{
                        backgroundColor: theme.colors?.blue?.[1],
                        color: theme.colors?.blue?.[6],
                        fontWeight: 600,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text fw={700} fz={16} c={theme.colors?.gray?.[9]}>
                        {user.name}
                      </Text>
                      <Text fz={13} c={theme.colors?.gray?.[6]}>
                        {user.phone}
                      </Text>
                    </Box>
                  </Flex>
                </UnstyledButton>
                <Button
                  variant="white"
                  color="red"
                  fullWidth
                  radius="md"
                  leftSection={<FaRegUser size={16} />}
                  onClick={handleLogout}
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  Chiqish
                </Button>
              </Box>
            ) : (
              <Button
                variant="filled"
                color="blue"
                fullWidth
                size="lg"
                radius="xl"
                leftSection={<FaRegUser />}
                onClick={handleLoginClick}
              >
                Kirish
              </Button>
            )}

            <Stack gap="sm">
              <Button
                variant={isOrdersActive ? 'light' : 'subtle'}
                color="blue"
                fullWidth
                size="lg"
                radius="lg"
                justify="flex-start"
                leftSection={<IoMdNotificationsOutline size={22} />}
                onClick={() => handleProtectedNavigate('/orders')}
              >
                Zakazlar
              </Button>
              <Button
                variant={isPremiumActive ? 'light' : 'subtle'}
                color="yellow"
                fullWidth
                size="lg"
                radius="lg"
                justify="flex-start"
                leftSection={<LuCrown size={22} />}
                onClick={() => handleNavigate('/premium')}
              >
                Premium
              </Button>
              <Button
                variant="subtle"
                color="blue"
                fullWidth
                size="lg"
                radius="lg"
                justify="flex-start"
                leftSection={<TbClipboardText size={22} />}
                onClick={() => handleProtectedNavigate('/create-order')}
              >
                Buyurtma berish
              </Button>
            </Stack>

            <Box>
              {fullCategories.length > 0 ? (
                <Categories
                  categories={fullCategories}
                  activeSlug={
                    location.pathname.startsWith('/category/')
                      ? location.pathname
                          .replace('/category/', '')
                          .split('?')[0] || null
                      : null
                  }
                  onSelect={(slug) => {
                    handleCategoryClick(`/category/${slug}`);
                  }}
                  isLoading={isLoadingCategories}
                />
              ) : (
                <Category
                  onItemClick={handleCategoryClick}
                  singleColumn
                  categories={categories}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </>
  );

  return (
    <>
      <Box
        pos="sticky"
        top={0}
        left={0}
        right={0}
        w="100%"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          zIndex: 90,
          transition: 'all 0.3s ease',
        }}
      >
        {isMobile ? mobileHeader : desktopHeader}
      </Box>

      {/* Mobile Fixed Bottom Button - Order and Add Service */}
      {isMobile && (
        <Box
          pos="fixed"
          bottom={0}
          left={0}
          right={0}
          p="md"
          bg="transparent"
          style={{
            zIndex: 100,
            background:
              'linear-gradient(to top, rgba(255,255,255,0.98) 70%, rgba(255,255,255,0) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Container>
            <Flex gap="sm">
              <Button
                variant="light"
                fullWidth
                size="lg"
                radius="xl"
                h={54}
                leftSection={<TbClipboardText size={20} />}
                onClick={() => handleProtectedNavigate('/create-order')}
                styles={{
                  root: {
                    backgroundColor: theme.colors?.blue?.[0],
                    color: theme.colors?.blue?.[6],
                    fontSize: 16,
                    fontWeight: 600,
                    border: `1px solid ${theme.colors?.blue?.[2]}`,
                    flex: 1,
                  },
                }}
              >
                Buyurtma berish
              </Button>
              <Button
                variant="filled"
                fullWidth
                size="lg"
                radius="xl"
                h={54}
                leftSection={<FaPlus size={18} />}
                onClick={() => handleProtectedNavigate('/profile#add-service')}
                styles={{
                  root: {
                    background: `linear-gradient(135deg, ${theme.colors?.blue?.[6]} 0%, ${theme.colors?.blue?.[8]} 100%)`,
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(34, 139, 230, 0.4)',
                    fontSize: 16,
                    fontWeight: 600,
                    flex: 1,
                    '&:active': { transform: 'scale(0.98)' },
                  },
                }}
              >
                Xizmat qo'shish
              </Button>
            </Flex>
          </Container>
        </Box>
      )}

      <Auth
        opened={authModalOpened}
        onClose={() => setAuthModalOpened(false)}
        onVerify={handleAuthVerify}
      />
    </>
  );
}

export default Header;

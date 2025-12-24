import { useEffect, useState } from 'react';
import theme from '@/shared/theme';
import Container from '@/shared/ui/Container';
import { Box, Button, Flex, Text, Title } from '@mantine/core';
import { Link } from '@/shared/lib/router';
import { Image } from '@mantine/core';
import { IoLogoInstagram, IoLogoYoutube } from 'react-icons/io';
import { IoLogoFacebook } from 'react-icons/io';
import { TbBrandTelegram } from 'react-icons/tb';
import { LuPhone } from 'react-icons/lu';
import { MdOutlineMailOutline } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { useMediaQuery } from '@mantine/hooks';
import { getFooter } from '@/shared/api/services/footer';
import type { IFooterResponse } from '@/shared/api/services/footer/footer.types';
import { useAuthStore } from '@/shared/store/authStore';
import { Auth } from '@/shared/ui/auth';
import { useNavigate } from '@/shared/lib/router';

function Footer() {
  const logo = '/assets/images/logo.png';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [footer, setFooter] = useState<IFooterResponse['data'] | null>(null);
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooter();
        setFooter(data);
      } catch {
        setFooter(null);
      }
    };
    fetchFooter();
  }, []);

  const handleAuthVerify = (code: string) => {
    console.log('Verification code:', code);
    setAuthModalOpened(false);
  };

  const handleProtectedNavigate = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setAuthModalOpened(true);
    }
  };
  return (
    <Box
      w="100%"
      bg="gray.8"
      c={theme.colors?.gray?.[0]}
      py={{ base: 'lg', md: 'xl' }}
    >
      <Container px={{ base: 'md', sm: 'lg' }}>
        <Flex justify="start" align="start" direction="column" gap="lg">
          <Flex
            w="100%"
            justify="space-between"
            align="start"
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 'lg', md: 'md' }}
          >
            <Flex
              justify="start"
              align="start"
              direction="column"
              gap="md"
              w={{ base: '100%', md: 'auto' }}
            >
              <Link to="/">
                <Image src={logo} alt="logo" width={60} height={60} />
              </Link>

              <Text fz={16} fw={600} maw={isMobile ? '100%' : 350}>
                {footer?.company?.tagline || ''} {' • '}
                {footer?.company?.description}
              </Text>
              <Flex
                justify="start"
                align="center"
                direction="row"
                wrap="wrap"
                gap="sm"
              >
                {footer?.socials?.instagram && (
                  <Button
                    component="a"
                    href={footer.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    p={10}
                    h={36}
                    bd="transparent"
                    c={theme.colors?.gray?.[4]}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color =
                        theme.other?.mainWhite || '')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color =
                        theme.colors?.gray?.[4] || '')
                    }
                  >
                    <IoLogoInstagram size={20} />
                  </Button>
                )}
                {footer?.socials?.facebook && (
                  <Button
                    component="a"
                    href={footer.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    p={10}
                    h={36}
                    bd="transparent"
                    c={theme.colors?.gray?.[4]}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color =
                        theme.other?.mainWhite || '')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color =
                        theme.colors?.gray?.[4] || '')
                    }
                  >
                    <IoLogoFacebook size={20} />
                  </Button>
                )}
                {footer?.socials?.youtube && (
                  <Button
                    component="a"
                    href={footer.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    p={10}
                    h={36}
                    bd="transparent"
                    c={theme.colors?.gray?.[4]}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color =
                        theme.other?.mainWhite || '')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color =
                        theme.colors?.gray?.[4] || '')
                    }
                  >
                    <IoLogoYoutube size={20} />
                  </Button>
                )}
                {footer?.socials?.telegram && (
                  <Button
                    component="a"
                    href={footer.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    p={10}
                    h={36}
                    bd="transparent"
                    c={theme.colors?.gray?.[4]}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color =
                        theme.other?.mainWhite || '')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color =
                        theme.colors?.gray?.[4] || '')
                    }
                  >
                    <TbBrandTelegram size={20} />
                  </Button>
                )}
              </Flex>
            </Flex>
            <Flex
              justify="start"
              align="start"
              direction="column"
              gap={6}
              w={{ base: '100%', md: 'auto' }}
            >
              <Title order={3} fw={600} c={theme.other?.mainWhite} mb={10}>
                Kategoriyalar
              </Title>
              {footer?.categories?.slice(0, 5).map(category => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <Text
                    fz={14}
                    fw={500}
                    c={theme.colors?.gray?.[1]}
                    className="link"
                  >
                    {category.name}
                  </Text>
                </Link>
              ))}
            </Flex>
            <Flex
              justify="start"
              align="start"
              direction="column"
              gap={6}
              w={{ base: '100%', md: 'auto' }}
            >
              <Title order={3} fw={600} c={theme.other?.mainWhite} mb={10}>
                Foydalanuvchilarga
              </Title>
              {footer?.links && (
                <>
                  <Link to={footer.links.about || '#'}>
                    <Text
                      fz={14}
                      fw={500}
                      c={theme.colors?.gray?.[1]}
                      className="link"
                    >
                      Biz haqimizda
                    </Text>
                  </Link>
                  <Link to={footer.links.help_center || '#'}>
                    <Text
                      fz={14}
                      fw={500}
                      c={theme.colors?.gray?.[1]}
                      className="link"
                    >
                      Yordam markazi
                    </Text>
                  </Link>
                  <Link to={footer.links.contact || '#'}>
                    <Text
                      fz={14}
                      fw={500}
                      c={theme.colors?.gray?.[1]}
                      className="link"
                    >
                      Bog'lanish
                    </Text>
                  </Link>
                  <Link
                    to="/profile#add-service"
                    onClick={e => {
                      e.preventDefault();
                      handleProtectedNavigate('/profile#add-service');
                    }}
                  >
                    <Text
                      fz={14}
                      fw={500}
                      c={theme.colors?.gray?.[1]}
                      className="link"
                    >
                      Xizmat qo'shish
                    </Text>
                  </Link>
                  <Link to="/premium">
                    <Text
                      fz={14}
                      fw={500}
                      c={theme.colors?.gray?.[1]}
                      className="link"
                    >
                      Premium a'zolik
                    </Text>
                  </Link>
                </>
              )}
            </Flex>
            <Flex
              justify="start"
              align="start"
              direction="column"
              gap="md"
              w={{ base: '100%', md: 'auto' }}
            >
              <Title order={3} fw={600} c={theme.other?.mainWhite} mb={10}>
                Aloqa
              </Title>
              {footer?.contacts?.phone && (
                <Flex justify="start" align="start" gap="md">
                  <LuPhone size={20} color={theme.colors?.blue?.[6]} />
                  <Link to={`tel:${footer.contacts.phone}`} className="link">
                    <Text fz={14} fw={500} c={theme.colors?.gray?.[4]}>
                      {footer.contacts.phone}
                    </Text>
                  </Link>
                </Flex>
              )}
              {footer?.contacts?.email && (
                <Flex justify="start" align="start" gap="md">
                  <MdOutlineMailOutline
                    size={20}
                    color={theme.colors?.blue?.[6]}
                  />
                  <Link to={`mailto:${footer.contacts.email}`} className="link">
                    <Text fz={14} fw={500} c={theme.colors?.gray?.[4]}>
                      {footer.contacts.email}
                    </Text>
                  </Link>
                </Flex>
              )}
              {footer?.contacts?.address && (
                <Flex justify="start" align="start" gap="md">
                  <IoLocationOutline
                    size={20}
                    color={theme.colors?.blue?.[6]}
                  />
                  <Text
                    fz={14}
                    fw={500}
                    c={theme.colors?.gray?.[4]}
                    maw={isMobile ? '100%' : 250}
                  >
                    {footer.contacts.address}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex
            w="100%"
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'start' }}
            direction={{ base: 'column', md: 'row' }}
            gap="md"
            py="md"
            style={{ borderTop: `1px solid ${theme.colors?.gray?.[5]}` }}
            c={theme.colors?.gray?.[4]}
            ta={{ base: 'center', md: 'left' }}
          >
            <Text>
              © {new Date().getFullYear()}{' '}
              <Link
                className="link"
                to="/"
                style={{ color: theme.colors?.gray?.[4] }}
              >
                {footer?.company?.name || 'Servis.uz'}
              </Link>{' '}
              Barcha huquqlar himoyalangan.
            </Text>
            <Flex justify="start" align="center" direction="row" gap="md">
              {footer?.links?.privacy_policy && (
                <Link className="link" to={footer.links.privacy_policy}>
                  <Text fz={14} fw={500} c={theme.colors?.gray?.[4]}>
                    Maxfiylik siyosati
                  </Text>
                </Link>
              )}
              {footer?.links?.terms && (
                <Link className="link" to={footer.links.terms}>
                  <Text fz={14} fw={500} c={theme.colors?.gray?.[4]}>
                    Foydalanish shartlari
                  </Text>
                </Link>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Container>
      <Auth
        opened={authModalOpened}
        onClose={() => setAuthModalOpened(false)}
        onVerify={handleAuthVerify}
      />
    </Box>
  );
}

export default Footer;

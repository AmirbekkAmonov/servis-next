import { Box, Title, Text, Flex, Button, Skeleton } from '@mantine/core';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { SearchInput } from './ui/searchInput';
import { useState, useEffect } from 'react';
import { useNavigate } from '@/shared/lib/router';
import { getFooter } from '@/shared/api/services/footer';
import type { IFooterResponse } from '@/shared/api/services/footer/footer.types';

function Hero() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState<
    IFooterResponse['data']['categories']
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const footerData = await getFooter();
        if (footerData?.categories) {
          setCategories(footerData.categories.slice(0, 4));
        }
      } catch {
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const popularCategories = categories.map((category) => ({
    label: category.name,
    path: `/category/${category.slug}`,
  }));

  const handleCategoryClick = (category: { label: string; path: string }) => {
    setSearchValue(category.label);
    navigate(category.path);
  };

  const handleSearchSubmit = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;

    // Avval popular kategoriyalar orasida qidirish
    const normalized = trimmed.toLowerCase();
    const found =
      popularCategories.find((cat) =>
        cat.label.toLowerCase().includes(normalized)
      ) ??
      popularCategories.find((cat) =>
        normalized.includes(cat.label.toLowerCase())
      );

    if (found) {
      navigate(found.path);
    } else {
      // Agar topilmasa, matnni slug formatiga o'tkazib /category/{slug} ga o'tish
      const slug = trimmed
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      navigate(`/category/${slug}`);
    }
  };

  return (
    <Box
      w="100%"
      h="100%"
      bg={theme.colors?.blue?.[6]}
      py={{ base: 60, sm: 80, md: 100 }}
      c={theme.other?.mainWhite}
    >
      <Container ta="center" px={{ base: 'md', sm: 'lg' }}>
        <Title order={1} fz={{ base: 28, sm: 36, md: 44 }} fw={700} lh={1.1}>
          O'zbekistondagi Eng Yaxshi Xizmatlar
        </Title>
        <Text
          fz={{ base: 15, sm: 17, md: 20 }}
          fw={400}
          mt="sm"
          mb="xl"
          c={theme.colors?.gray?.[1]}
        >
          3000+ xizmat ko'rsatuvchilar bir joyda. Toping, tanlang, bron qiling!
        </Text>
        <Box w="100%" h="100%" maw={720} mx="auto" px={{ base: 0, sm: 'md' }}>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearchSubmit}
          />
        </Box>
        <Flex
          justify={{ base: 'center', sm: 'start' }}
          align="center"
          w="100%"
          mt="md"
          maw={720}
          mx="auto"
          gap={8}
          wrap="wrap"
        >
          <Text fz={14} fw={400} style={{ whiteSpace: 'nowrap' }}>
            Mashhur:
          </Text>
          {isLoadingCategories ? (
            <>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  height={32}
                  w="20%"
                  radius={30}
                  style={{ whiteSpace: 'nowrap' }}
                />
              ))}
            </>
          ) : popularCategories.length > 0 ? (
            popularCategories.map((category) => (
              <Button
                key={category.path}
                variant="light"
                color="blue"
                radius={30}
                size="sm"
                h={32}
                c={theme.other?.mainWhite}
                fz={14}
                fw={400}
                style={{ whiteSpace: 'nowrap' }}
                styles={{
                  root: {
                    backgroundColor: theme.colors?.blue?.[7],
                    transition: 'background-color 120ms ease, color 120ms ease',
                    '&:hover, &[dataHover]': {
                      backgroundColor: theme.colors?.blue?.[8],
                      color: theme.other?.mainWhite,
                    },
                  },
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {category.label}
              </Button>
            ))
          ) : null}
        </Flex>
      </Container>
    </Box>
  );
}

export default Hero;

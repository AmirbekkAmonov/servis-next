'use client';

import { useEffect } from 'react';
import { Box, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';

import theme from '@/shared/theme';
import queryClient from '@/shared/queryClient';
import { initializeLocale } from '@/shared/lib/language';
import '@/shared/i18n';
import { Header } from '@/widgets/layout/header';
import { Footer } from '@/widgets/layout/footer';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const pathname = usePathname();

  // locale init (localStorage -> i18n)
  useEffect(() => {
    initializeLocale();
  }, []);

  // route o‘zgarganda scroll-top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications position="top-right" zIndex={1000} autoClose={3000} />
        <Header />
        <Box pb={isMobile ? 100 : 0}>{children}</Box>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
}

'use client';

import { Hero } from '@/screens/home/ui/hero';
import { Box } from '@mantine/core';
import { Category } from '@/screens/home/ui/category';
import { Popular } from '@/screens/home/ui/popular';
import { Premium } from '@/screens/home/ui/premium';

export default function HomePage() {
  return (
    <Box w="100%" h="100%">
      <Hero />
      <Category />
      <Premium />
      <Popular />
    </Box>
  );
}

import { Hero } from './ui/hero';
import { Box } from '@mantine/core';
import { Category } from './ui/category';
import { Popular } from './ui/popular';
import { Premium } from './ui/premium';

function Home() {
  return (
    <Box w="100%" h="100%">
      <Hero />
      <Category />
      <Premium />
      <Popular />
    </Box>
  );
}

export default Home;

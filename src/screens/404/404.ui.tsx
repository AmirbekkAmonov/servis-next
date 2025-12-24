import { Box, Button, Flex } from '@mantine/core';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from '@/shared/lib/router';
import { IoArrowBack } from 'react-icons/io5';

function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      align="center"
      justify="start"
      h="100vh"
      w="100vw"
      bg="gray.0"
      p="xl"
    >
      <Box w="85%" h="85%">
        <DotLottieReact
          src="https://lottie.host/ec2dfb78-d327-4143-8180-ea6294dc2147/zrq3MsZMO5.lottie"
          loop
          autoplay
        />
      </Box>
      <Button onClick={() => navigate('/')} leftSection={<IoArrowBack />}>
        Asosiy sahifaga qaytish
      </Button>
    </Flex>
  );
}

export default NotFound;

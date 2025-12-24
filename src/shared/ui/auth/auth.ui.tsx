import { Box, Text, Button, PinInput, Stack, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/modal';
import theme from '@/shared/theme';
import { Image } from '@mantine/core';
import { TbBrandTelegram } from 'react-icons/tb';
import { verifyTelegramCode } from '@/shared/api/services/auth';
import { useAuthStore } from '@/shared/store/authStore';
import type { IUser } from '@/shared/api/services/header';

type AuthModalProps = {
  opened: boolean;
  onClose: () => void;
  onVerify?: (code: string) => void;
};

function Auth({ opened, onClose, onVerify }: AuthModalProps) {
  const logo = '/assets/images/logo.png';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  // Reset OTP when modal closes
  useEffect(() => {
    if (!opened) {
      setOtp('');
      setError(null);
    }
  }, [opened]);

  const handleComplete = async (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      await handleVerify(value);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyTelegramCode(code);

      if (response.success && response.data) {
        // IUser formatiga o'girish
        const user: IUser = {
          id: response.data.user.id,
          name: response.data.user.name,
          phone: response.data.user.phone,
          role: response.data.user.role,
          is_premium: response.data.user.is_premium,
          access_token: response.data.token,
          refresh_token: response.data.token, // Agar refresh token alohida bo'lsa, API'dan olish kerak
        };

        // Xotiraga saqlash
        login(user);

        // Modal yopish
        onClose();

        // Agar onVerify callback bo'lsa, chaqirish
        if (onVerify) {
          onVerify(code);
        }
      } else {
        setError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/Servise_uz_bot', '_blank');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title=""
      size="sm"
      withCloseButton={true}
    >
      <Stack gap="lg" align="center" py="md">
        <Image src={logo} alt="logo" width={80} height={80} />

        <Box ta="center">
          <Text fw={600} fz={18} c={theme.colors?.gray?.[9]} mb="xs">
            Kodni Kiriting
          </Text>
          <Text fz={14} c={theme.colors?.gray?.[6]} lh={1.5}>
            <Text
              component="a"
              href="https://t.me/Servise_uz_bot"
              target="_blank"
              rel="noopener noreferrer"
              fw={600}
              c={theme.colors?.blue?.[6]}
              style={{ textDecoration: 'none' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
              }
            >
              @Servise_uz_bot
            </Text>{' '}
            botiga kiring va 1 daqiqalik kodingizni oling.
          </Text>
        </Box>

        <PinInput
          length={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          type="number"
          size="lg"
          disabled={loading}
          styles={{
            input: {
              borderColor: error
                ? theme.colors?.red?.[6]
                : theme.colors?.gray?.[3],
              fontSize: 20,
              fontWeight: 600,
              '&:focus': {
                borderColor: error
                  ? theme.colors?.red?.[6]
                  : theme.colors?.blue?.[6],
              },
            },
          }}
        />

        {loading && (
          <Box ta="center" py="sm">
            <Loader size="sm" color={theme.colors?.blue?.[6]} />
          </Box>
        )}

        {error && (
          <Text fz={14} c={theme.colors?.red?.[6]} ta="center" fw={500}>
            {error}
          </Text>
        )}

        <Button
          variant="light"
          color="blue"
          fullWidth
          leftSection={<TbBrandTelegram size={18} />}
          onClick={handleTelegramClick}
          styles={{
            root: {
              marginTop: 8,
            },
          }}
        >
          Telegram botga o'tish
        </Button>
      </Stack>
    </Modal>
  );
}

export default Auth;

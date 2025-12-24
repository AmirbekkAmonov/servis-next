import {
  Box,
  Flex,
  Text,
  Card,
  Stack,
  TextInput,
  Button,
  Avatar,
  Group,
  Divider,
  Badge,
  Paper,
} from '@mantine/core';
import theme from '@/shared/theme';
import {
  TbEdit,
  TbCamera,
  TbCheck,
  TbUser,
  TbPhone,
  TbShield,
  TbCrown,
} from 'react-icons/tb';
import { useRef, useState } from 'react';
import type { IUser } from '@/shared/api/services/header';

interface EditProfileProps {
  user: IUser | null;
  onSave?: (updatedUser: Partial<IUser>) => void;
}

function EditProfile({ user, onSave }: EditProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onSave) {
      const updatedUser: Partial<IUser> = {
        ...formData,
        ...(avatarPreview && { avatar: avatarPreview }),
      };
      onSave(updatedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Iltimos, faqat rasm faylini tanlang!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb="xl"
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'md' }}
      >
        <Text fw={700} fz={{ base: 18, sm: 22 }} c={theme.colors?.gray?.[9]}>
          Profil ma'lumotlari
        </Text>
        {!isEditing && (
          <Button
            variant="light"
            size="sm"
            color="blue"
            leftSection={<TbEdit size={16} />}
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: theme.colors?.blue?.[0],
              border: `1px solid ${theme.colors?.blue?.[2]}`,
            }}
          >
            Tahrirlash
          </Button>
        )}
      </Flex>

      <Card
        p={{ base: 'lg', sm: 'xl' }}
        radius="md"
        style={{
          backgroundColor: theme.other?.mainWhite,
          border: `1px solid ${theme.colors?.gray?.[2]}`,
          boxShadow: `0 4px 12px ${theme.colors?.gray?.[1]}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(135deg, ${theme.colors?.blue?.[0]} 0%, ${theme.colors?.purple?.[0] || theme.colors?.blue?.[1]} 100%)`,
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
          {/* Avatar Section */}
          <Flex justify="center" direction="column" align="center" gap="md">
            <Box style={{ position: 'relative' }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Avatar
                size={140}
                radius="xl"
                color={theme.colors?.blue?.[6]}
                src={avatarPreview || undefined}
                style={{
                  backgroundColor: avatarPreview
                    ? 'transparent'
                    : theme.colors?.blue?.[1],
                  color: theme.colors?.blue?.[6],
                  fontWeight: 600,
                  fontSize: 56,
                  border: `5px solid ${theme.other?.mainWhite}`,
                  boxShadow: `0 12px 32px ${theme.colors?.gray?.[3]}`,
                  transition: 'all 0.3s ease',
                  width: 'clamp(120px, 18vw, 140px)',
                  height: 'clamp(120px, 18vw, 140px)',
                  cursor: isEditing ? 'pointer' : 'default',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: isEditing ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isEditing
                        ? `0 16px 40px ${theme.colors?.gray?.[4]}`
                        : `0 12px 32px ${theme.colors?.gray?.[3]}`,
                    },
                  },
                }}
                onClick={isEditing ? handleAvatarClick : undefined}
              >
                {!avatarPreview && user.name.charAt(0).toUpperCase()}
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  radius="xl"
                  p={10}
                  onClick={handleAvatarClick}
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: theme.colors?.blue?.[6],
                    boxShadow: `0 6px 16px ${theme.colors?.blue?.[4]}`,
                    border: `3px solid ${theme.other?.mainWhite}`,
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        transform: 'scale(1.15) rotate(5deg)',
                        backgroundColor: theme.colors?.blue?.[7],
                      },
                    },
                  }}
                >
                  <TbCamera size={18} />
                </Button>
              )}
            </Box>
            <Text fw={600} fz={18} c={theme.colors?.gray?.[9]} ta="center">
              {user.name}
            </Text>
          </Flex>

          <Divider
            label={
              <Text fz={12} fw={500} c={theme.colors?.gray?.[6]}>
                Ma'lumotlar
              </Text>
            }
            labelPosition="center"
          />

          <Stack gap="lg">
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.gray?.[0],
                border: `1px solid ${theme.colors?.gray?.[2]}`,
                transition: 'all 0.3s ease',
              }}
              styles={{
                root: {
                  '&:hover': {
                    borderColor: theme.colors?.blue?.[3],
                    backgroundColor: theme.colors?.blue?.[0],
                  },
                },
              }}
            >
              <TextInput
                label={
                  <Group gap={4} mb={4}>
                    <TbUser size={16} color={theme.colors?.blue?.[6]} />
                    <Text fw={500} fz={14} c={theme.colors?.gray?.[9]}>
                      Ism
                    </Text>
                  </Group>
                }
                placeholder="Ismingizni kiriting"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
                styles={{
                  input: {
                    backgroundColor: isEditing
                      ? theme.other?.mainWhite
                      : theme.colors?.gray?.[1],
                    border: `1px solid ${theme.colors?.gray?.[2]}`,
                    fontSize: 15,
                    '&:focus': {
                      borderColor: theme.colors?.blue?.[6],
                    },
                  },
                }}
              />
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.gray?.[0],
                border: `1px solid ${theme.colors?.gray?.[2]}`,
                transition: 'all 0.3s ease',
              }}
              styles={{
                root: {
                  '&:hover': {
                    borderColor: theme.colors?.blue?.[3],
                    backgroundColor: theme.colors?.blue?.[0],
                  },
                },
              }}
            >
              <TextInput
                label={
                  <Group gap={4} mb={4}>
                    <TbPhone size={16} color={theme.colors?.blue?.[6]} />
                    <Text fw={500} fz={14} c={theme.colors?.gray?.[9]}>
                      Telefon raqami
                    </Text>
                  </Group>
                }
                placeholder="Telefon raqamingizni kiriting"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                styles={{
                  input: {
                    backgroundColor: isEditing
                      ? theme.other?.mainWhite
                      : theme.colors?.gray?.[1],
                    border: `1px solid ${theme.colors?.gray?.[2]}`,
                    fontSize: 15,
                    '&:focus': {
                      borderColor: theme.colors?.blue?.[6],
                    },
                  },
                }}
              />
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: theme.colors?.blue?.[0],
                border: `1px solid ${theme.colors?.blue?.[2]}`,
                transition: 'all 0.3s ease',
              }}
              styles={{
                root: {
                  '&:hover': {
                    borderColor: theme.colors?.blue?.[4],
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${theme.colors?.blue?.[1]}`,
                  },
                },
              }}
            >
              <Group gap="sm" align="center" mb="xs">
                <TbShield size={18} color={theme.colors?.blue?.[6]} />
                <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                  Rol
                </Text>
              </Group>
              <Badge
                size="lg"
                color="blue"
                variant="light"
                style={{
                  backgroundColor: theme.colors?.blue?.[1],
                  border: `1px solid ${theme.colors?.blue?.[3]}`,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {user.role === 'user' ? 'Foydalanuvchi' : user.role}
              </Badge>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: (() => {
                  const isPremium =
                    user.is_premium === true ||
                    user.is_premium === 1 ||
                    (typeof user.is_premium === 'number' &&
                      user.is_premium > 0);
                  const daysLeft =
                    user.premium_days_left !== undefined
                      ? user.premium_days_left
                      : null;

                  if (isPremium && (daysLeft === null || daysLeft > 0)) {
                    return theme.colors?.yellow?.[0];
                  }
                  return theme.colors?.gray?.[0];
                })(),
                border: `2px solid ${(() => {
                  const isPremium =
                    user.is_premium === true ||
                    user.is_premium === 1 ||
                    (typeof user.is_premium === 'number' &&
                      user.is_premium > 0);
                  const daysLeft =
                    user.premium_days_left !== undefined
                      ? user.premium_days_left
                      : null;

                  if (isPremium && (daysLeft === null || daysLeft > 0)) {
                    return theme.colors?.yellow?.[3];
                  }
                  return theme.colors?.gray?.[2];
                })()}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 16px ${(() => {
                      const isPremium =
                        user.is_premium === true ||
                        user.is_premium === 1 ||
                        (typeof user.is_premium === 'number' &&
                          user.is_premium > 0);
                      const daysLeft =
                        user.premium_days_left !== undefined
                          ? user.premium_days_left
                          : null;

                      if (isPremium && (daysLeft === null || daysLeft > 0)) {
                        return theme.colors?.yellow?.[2];
                      }
                      return theme.colors?.gray?.[2];
                    })()}`,
                  },
                },
              }}
            >
              {(() => {
                const isPremium =
                  user.is_premium === true ||
                  user.is_premium === 1 ||
                  (typeof user.is_premium === 'number' && user.is_premium > 0);
                const daysLeft =
                  user.premium_days_left !== undefined
                    ? user.premium_days_left
                    : null;

                if (isPremium && (daysLeft === null || daysLeft > 0)) {
                  return (
                    <>
                      <Box
                        style={{
                          position: 'absolute',
                          top: -20,
                          right: -20,
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${theme.colors?.yellow?.[2]} 0%, transparent 70%)`,
                          opacity: 0.3,
                        }}
                      />
                      <Group
                        gap="sm"
                        align="center"
                        mb="xs"
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        <TbCrown size={18} color={theme.colors?.yellow?.[6]} />
                        <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                          Premium status
                        </Text>
                      </Group>
                      <Group
                        gap="sm"
                        align="center"
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        <Badge
                          size="lg"
                          color="yellow"
                          variant="filled"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors?.yellow?.[6]} 0%, ${theme.colors?.orange?.[6]} 100%)`,
                            boxShadow: `0 4px 12px ${theme.colors?.yellow?.[4]}`,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          <Group gap={4}>
                            <span>👑</span>
                            {daysLeft !== null && daysLeft > 0
                              ? `${daysLeft} kun qoldi`
                              : 'Premium'}
                          </Group>
                        </Badge>
                      </Group>
                    </>
                  );
                }

                return (
                  <>
                    <Group gap="sm" align="center" mb="xs">
                      <TbShield size={18} color={theme.colors?.gray?.[6]} />
                      <Text fw={600} fz={14} c={theme.colors?.gray?.[9]}>
                        Premium status
                      </Text>
                    </Group>
                    <Badge
                      size="lg"
                      color="gray"
                      variant="light"
                      style={{
                        backgroundColor: theme.colors?.gray?.[1],
                        border: `1px solid ${theme.colors?.gray?.[3]}`,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Oddiy
                    </Badge>
                  </>
                );
              })()}
            </Paper>
          </Stack>

          {isEditing && (
            <Group gap="sm" justify="flex-end" mt="md" wrap="wrap">
              <Button
                variant="outline"
                color="gray"
                onClick={handleCancel}
                size="md"
                style={{
                  borderColor: theme.colors?.gray?.[3],
                  color: theme.colors?.gray?.[7],
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: theme.colors?.gray?.[0],
                      borderColor: theme.colors?.gray?.[4],
                    },
                  },
                }}
              >
                Bekor qilish
              </Button>
              <Button
                color="blue"
                leftSection={<TbCheck size={18} />}
                onClick={handleSave}
                size="md"
                style={{
                  boxShadow: `0 4px 12px ${theme.colors?.blue?.[3]}`,
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 16px ${theme.colors?.blue?.[4]}`,
                    },
                  },
                }}
              >
                Saqlash
              </Button>
            </Group>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

export default EditProfile;

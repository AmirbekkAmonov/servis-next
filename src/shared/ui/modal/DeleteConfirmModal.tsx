import { Modal, Stack, Text, Group, Button } from '@mantine/core';
import { TbTrash, TbX, TbAlertTriangle } from 'react-icons/tb';
import theme from '@/shared/theme';

interface DeleteConfirmModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    serviceName: string;
    isDeleting?: boolean;
}

function DeleteConfirmModal({
    opened,
    onClose,
    onConfirm,
    serviceName,
    isDeleting = false,
}: DeleteConfirmModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="md"
            radius="lg"
            withCloseButton={false}
            styles={{
                content: {
                    padding: 0,
                },
            }}
        >
            <Stack gap="lg" p="xl">
                {/* Icon */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: theme.colors?.red?.[0],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                    }}
                >
                    <TbAlertTriangle size={40} color={theme.colors?.red?.[6]} />
                </div>

                {/* Content */}
                <Stack gap="sm" align="center">
                    <Text fw={700} fz={22} c={theme.colors?.gray?.[9]} ta="center">
                        Xizmatni o'chirish
                    </Text>
                    <Text fz={15} c={theme.colors?.gray?.[6]} ta="center" maw={400}>
                        Siz haqiqatan ham{' '}
                        <Text component="span" fw={600} c={theme.colors?.gray?.[9]}>
                            "{serviceName}"
                        </Text>{' '}
                        xizmatini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                    </Text>
                </Stack>

                {/* Actions */}
                <Group gap="sm" mt="md">
                    <Button
                        variant="light"
                        color="gray"
                        size="md"
                        fullWidth
                        leftSection={<TbX size={18} />}
                        onClick={onClose}
                        disabled={isDeleting}
                        styles={{
                            root: {
                                transition: 'all 0.2s ease',
                            },
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        variant="filled"
                        color="red"
                        size="md"
                        fullWidth
                        leftSection={<TbTrash size={18} />}
                        onClick={onConfirm}
                        loading={isDeleting}
                        styles={{
                            root: {
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 16px ${theme.colors?.red?.[3]}`,
                                },
                            },
                        }}
                    >
                        {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default DeleteConfirmModal;

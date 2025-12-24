import { Modal, Stack, Textarea, Button, Group, Text, Rating, Loader, Box } from '@mantine/core';
import { useState } from 'react';
import theme from '@/shared/theme';
import { TbCheck, TbAlertCircle } from 'react-icons/tb';
import { createComment } from '@/shared/api/services/comment/comment.api';
import { openNotification } from '@/shared/lib/notification';

interface AddReviewModalProps {
    opened: boolean;
    onClose: () => void;
    serviceId: number;
    onSuccess: () => void;
}

function AddReviewModal({
    opened,
    onClose,
    serviceId,
    onSuccess,
}: AddReviewModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        // Validation
        if (rating === 0) {
            openNotification({
                title: "Iltimos, baho qo'ying",
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        if (!content.trim() || content.trim().length < 3) {
            openNotification({
                title: "Izoh kamida 3 ta belgidan iborat bo'lishi kerak",
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createComment({
                service_id: serviceId,
                content: content.trim(),
                rating,
            });

            if (res.accept) {
                openNotification({
                    title: "Sharhingiz muvaffaqiyatli qo'shildi!",
                    icon: <TbCheck size={20} />,
                    type: 'success',
                });

                // Reset form
                setRating(0);
                setContent('');
                onSuccess();
                onClose();
            } else {
                openNotification({
                    title: res.message || 'Xatolik yuz berdi',
                    icon: <TbAlertCircle size={24} />,
                    type: 'error',
                });
            }
        } catch (error: any) {
            console.error('Error creating review:', error);
            openNotification({
                title: error.response?.data?.message || 'Sharh qo\'shishda xatolik yuz berdi',
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Sharh qoldirish"
            centered
            radius="xl"
            padding="xl"
            styles={{
                title: {
                    fontWeight: 800,
                    fontSize: 24,
                    color: theme.colors?.gray?.[9],
                },
                content: {
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }
            }}
        >
            <Stack gap="xl">
                <Box style={{ textAlign: 'center' }}>
                    <Text fw={600} fz="lg" c={theme.colors?.gray?.[8]} mb={8}>
                        Xizmatni baholang
                    </Text>
                    <Rating
                        value={rating}
                        onChange={setRating}
                        size="xl"
                        color="yellow"
                        fractions={2}
                    />
                </Box>

                <Textarea
                    label="Sizning fikringiz"
                    placeholder="Xizmat haqida nima deb o'ylaysiz? Tajribangiz ulashing..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    minRows={5}
                    radius="md"
                    styles={{
                        label: { fontWeight: 600, marginBottom: 10, fontSize: 16 },
                        input: { padding: 15, fontSize: 15 }
                    }}
                />

                <Group gap="md" grow>
                    <Button
                        variant="subtle"
                        color="gray"
                        size="lg"
                        radius="xl"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        variant="filled"
                        color="blue"
                        size="lg"
                        radius="xl"
                        bg={theme.colors?.blue?.[6]}
                        leftSection={isSubmitting ? <Loader size="xs" color="white" /> : <TbCheck size={20} />}
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        styles={{
                            root: {
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(34, 139, 230, 0.3)',
                                },
                            },
                        }}
                    >
                        {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default AddReviewModal;

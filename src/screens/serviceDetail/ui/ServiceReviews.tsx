import { Box, Text, Stack, Paper, Group, Button, Rating, Progress, Avatar, Divider, Loader, Center, Title, Grid, Flex } from '@mantine/core';
import { useState, useEffect } from 'react';
import theme from '@/shared/theme';
import { TbMessagePlus, TbStar, TbThumbUp, TbThumbUpFilled } from 'react-icons/tb';
import { getComments, likeComment } from '@/shared/api/services/comment/comment.api';
import type { CommentsResponse } from '@/shared/api/services/comment/comment.types';
import { useAuthStore } from '@/shared/store/authStore';
import AddReviewModal from './AddReviewModal';

function ServiceReviews({ serviceId }: { serviceId: number }) {
    const [data, setData] = useState<CommentsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
    const { isAuthenticated } = useAuthStore();

    const fetchReviews = async () => {
        try {
            const res = await getComments(serviceId);
            if (res.accept) {
                setData(res.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (commentId: number) => {
        if (!isAuthenticated) return;

        try {
            const res = await likeComment(commentId);
            if (data) {
                const updatedItems = data.items.map(item => {
                    if (item.id === commentId) {
                        return {
                            ...item,
                            likes_count: res.likes_count,
                            is_liked: res.message === 'liked',
                        };
                    }
                    return item;
                });
                setData({ ...data, items: updatedItems });
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [serviceId]);

    if (loading) {
        return (
            <Center py="xl">
                <Loader size="md" color="blue" />
            </Center>
        );
    }

    if (!data) return null;

    return (
        <Box mt={40}>
            <Group justify="space-between" align="flex-end" mb="xl">
                <Box>
                    <Title order={2} fw={700} fz={28} c={theme.colors?.gray?.[9]} mb={4}>
                        Mijozlar fikrlari
                    </Title>
                    <Text c="dimmed" fz="sm">
                        Ushbu xizmat haqida {data.total_reviews} ta sharh qoldirilgan
                    </Text>
                </Box>
                {isAuthenticated && (
                    <Button
                        variant="filled"
                        size="md"
                        radius="xl"
                        bg={theme.colors?.blue?.[6]}
                        leftSection={<TbMessagePlus size={20} />}
                        onClick={() => setModalOpened(true)}
                        styles={{
                            root: {
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(34, 139, 230, 0.3)',
                                },
                            },
                        }}
                    >
                        Fikr qoldirish
                    </Button>
                )}
            </Group>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper
                        p="xl"
                        radius="lg"
                        style={{
                            backgroundColor: theme.other?.mainWhite,
                            border: `1px solid ${theme.colors?.gray?.[2]}`,
                            position: 'sticky',
                            top: 100,
                        }}
                    >
                        <Stack gap="md" align="center">
                            <Box style={{ textAlign: 'center' }}>
                                <Text fz={64} fw={800} c={theme.colors?.gray?.[9]} lh={1} mb={8}>
                                    {data.average_rating.toFixed(1)}
                                </Text>
                                <Rating
                                    value={data.average_rating}
                                    readOnly
                                    fractions={2}
                                    size="lg"
                                    color="yellow"
                                />
                                <Text c="dimmed" fz="sm" mt={8}>
                                    Umumiy reyting
                                </Text>
                            </Box>

                            <Divider w="100%" label="Yulduzlar taqsimoti" labelPosition="center" />

                            <Stack gap="xs" w="100%">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = data.stars[star as unknown as keyof typeof data.stars] || 0;
                                    const percent = data.total_reviews > 0 ? (count / data.total_reviews) * 100 : 0;

                                    return (
                                        <Group key={star} gap="sm" wrap="nowrap">
                                            <Group gap={4} w={40}>
                                                <Text fz={14} fw={600}>{star}</Text>
                                                <TbStar size={14} color="#FAB005" fill="#FAB005" />
                                            </Group>
                                            <Progress
                                                value={percent}
                                                color="yellow"
                                                size="sm"
                                                radius="xl"
                                                style={{ flex: 1 }}
                                            />
                                            <Text fz={13} c="dimmed" w={30} ta="right" fw={500}>
                                                {count}
                                            </Text>
                                        </Group>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        {data.items.length === 0 ? (
                            <Paper
                                p={40}
                                radius="lg"
                                style={{
                                    backgroundColor: theme.other?.mainWhite,
                                    border: `1px solid ${theme.colors?.gray?.[2]}`,
                                    textAlign: 'center'
                                }}
                            >
                                <Stack align="center" gap="sm">
                                    <TbMessagePlus size={48} color={theme.colors?.gray?.[3]} />
                                    <Text fw={600} fz="lg" c="dimmed">Hozircha sharhlar yo'q</Text>
                                    <Text fz="sm" c="dimmed">Birinchi bo'lib fikringizni qoldiring!</Text>
                                </Stack>
                            </Paper>
                        ) : (
                            data.items.map(comment => (
                                <Paper
                                    key={comment.id}
                                    p="lg"
                                    radius="lg"
                                    style={{
                                        backgroundColor: theme.other?.mainWhite,
                                        border: `1px solid ${theme.colors?.gray?.[2]}`,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Group gap="md" align="flex-start" wrap="nowrap">
                                        <Avatar
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            size="lg"
                                            radius="xl"
                                            color="blue"
                                            style={{
                                                border: `2px solid ${theme.colors?.gray?.[1]}`
                                            }}
                                        >
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box style={{ flex: 1 }}>
                                            <Flex justify="space-between" align="center" mb={4}>
                                                <Text fw={700} fz={16} c={theme.colors?.gray?.[9]}>
                                                    {comment.user.name}
                                                </Text>
                                                <Text fz={13} c="dimmed">
                                                    {comment.created_at}
                                                </Text>
                                            </Flex>
                                            <Rating
                                                value={comment.rating}
                                                readOnly
                                                size="sm"
                                                color="yellow"
                                                mb={10}
                                            />
                                            <Text fz={15} c={theme.colors?.gray?.[8]} style={{ lineHeight: 1.6 }} mb={12}>
                                                {comment.content}
                                            </Text>

                                            <Group gap="xs">
                                                <Button
                                                    variant="subtle"
                                                    size="xs"
                                                    radius="xl"
                                                    color={comment.is_liked ? 'blue' : 'gray'}
                                                    leftSection={comment.is_liked ? <TbThumbUpFilled size={16} /> : <TbThumbUp size={16} />}
                                                    onClick={() => handleLike(comment.id)}
                                                    styles={{
                                                        root: {
                                                            padding: '0 10px',
                                                            height: 30,
                                                            backgroundColor: comment.is_liked ? theme.colors?.blue?.[0] : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: comment.is_liked ? theme.colors?.blue?.[1] : theme.colors?.gray?.[1],
                                                            },
                                                        },
                                                        section: {
                                                            marginRight: 6,
                                                        }
                                                    }}
                                                >
                                                    {comment.likes_count > 0 ? comment.likes_count : ''} Like
                                                </Button>
                                            </Group>
                                        </Box>
                                    </Group>
                                </Paper>
                            ))
                        )}
                    </Stack>
                </Grid.Col>
            </Grid>

            <AddReviewModal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                serviceId={serviceId}
                onSuccess={fetchReviews}
            />
        </Box>
    );
}

export default ServiceReviews;

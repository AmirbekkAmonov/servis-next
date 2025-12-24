import {
    Box,
    Text,
    Stack,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    MultiSelect,
    Button,
    Paper,
    Flex,
    Title,
    // Group,
    // rem,
    Loader,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from '@/shared/lib/router';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { TbCheck, TbClipboardText, TbPhone, TbUser, TbCalendar, TbClock } from 'react-icons/tb';
import { getCategories, getRegions, getDistricts, type CategoryItem, type Region, type District } from '@/screens/category/category.api';
import { createOrder } from '@/shared/api/services/order/order.api';
import type { OrderCreatePayload } from '@/shared/api/services/order/order.types';
import { notifications } from '@mantine/notifications';
import { DateInput, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { ISubCategory } from '@/shared/api/services/home/home.types';

export function CreateOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Data states
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category_id: null as number | null,
        sub_category_ids: [] as number[],
        city_id: null as number | null,
        district_id: null as number | null,
        date: null as Date | null,
        time: '',
        expected_price: undefined as number | undefined,
        comment: '',
        contact_name: '',
        contact_phone: '',
        contact_telegram: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [catsData, regionsData] = await Promise.all([
                    getCategories(),
                    getRegions(),
                ]);
                setCategories(catsData);
                setRegions(regionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

    useEffect(() => {
        if (form.category_id) {
            const selectedCategory = categories.find(c => c.id === form.category_id);
            const nestedSubCats = selectedCategory?.sub_categories || [];
            setSubCategories(nestedSubCats);

            // Filter out selected subcategories that are no longer available in the new category
            setForm(prev => ({
                ...prev,
                sub_category_ids: prev.sub_category_ids.filter(id =>
                    nestedSubCats.find(sc => sc.id === id)
                ),
            }));
        } else {
            setSubCategories([]);
            setForm(prev => ({ ...prev, sub_category_ids: [] }));
        }
    }, [form.category_id, categories]);

    useEffect(() => {
        const fetchDistrictsData = async () => {
            if (form.city_id) {
                const city = regions.find(r => r.id === form.city_id);
                if (city) {
                    try {
                        const data = await getDistricts(city.slug);
                        setDistricts(data);
                    } catch (error) {
                        console.error('Error fetching districts:', error);
                        setDistricts([]);
                    }
                }
            } else {
                setDistricts([]);
            }
        };
        fetchDistrictsData();
    }, [form.city_id, regions]);

    const handleSubmit = async () => {
        if (!form.title || !form.category_id || !form.city_id || !form.district_id || !form.date || !form.time || !form.contact_name || !form.contact_phone) {
            notifications.show({
                title: 'Ogohlantirish',
                message: "Iltimos, barcha majburiy maydonlarni to'ldiring",
                color: 'yellow',
            });
            return;
        }

        setLoading(true);
        try {
            const payload: OrderCreatePayload = {
                title: form.title,
                description: form.description || form.title,
                category_id: form.category_id,
                sub_category_ids: form.sub_category_ids.length > 0 ? form.sub_category_ids : undefined,
                city_id: form.city_id,
                district_id: form.district_id,
                date: dayjs(form.date).format('YYYY-MM-DD'),
                time: form.time,
                expected_price: form.expected_price || 0,
                comment: form.comment,
                contact_name: form.contact_name,
                contact_phone: form.contact_phone,
                contact_telegram: form.contact_telegram || undefined,
            };

            await createOrder(payload);
            notifications.show({
                title: 'Muvaffaqiyatli',
                message: 'Buyurtmangiz muvaffaqiyatli yuborildi!',
                color: 'green',
                icon: <TbCheck />,
            });
            navigate('/orders');
        } catch (error: any) {
            notifications.show({
                title: 'Xatolik',
                message: error.response?.data?.message || 'Buyurtma yuborishda xatolik yuz berdi',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <Container py={100}>
                <Stack align="center">
                    <Loader size="lg" />
                    <Text>Ma'lumotlar yuklanmoqda...</Text>
                </Stack>
            </Container>
        );
    }

    return (
        <Box bg={theme.colors?.gray?.[0]} py={40} style={{ minHeight: 'calc(100vh - 80px)' }}>
            <Container size="sm">
                <Stack gap="xl">
                    <Box>
                        <Title order={1} fw={800} fz={32} c={theme.colors?.gray?.[9]}>
                            Buyurtma qoldirish
                        </Title>
                        <Text c="dimmed" fz="lg" mt={8}>
                            Ehtiyojingizni yozing va biz sizga eng yaxshi mutaxassislarni topishda yordam beramiz
                        </Text>
                    </Box>

                    <Paper p={32} radius={24} shadow="sm">
                        <Stack gap={24}>
                            <Box>
                                <Text fw={700} fz={18} mb={16} c={theme.colors?.blue?.[6]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <TbClipboardText size={20} />
                                    Asosiy ma'lumotlar
                                </Text>
                                <Stack gap="md">
                                    <TextInput
                                        label="Buyurtma sarlavhasi"
                                        placeholder="Masalan: Elektrik chaqirish kerak"
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                    <Textarea
                                        label="Tavsif (ixtiyoriy)"
                                        placeholder="Buyurtma haqida batafsil ma'lumot bering"
                                        minRows={3}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                    <Select
                                        label="Kategoriya"
                                        placeholder="Kategoriyani tanlang"
                                        required
                                        data={categories.map(c => ({ value: String(c.id), label: c.name }))}
                                        value={form.category_id ? String(form.category_id) : null}
                                        onChange={(val) => setForm({ ...form, category_id: val ? Number(val) : null })}
                                    />
                                    {subCategories.length > 0 && (
                                        <MultiSelect
                                            label="Kichik kategoriyalar (ixtiyoriy)"
                                            placeholder="Kichik kategoriyalarni tanlang"
                                            data={subCategories.map(sub => ({
                                                value: String(sub.id),
                                                label: sub.name,
                                            }))}
                                            value={form.sub_category_ids.map(String)}
                                            onChange={values =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    sub_category_ids: values.map(Number),
                                                }))
                                            }
                                            searchable
                                            clearable
                                        />
                                    )}
                                </Stack>
                            </Box>

                            <Box>
                                <Text fw={700} fz={18} mb={16} c={theme.colors?.blue?.[6]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <TbCalendar size={20} />
                                    Vaqt va Joylashuv
                                </Text>
                                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                                    <DateInput
                                        label="Sana"
                                        placeholder="Sanani tanlang"
                                        required
                                        style={{ flex: 1 }}
                                        value={form.date}
                                        //@ts-expect-error
                                        onChange={(val) => setForm({ ...form, date: (val as Date) })}
                                        minDate={new Date()}
                                    />
                                    <TimeInput
                                        label="Vaqt"
                                        placeholder="Masalan: 10:45"
                                        required
                                        style={{ flex: 1 }}
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        leftSection={<TbClock size={16} />}
                                    />
                                </Flex>
                                <Flex gap="md" mt="md" direction={{ base: 'column', sm: 'row' }}>
                                    <Select
                                        label="Shahar"
                                        placeholder="Shaharni tanlang"
                                        required
                                        style={{ flex: 1 }}
                                        data={regions.map(r => ({ value: String(r.id), label: r.name }))}
                                        value={form.city_id ? String(form.city_id) : null}
                                        onChange={(val) => setForm({ ...form, city_id: val ? Number(val) : null, district_id: null })}
                                    />
                                    <Select
                                        label="Tuman"
                                        placeholder="Tumanni tanlang"
                                        required
                                        style={{ flex: 1 }}
                                        data={districts.map(d => ({ value: String(d.id), label: d.name }))}
                                        value={form.district_id ? String(form.district_id) : null}
                                        onChange={(val) => setForm({ ...form, district_id: val ? Number(val) : null })}
                                        disabled={!form.city_id}
                                    />
                                </Flex>
                            </Box>

                            <Box>
                                <Text fw={700} fz={18} mb={16} c={theme.colors?.blue?.[6]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text fw={700} fz={18} component="span">💰</Text>
                                    Narx va Qo'shimcha
                                </Text>
                                <NumberInput
                                    label="Kutilayotgan narx (so'm)"
                                    placeholder="Masalan: 200000"
                                    thousandSeparator=" "
                                    value={form.expected_price}
                                    onChange={(val) => setForm({ ...form, expected_price: typeof val === 'number' ? val : undefined })}
                                />
                                <Textarea
                                    label="Izoh (ixtiyoriy)"
                                    placeholder="Qo'shimcha izohlar yoki talablar"
                                    mt="md"
                                    minRows={3}
                                    value={form.comment}
                                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                />
                            </Box>

                            <Box>
                                <Text fw={700} fz={18} mb={16} c={theme.colors?.blue?.[6]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <TbUser size={20} />
                                    Kontakt ma'lumotlari
                                </Text>
                                <Stack gap="md">
                                    <TextInput
                                        label="Ismingiz"
                                        placeholder="Ismingizni kiriting"
                                        required
                                        leftSection={<TbUser size={16} />}
                                        value={form.contact_name}
                                        onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                                    />
                                    <TextInput
                                        label="Telefon raqami"
                                        placeholder="+998 90 123 45 67"
                                        required
                                        leftSection={<TbPhone size={16} />}
                                        value={form.contact_phone}
                                        onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                                    />
                                    <TextInput
                                        label="Telegram foydalanuvchi nomi (ixtiyoriy)"
                                        placeholder="@username"
                                        value={form.contact_telegram}
                                        onChange={(e) => setForm({ ...form, contact_telegram: e.target.value })}
                                    />
                                </Stack>
                            </Box>

                            <Button
                                fullWidth
                                size="lg"
                                radius="xl"
                                mt="xl"
                                loading={loading}
                                onClick={handleSubmit}
                                styles={{
                                    root: {
                                        height: 54,
                                        fontSize: 18,
                                        background: `linear-gradient(135deg, ${theme.colors?.blue?.[6]} 0%, ${theme.colors?.blue?.[8]} 100%)`,
                                        boxShadow: '0 8px 24px rgba(34, 139, 230, 0.3)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 28px rgba(34, 139, 230, 0.4)',
                                        }
                                    }
                                }}
                            >
                                Buyurtmani yuborish
                            </Button>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
}

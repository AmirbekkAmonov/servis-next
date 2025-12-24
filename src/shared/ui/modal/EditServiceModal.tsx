import { Modal, Stack, TextInput, Textarea, NumberInput, Button, Group, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import theme from '@/shared/theme';
import { TbCheck, TbX, TbAlertCircle } from 'react-icons/tb';
import { updateService } from '@/shared/api/services/service';
import type { UserService } from '@/shared/api/services/profile/profile.types';
import type { CreateServicePayload } from '@/shared/api/services/service/service.types';
import { openNotification } from '@/shared/lib/notification';
import { WorkTimeSelector } from '../WorkTimeSelector';

interface EditServiceModalProps {
    opened: boolean;
    onClose: () => void;
    service: UserService | null;
    onSuccess: () => void;
}

function EditServiceModal({
    opened,
    onClose,
    service,
    onSuccess,
}: EditServiceModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        working_hours: '',
        price_from: 0,
        price_to: 0,
    });

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name,
                description: service.description,
                phone: service.phone,
                email: service.email || '',
                website: service.website || '',
                address: service.address,
                working_hours: service.working_hours || '',
                price_from: service.price_from,
                price_to: service.price_to,
            });
        }
    }, [service]);

    const handleSubmit = async () => {
        if (!service) return;

        // Validation
        if (!formData.name.trim() || formData.name.trim().length < 2) {
            openNotification({
                title: "Nom kamida 2 ta belgidan iborat bo'lishi kerak",
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        if (!formData.description.trim() || formData.description.trim().length < 10) {
            openNotification({
                title: "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak",
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        if (formData.price_from <= 0) {
            openNotification({
                title: 'Narx musbat bo\'lishi kerak',
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        if (formData.price_to < formData.price_from) {
            openNotification({
                title: 'Maksimal narx minimal narxdan kichik bo\'lmasligi kerak',
                icon: <TbAlertCircle size={24} />,
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: CreateServicePayload = {
                name: formData.name.trim(),
                category_id: service.category.id,
                district_id: service.district.id,
                city_id: service.city.id,
                type: service.category.type,
                description: formData.description.trim(),
                phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone.replace(/\D/g, '')}`,
                email: formData.email || undefined,
                website: formData.website || undefined,
                working_hours: formData.working_hours || undefined,
                address: formData.address.trim(),
                price_from: formData.price_from,
                price_to: formData.price_to,
                socials: service.socials || undefined,
                image_ids: service.images.map(img => img.id),
                feature_ids: service.features.map(f => f.id),
            };

            await updateService(service.id, payload);

            openNotification({
                title: 'Xizmat muvaffaqiyatli yangilandi!',
                icon: <TbCheck size={20} />,
                type: 'success',
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating service:', error);
            openNotification({
                title: error.response?.data?.message || 'Xizmatni yangilashda xatolik yuz berdi',
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
            title="Xizmatni tahrirlash"
            centered
            size="lg"
            radius="lg"
            styles={{
                title: {
                    fontWeight: 700,
                    fontSize: 20,
                    color: theme.colors?.gray?.[9],
                },
            }}
        >
            <Stack gap="md">
                <TextInput
                    label="Xizmat nomi"
                    placeholder="Masalan: Royal Wedding Hall"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <Textarea
                    label="Tavsif"
                    placeholder="Xizmat haqida batafsil ma'lumot"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                    minRows={4}
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <Group grow>
                    <NumberInput
                        label="Boshlang'ich narx"
                        placeholder="0"
                        value={formData.price_from}
                        onChange={value => setFormData({ ...formData, price_from: Number(value) || 0 })}
                        required
                        min={0}
                        thousandSeparator=" "
                        suffix=" so'm"
                        styles={{
                            label: { fontWeight: 500, marginBottom: 8 },
                        }}
                    />

                    <NumberInput
                        label="Maksimal narx"
                        placeholder="0"
                        value={formData.price_to}
                        onChange={value => setFormData({ ...formData, price_to: Number(value) || 0 })}
                        required
                        min={0}
                        thousandSeparator=" "
                        suffix=" so'm"
                        styles={{
                            label: { fontWeight: 500, marginBottom: 8 },
                        }}
                    />
                </Group>

                <TextInput
                    label="Telefon"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <TextInput
                    label="Email (ixtiyoriy)"
                    placeholder="info@example.com"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <TextInput
                    label="Website (ixtiyoriy)"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <WorkTimeSelector
                    label="Ish vaqti (ixtiyoriy)"
                    value={formData.working_hours}
                    onChange={value => setFormData({ ...formData, working_hours: value })}
                />

                <TextInput
                    label="Manzil"
                    placeholder="Toshkent, Chilonzor tumani"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    required
                    styles={{
                        label: { fontWeight: 500, marginBottom: 8 },
                    }}
                />

                <Group gap="sm" mt="md">
                    <Button
                        variant="light"
                        color="gray"
                        size="md"
                        fullWidth
                        leftSection={<TbX size={18} />}
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        variant="filled"
                        color="blue"
                        size="md"
                        fullWidth
                        leftSection={isSubmitting ? <Loader size="xs" color="white" /> : <TbCheck size={18} />}
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        styles={{
                            root: {
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 16px ${theme.colors?.blue?.[3]}`,
                                },
                            },
                        }}
                    >
                        {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default EditServiceModal;

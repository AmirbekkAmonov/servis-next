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
  Group,
  Paper,
  Flex,
  Badge,
  Stepper,
  Title,
  FileButton,
  Image,
  ActionIcon,
  Loader,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from '@/shared/lib/router';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import {
  TbPlus,
  TbCircleCheck,
  TbX,
  TbArrowRight,
  TbArrowLeft,
} from 'react-icons/tb';
import { createService } from '@/shared/api/services/service/service.api';
import type { CreateServicePayload } from '@/shared/api/services/service/service.types';
import {
  getCategories,
  getRegions,
  getDistricts,
  getFeatures,
  uploadImage,
  type CategoryItem,
  type Region,
  type District,
  type Feature,
} from './addService.api';
import type { ISubCategory } from '@/shared/api/services/home/home.types';
import { notifications } from '@mantine/notifications';
import { AddServiceSkeleton } from './ui/addServiceSkeleton';
import { WorkTimeSelector } from '@/shared/ui/WorkTimeSelector';

export type AddServiceProps = {
  embedded?: boolean;
};

// Format functions
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  let digits = value.replace(/\D/g, '');

  // If it starts with 998, keep it, otherwise assume user entered 9-digit number and prepend 998
  if (digits.length > 0 && !digits.startsWith('998') && digits.length <= 9) {
    digits = '998' + digits;
  }

  // Format: +998 XX XXX XX XX
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `+${digits}`;
  if (digits.length <= 5) return `+998 ${digits.slice(3)}`;
  if (digits.length <= 8)
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5)}`;
  if (digits.length <= 10)
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(
      8
    )}`;
  return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(
    8,
    10
  )} ${digits.slice(10, 12)}`;
};

const parsePhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/\D/g, '');
};

interface FormData {
  category_id: number | null;
  sub_category_ids: number[];
  district_id: number | null;
  city_id: number | null;
  name: string;
  type: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  working_hours: string;
  address: string;
  socials: {
    instagram: string;
    telegram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  price_from: number;
  price_to: number;
  capacity: number;
  latitude: number | null;
  longitude: number | null;
  image_ids: number[];
  feature_ids: number[];
  new_features: string[];
}

function AddService({ embedded = false }: AddServiceProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newFeatureValue, setNewFeatureValue] = useState('');

  // Data states
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Image upload states
  interface ImagePreview {
    file: File;
    preview: string;
    id?: number;
    uploading?: boolean;
  }
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [form, setForm] = useState<FormData>({
    category_id: null,
    sub_category_ids: [],
    district_id: null,
    city_id: null,
    name: '',
    type: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    working_hours: '',
    address: '',
    socials: {
      instagram: '',
      telegram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
    price_from: 0,
    price_to: 0,
    capacity: 0,
    latitude: null,
    longitude: null,
    image_ids: [],
    feature_ids: [],
    new_features: [],
  });

  const isCapacityEnabled =
    form.type === 'wedding_hall' || form.type === 'restaurant';

  useEffect(() => {
    if (!isCapacityEnabled && form.capacity !== 0) {
      setForm((prev) => ({ ...prev, capacity: 0 }));
    }
  }, [isCapacityEnabled, form.capacity]);

  const yandexApiKey = process.env.NEXT_PUBLIC_YANDEX_API_KEY as
    | string
    | undefined;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [catsData, regionsData, featuresData] = await Promise.all([
          getCategories(),
          getRegions(),
          getFeatures(),
        ]);
        setCategories(catsData);
        setRegions(regionsData);
        setFeatures(featuresData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Handle subcategories when category changes
  useEffect(() => {
    if (form.category_id) {
      const selectedCategory = categories.find(
        (c) => c.id === form.category_id
      );
      const nestedSubCats = selectedCategory?.sub_categories || [];

      setSubCategories(nestedSubCats as any);

      // Filter out selected subcategories that are no longer available in the new category
      setForm((prev) => ({
        ...prev,
        sub_category_ids: prev.sub_category_ids.filter((id) =>
          nestedSubCats.find((sc) => sc.id === id)
        ),
      }));
    } else {
      setSubCategories([]);
      setForm((prev) => ({ ...prev, sub_category_ids: [] }));
    }
  }, [form.category_id, categories]);

  // Fetch districts when city changes
  useEffect(() => {
    const fetchDistrictsData = async () => {
      if (form.city_id) {
        const city = regions.find((r) => r.id === form.city_id);
        if (city) {
          try {
            const data = await getDistricts(city.slug);
            setDistricts(data);
            // Reset district_id if current one is not in new list
            if (
              form.district_id &&
              !data.find((d) => d.id === form.district_id)
            ) {
              setForm((prev) => ({ ...prev, district_id: null }));
            }
          } catch (error) {
            console.error('Error fetching districts:', error);
            setDistricts([]);
          }
        }
      } else {
        setDistricts([]);
        setForm((prev) => ({ ...prev, district_id: null }));
      }
    };
    fetchDistrictsData();
  }, [form.city_id, regions]);

  // Early return after all hooks
  if (loadingData) {
    return <AddServiceSkeleton />;
  }

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Faqat oldingi step-lar validatsiya qilingan bo'lsa o'tishga ruxsat berish
    if (step <= activeStep) {
      // Orqaga o'tishga ruxsat berish
      setActiveStep(step);
    } else {
      // Oldinga o'tish uchun validation tekshirish
      let canProceed = true;
      for (let i = 0; i < step; i++) {
        if (!validateStep(i)) {
          canProceed = false;
          break;
        }
      }
      if (canProceed) {
        setActiveStep(step);
      } else {
        notifications.show({
          title: 'Ogohlantirish',
          message: "Iltimos, avval oldingi bosqichlarni to'liq to'ldiring",
          color: 'yellow',
        });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(form.category_id && form.city_id && form.district_id);
      case 1:
        return !!(
          form.name &&
          form.name.trim().length >= 2 &&
          form.description &&
          form.description.trim().length >= 10 &&
          form.phone &&
          form.address &&
          form.address.trim().length > 0
        );
      case 2:
        return !!(form.price_from > 0 && form.price_to >= form.price_from);
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: File | File[] | null) => {
    if (!files) return;

    const fileArray = Array.isArray(files) ? files : [files];

    // Check total count
    if (imagePreviews.length + fileArray.length > 4) {
      notifications.show({
        title: 'Ogohlantirish',
        message: 'Maksimal 4 ta rasm yuklash mumkin',
        color: 'yellow',
      });
      return;
    }

    // Validate and create previews
    const newImages: ImagePreview[] = await Promise.all(
      fileArray.map(
        (file): Promise<ImagePreview> =>
          new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
              notifications.show({
                title: 'Xatolik',
                message: 'Faqat rasm fayllarini yuklash mumkin',
                color: 'red',
              });
              reject(new Error('Invalid file type'));
              return;
            }

            if (file.size > 5 * 1024 * 1024) {
              notifications.show({
                title: 'Xatolik',
                message: "Rasm hajmi 5MB dan kichik bo'lishi kerak",
                color: 'red',
              });
              reject(new Error('File too large'));
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                file,
                preview: reader.result as string,
                uploading: true,
              });
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          })
      )
    );

    // Filter out failed images
    const validImages = newImages.filter((img) => img !== null);

    // Add to previews
    setImagePreviews((prev) => [...prev, ...validImages]);

    // Upload images
    if (validImages.length === 0) return;

    setUploadingImages(true);
    const uploadedIds: number[] = [];

    for (let i = 0; i < validImages.length; i++) {
      try {
        const response = await uploadImage(validImages[i].file);
        uploadedIds.push(response.message.image.id);

        // Update preview with uploaded id
        setImagePreviews((prev) => {
          const updated = [...prev];
          const index = prev.length - validImages.length + i;
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              id: response.message.image.id,
              uploading: false,
            };
          }
          return updated;
        });

        notifications.show({
          title: 'Muvaffaqiyatli',
          message: 'Rasm muvaffaqiyatli yuklandi',
          color: 'green',
        });
      } catch (error: any) {
        console.error('Error uploading image:', error);
        notifications.show({
          title: 'Xatolik',
          message: `Rasm yuklashda xatolik: ${
            error.response?.data?.message || "Noma'lum xatolik"
          }`,
          color: 'red',
        });

        // Remove failed image from previews
        setImagePreviews((prev) => {
          const updated = [...prev];
          const index = prev.length - validImages.length + i;
          if (updated[index]) {
            updated.splice(index, 1);
          }
          return updated;
        });
      }
    }

    // Update form with uploaded image IDs
    setForm((prev) => ({
      ...prev,
      image_ids: [...prev.image_ids, ...uploadedIds],
    }));

    setUploadingImages(false);
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed.id) {
        setForm((prevForm) => ({
          ...prevForm,
          image_ids: prevForm.image_ids.filter((id) => id !== removed.id),
        }));
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      notifications.show({
        title: 'Xatolik',
        message: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        color: 'red',
      });
      return;
    }

    // Upload any remaining images that haven't been uploaded yet
    const imagesToUpload = imagePreviews.filter(
      (img) => !img.id && !img.uploading
    );
    if (imagesToUpload.length > 0) {
      setUploadingImages(true);
      const uploadedIds: number[] = [];

      for (let i = 0; i < imagesToUpload.length; i++) {
        try {
          const response = await uploadImage(imagesToUpload[i].file);
          uploadedIds.push(response.message.image.id);

          setImagePreviews((prev) => {
            const index = prev.findIndex((p) => p === imagesToUpload[i]);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                id: response.message.image.id,
                uploading: false,
              };
              return updated;
            }
            return prev;
          });
        } catch (error: any) {
          console.error('Error uploading image:', error);
          notifications.show({
            title: 'Xatolik',
            message: `Rasm yuklashda xatolik: ${
              error.response?.data?.message || "Noma'lum xatolik"
            }`,
            color: 'red',
          });
        }
      }

      setForm((prev) => ({
        ...prev,
        image_ids: [...prev.image_ids, ...uploadedIds],
      }));

      setUploadingImages(false);
    }

    setLoading(true);
    setSuccess(false);

    try {
      const payload: CreateServicePayload = {
        category_id: form.category_id!,
        sub_category_ids:
          form.sub_category_ids.length > 0 ? form.sub_category_ids : undefined,
        district_id: form.district_id!,
        city_id: form.city_id!,
        name: form.name,
        type: form.type || undefined,
        description: form.description,
        phone: `+${parsePhoneNumber(form.phone)}`,
        email: form.email || undefined,
        website: form.website || undefined,
        working_hours: form.working_hours || undefined,
        address: form.address,
        socials: Object.values(form.socials).some((v) => v)
          ? {
              instagram: form.socials.instagram || undefined,
              telegram: form.socials.telegram || undefined,
              facebook: form.socials.facebook || undefined,
              youtube: form.socials.youtube || undefined,
              tiktok: form.socials.tiktok || undefined,
            }
          : undefined,
        price_from: form.price_from,
        price_to: form.price_to,
        capacity: form.capacity || undefined,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        image_ids: form.image_ids.length > 0 ? form.image_ids : undefined,
        feature_ids: form.feature_ids.length > 0 ? form.feature_ids : undefined,
        new_features:
          form.new_features.length > 0 ? form.new_features : undefined,
      };

      await createService(payload);
      setSuccess(true);

      // Show success notification
      notifications.show({
        title: 'Muvaffaqiyatli',
        message: "Xizmat muvaffaqiyatli qo'shildi",
        color: 'green',
        icon: <TbCircleCheck size={20} />,
      });

      // Clear all form data
      setForm({
        category_id: null,
        sub_category_ids: [],
        district_id: null,
        city_id: null,
        name: '',
        type: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        working_hours: '',
        address: '',
        socials: {
          instagram: '',
          telegram: '',
          facebook: '',
          youtube: '',
          tiktok: '',
        },
        price_from: 0,
        price_to: 0,
        capacity: 0,
        latitude: null,
        longitude: null,
        image_ids: [],
        feature_ids: [],
        new_features: [],
      });

      // Clear image previews
      setImagePreviews([]);

      // Clear new feature input
      setNewFeatureValue('');

      // Reset to first step
      setActiveStep(0);
    } catch (error: any) {
      console.error('Error creating service:', error);
      notifications.show({
        title: 'Xatolik',
        message:
          error.response?.data?.message ||
          "Xizmat qo'shishda xatolik yuz berdi",
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 0: Category and Location
  const renderStep0 = () => (
    <Stack gap="lg">
      {/* Image Upload Section */}
      <Box>
        <Text fw={500} fz="sm" mb="xs" c={theme.colors?.gray?.[7]}>
          Rasmlar (maksimal 4 ta)
        </Text>
        <Text fz={12} c={theme.colors?.gray?.[6]} mb="sm">
          {imagePreviews.length}/4
        </Text>
        <Flex
          gap="md"
          wrap="wrap"
          style={{
            minHeight: 120,
            alignItems: 'flex-start',
          }}
        >
          {imagePreviews.map((img, index) => (
            <Box
              key={index}
              style={{
                position: 'relative',
                width: 120,
                height: 120,
                minHeight: 120,
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${theme.colors?.gray?.[3]}`,
                backgroundColor: theme.other?.mainWhite,
                flexShrink: 0,
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
            >
              <Image
                src={img.preview}
                alt={`Preview ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {img.uploading && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Loader size="sm" color="white" />
                </Box>
              )}
              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                }}
                onClick={() => handleRemoveImage(index)}
                disabled={img.uploading}
              >
                <TbX size={16} />
              </ActionIcon>
            </Box>
          ))}
          {imagePreviews.length < 4 && (
            <FileButton
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              disabled={uploadingImages}
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  color="blue"
                  style={{
                    width: 120,
                    height: 120,
                    minHeight: 120,
                    borderRadius: 12,
                    border: `2px dashed ${theme.colors?.blue?.[4]}`,
                    backgroundColor: theme.colors?.blue?.[0],
                    flexShrink: 0,
                  }}
                >
                  <Stack gap={4} align="center">
                    <TbPlus size={24} />
                    <Text fz={12} c={theme.colors?.gray?.[70]}>
                      Rasm qo'shish
                    </Text>
                  </Stack>
                </Button>
              )}
            </FileButton>
          )}
        </Flex>
        {uploadingImages && (
          <Text fz={12} c={theme.colors?.blue?.[6]} mt="xs">
            Rasmlar yuklanmoqda...
          </Text>
        )}
      </Box>

      <Select
        label="Kategoriya"
        placeholder="Kategoriyani tanlang"
        data={categories.map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        }))}
        value={form.category_id ? String(form.category_id) : null}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            category_id: value ? Number(value) : null,
          }))
        }
        required
        searchable
      />

      {subCategories.length > 0 && (
        <MultiSelect
          label="Kichik kategoriyalar (ixtiyoriy)"
          placeholder="Kichik kategoriyalarni tanlang"
          data={subCategories.map((sub) => ({
            value: String(sub.id),
            label: sub.name,
          }))}
          value={form.sub_category_ids.map(String)}
          onChange={(values) =>
            setForm((prev) => ({
              ...prev,
              sub_category_ids: values.map(Number),
            }))
          }
          searchable
          clearable
        />
      )}

      <Select
        label="Shahar"
        placeholder="Shaharni tanlang"
        data={regions.map((region) => ({
          value: String(region.id),
          label: region.name,
        }))}
        value={form.city_id ? String(form.city_id) : null}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            city_id: value ? Number(value) : null,
          }))
        }
        required
        searchable
      />

      {districts.length > 0 && (
        <Select
          label="Tuman"
          placeholder="Tumanni tanlang"
          data={districts.map((district) => ({
            value: String(district.id),
            label: district.name,
          }))}
          value={form.district_id ? String(form.district_id) : null}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              district_id: value ? Number(value) : null,
            }))
          }
          required
          searchable
        />
      )}
    </Stack>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <Stack gap="lg">
      <TextInput
        label="Xizmat nomi"
        placeholder="Masalan: Royal Wedding Hall"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        minLength={2}
        error={
          form.name && form.name.trim().length < 2
            ? "Nom kamida 2 ta belgidan iborat bo'lishi kerak"
            : undefined
        }
      />

      {/* <Select
        label="Xizmat turi (ixtiyoriy)"
        placeholder="Xizmat turini tanlang"
        data={[
          { value: 'wedding_hall', label: "To'yxona" },
          { value: 'cafe', label: 'Kafe' },
          { value: 'restaurant', label: 'Restoran' },
          { value: 'service', label: 'Xizmat' },
        ]}
        value={form.type || null}
        onChange={value => setForm({ ...form, type: value || '' })}
        searchable
      /> */}

      <Textarea
        label="Tavsif"
        placeholder="Xizmat haqida batafsil ma'lumot (kamida 10 ta belgi)"
        minRows={4}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        minLength={10}
        error={
          form.description && form.description.trim().length < 10
            ? "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak"
            : undefined
        }
      />

      <TextInput
        label="Telefon raqami"
        placeholder="+998 90 123 45 67"
        value={form.phone}
        onChange={(e) => {
          const formatted = formatPhoneNumber(e.target.value);
          setForm({ ...form, phone: formatted });
        }}
        onBlur={(e) => {
          // Ensure it starts with +998
          const parsed = parsePhoneNumber(e.target.value);
          if (parsed && !parsed.startsWith('998')) {
            const corrected = `998${parsed.replace(/^998/, '')}`;
            setForm({ ...form, phone: formatPhoneNumber(corrected) });
          }
        }}
        required
        maxLength={17}
      />

      <TextInput
        label="Email (ixtiyoriy)"
        placeholder="info@example.uz"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={
          form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            ? "Email formati noto'g'ri"
            : undefined
        }
      />

      <TextInput
        label="Veb-sayt (ixtiyoriy)"
        placeholder="https://example.uz"
        type="url"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        error={
          form.website &&
          !/^https?:\/\/.+\..+/.test(form.website) &&
          form.website.trim() !== ''
            ? "URL formati noto'g'ri. https:// bilan boshlanishi kerak"
            : undefined
        }
      />

      <WorkTimeSelector
        label="Ish vaqti (ixtiyoriy)"
        value={form.working_hours}
        onChange={(value) => setForm({ ...form, working_hours: value })}
      />

      <Textarea
        label="Manzil"
        placeholder="To'liq manzil"
        minRows={2}
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
      />
    </Stack>
  );

  // Step 2: Pricing and Capacity
  const renderStep2 = () => (
    <Stack gap="lg">
      <Group grow gap="md">
        <NumberInput
          label="Narx (dan)"
          placeholder="1 000 000"
          value={form.price_from}
          onChange={(val) => setForm({ ...form, price_from: Number(val) || 0 })}
          min={0}
          thousandSeparator=" "
          required
          hideControls
        />
        <NumberInput
          label="Narx (gacha)"
          placeholder="25 000 000"
          value={form.price_to}
          onChange={(val) => setForm({ ...form, price_to: Number(val) || 0 })}
          min={form.price_from || 0}
          thousandSeparator=" "
          required
          hideControls
        />
      </Group>

      {isCapacityEnabled && (
        <NumberInput
          label="Sig'im (ixtiyoriy)"
          placeholder="500"
          value={form.capacity}
          onChange={(val) => setForm({ ...form, capacity: Number(val) || 0 })}
          min={0}
          thousandSeparator=" "
          hideControls
        />
      )}

      <Box>
        <Text fw={500} fz="sm" mb="xs" c={theme.colors?.gray?.[7]}>
          Joylashuv (kartadan tanlang)
        </Text>
        <Box
          style={{
            height: 320,
            borderRadius: 12,
            overflow: 'hidden',
            border: `1px solid ${theme.colors?.gray?.[3]}`,
          }}
        >
          <YMaps
            //@ts-expect-error
            query={
              yandexApiKey
                ? { apikey: yandexApiKey, lang: 'uz_UZ' }
                : { lang: 'uz_UZ' }
            }
          >
            <Map
              width="100%"
              height="320px"
              defaultState={{
                center:
                  form.latitude && form.longitude
                    ? [form.latitude, form.longitude]
                    : [41.3111, 69.2797],
                zoom: form.latitude && form.longitude ? 14 : 11,
              }}
              onClick={(e: any) => {
                const coords = e.get('coords');
                setForm((prev) => ({
                  ...prev,
                  latitude: Number(coords?.[0]),
                  longitude: Number(coords?.[1]),
                }));
              }}
            >
              {form.latitude && form.longitude && (
                <Placemark
                  geometry={[form.latitude, form.longitude]}
                  options={{ draggable: true }}
                  onDragEnd={(e: any) => {
                    const coords = e.get('target').geometry.getCoordinates();
                    setForm((prev) => ({
                      ...prev,
                      latitude: Number(coords?.[0]),
                      longitude: Number(coords?.[1]),
                    }));
                  }}
                />
              )}
            </Map>
          </YMaps>
        </Box>

        <Group grow gap="md" mt="md">
          <NumberInput
            label="Latitude (ixtiyoriy)"
            placeholder="41.3111"
            value={form.latitude || undefined}
            onChange={(val) =>
              setForm({ ...form, latitude: val ? Number(val) : null })
            }
            decimalScale={6}
            step={0.000001}
            hideControls
          />
          <NumberInput
            label="Longitude (ixtiyoriy)"
            placeholder="69.2797"
            value={form.longitude || undefined}
            onChange={(val) =>
              setForm({ ...form, longitude: val ? Number(val) : null })
            }
            decimalScale={6}
            step={0.000001}
            hideControls
          />
        </Group>
      </Box>
    </Stack>
  );

  // Step 3: Social Media and Features
  const renderStep3 = () => (
    <Stack gap="lg">
      <Text fw={600} size="sm" c={theme.colors?.gray?.[7]}>
        Ijtimoiy tarmoqlar (ixtiyoriy)
      </Text>
      <TextInput
        label="Instagram"
        placeholder="username yoki URL"
        value={form.socials.instagram}
        onChange={(e) =>
          setForm({
            ...form,
            socials: { ...form.socials, instagram: e.target.value },
          })
        }
      />
      <TextInput
        label="Telegram"
        placeholder="username yoki URL"
        value={form.socials.telegram}
        onChange={(e) =>
          setForm({
            ...form,
            socials: { ...form.socials, telegram: e.target.value },
          })
        }
      />
      <TextInput
        label="Facebook"
        placeholder="URL"
        value={form.socials.facebook}
        onChange={(e) =>
          setForm({
            ...form,
            socials: { ...form.socials, facebook: e.target.value },
          })
        }
      />
      <TextInput
        label="YouTube"
        placeholder="URL"
        value={form.socials.youtube}
        onChange={(e) =>
          setForm({
            ...form,
            socials: { ...form.socials, youtube: e.target.value },
          })
        }
      />
      <TextInput
        label="TikTok"
        placeholder="URL"
        value={form.socials.tiktok}
        onChange={(e) =>
          setForm({
            ...form,
            socials: { ...form.socials, tiktok: e.target.value },
          })
        }
      />

      <Text fw={600} size="sm" c={theme.colors?.gray?.[7]} mt="md">
        Xizmat xususiyatlari (ixtiyoriy)
      </Text>
      <Box
        style={{
          border: `1px solid ${theme.colors?.gray?.[2]}`,
          borderRadius: 12,
          padding: 14,
          backgroundColor: theme.other?.mainWhite,
        }}
      >
        {features.length > 0 ? (
          <MultiSelect
            label="Mavjud xususiyatlar"
            placeholder="Xususiyatlarni tanlang"
            data={features.map((f) => ({ value: String(f.id), label: f.name }))}
            value={form.feature_ids.map(String)}
            onChange={(values) =>
              setForm((prev) => ({
                ...prev,
                feature_ids: values.map((v) => Number(v)),
              }))
            }
            searchable
            clearable
            withCheckIcon
            checkIconPosition="right"
            hidePickedOptions
            maxDropdownHeight={260}
            nothingFoundMessage="Topilmadi"
          />
        ) : (
          <Text fz={13} c={theme.colors?.gray?.[6]}>
            Mavjud xususiyatlar topilmadi.
          </Text>
        )}

        <Group align="flex-end" gap="sm" mt="md">
          <TextInput
            label="Yangi xususiyat qo'shish"
            placeholder="Masalan: Wi‑Fi"
            value={newFeatureValue}
            onChange={(e) => setNewFeatureValue(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              const value = newFeatureValue.trim();
              if (!value) return;

              const existing = features.find(
                (f) => f.name.toLowerCase() === value.toLowerCase()
              );

              if (existing) {
                setForm((prev) => ({
                  ...prev,
                  feature_ids: prev.feature_ids.includes(existing.id)
                    ? prev.feature_ids
                    : [...prev.feature_ids, existing.id],
                }));
                setNewFeatureValue('');
                e.preventDefault();
                return;
              }

              setForm((prev) => ({
                ...prev,
                new_features: prev.new_features.some(
                  (nf) => nf.toLowerCase() === value.toLowerCase()
                )
                  ? prev.new_features
                  : [...prev.new_features, value],
              }));
              setNewFeatureValue('');
              e.preventDefault();
            }}
          />
          <Button
            variant="light"
            color="blue"
            leftSection={<TbPlus size={16} />}
            onClick={() => {
              const value = newFeatureValue.trim();
              if (!value) return;

              const existing = features.find(
                (f) => f.name.toLowerCase() === value.toLowerCase()
              );

              if (existing) {
                setForm((prev) => ({
                  ...prev,
                  feature_ids: prev.feature_ids.includes(existing.id)
                    ? prev.feature_ids
                    : [...prev.feature_ids, existing.id],
                }));
                setNewFeatureValue('');
                return;
              }

              setForm((prev) => ({
                ...prev,
                new_features: prev.new_features.some(
                  (nf) => nf.toLowerCase() === value.toLowerCase()
                )
                  ? prev.new_features
                  : [...prev.new_features, value],
              }));
              setNewFeatureValue('');
            }}
          >
            Qo'shish
          </Button>
        </Group>

        {form.new_features.length > 0 && (
          <Flex gap="xs" wrap="wrap" mt="sm">
            {form.new_features.map((feature, idx) => (
              <Badge
                key={idx}
                variant="light"
                rightSection={
                  <TbX
                    size={14}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        new_features: prev.new_features.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                  />
                }
              >
                {feature}
              </Badge>
            ))}
          </Flex>
        )}
      </Box>
    </Stack>
  );

  const content = (
    <Stack gap="xl">
      <Group gap="lg" align="flex-start" wrap="nowrap">
        <Flex
          p="md"
          style={{
            backgroundColor: theme.colors?.blue?.[0],
            borderRadius: 16,
            border: `1px solid ${theme.colors?.blue?.[2]}`,
            flexShrink: 0,
          }}
        >
          <TbPlus size={32} color={theme.colors?.blue?.[6]} />
        </Flex>
        <Stack gap={8} style={{ flex: 1 }}>
          <Title order={1} fw={700} fz={32} c={theme.colors?.gray?.[9]}>
            Xizmat qo'shish
          </Title>
          <Text fz={15} c={theme.colors?.gray?.[6]} lh={1.6}>
            Bosqichma-bosqich kerakli maydonlarni to'ldiring va xizmatingizni
            platformaga qo'shing
          </Text>
        </Stack>
        {success && (
          <Badge
            size="lg"
            color="green"
            variant="light"
            leftSection={<TbCircleCheck size={18} />}
            style={{
              flexShrink: 0,
              padding: '12px 20px',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Muvaffaqiyatli saqlandi
          </Badge>
        )}
      </Group>

      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: theme.other?.mainWhite,
          border: `1px solid ${theme.colors?.gray?.[2]}`,
          boxShadow: `0 4px 12px ${theme.colors?.gray?.[1]}`,
        }}
      >
        <Stepper
          active={activeStep}
          onStepClick={handleStepClick}
          styles={{
            stepBody: {
              display: 'none',
            },
            step: {
              cursor: 'pointer',
            },
          }}
        >
          <Stepper.Step
            label="Kategoriya va joylashuv"
            description="Birinchi bosqich"
          >
            {renderStep0()}
          </Stepper.Step>
          <Stepper.Step
            label="Asosiy ma'lumotlar"
            description="Ikkinchi bosqich"
          >
            {renderStep1()}
          </Stepper.Step>
          <Stepper.Step label="Narx va sig'im" description="Uchinchi bosqich">
            {renderStep2()}
          </Stepper.Step>
          <Stepper.Step
            label="Ijtimoiy tarmoqlar"
            description="To'rtinchi bosqich"
          >
            {renderStep3()}
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            variant="light"
            color="gray"
            leftSection={<TbArrowLeft size={16} />}
            onClick={activeStep === 0 ? () => navigate(-1) : handlePrevious}
            disabled={loading}
          >
            {activeStep === 0 ? 'Bekor qilish' : 'Orqaga'}
          </Button>
          {activeStep < 3 ? (
            <Button
              color="blue"
              rightSection={<TbArrowRight size={16} />}
              onClick={handleNext}
              disabled={!validateStep(activeStep) || loading}
            >
              Keyingi
            </Button>
          ) : (
            <Button
              color="blue"
              loading={loading}
              leftSection={<TbPlus size={16} />}
              onClick={handleSubmit}
            >
              Saqlash
            </Button>
          )}
        </Group>
      </Paper>
    </Stack>
  );

  if (embedded) {
    return <Box>{content}</Box>;
  }

  return (
    <Box
      w="100%"
      bg={theme.colors?.gray?.[0]}
      py="xl"
      style={{ minHeight: '100vh' }}
    >
      <Container>{content}</Container>
    </Box>
  );
}

export default AddService;

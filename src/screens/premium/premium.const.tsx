import React from 'react';
import {
  LuSparkles,
  LuTrendingUp,
  LuUsers,
  LuCrown,
  LuZap,
  LuShieldCheck,
} from 'react-icons/lu';
import theme from '@/shared/theme';

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
};

export type Benefit = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export type FAQItem = {
  q: string;
  a: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: "Boshlang'ich",
    price: 19999,
    description: 'Kichik bizneslar va individual foydalanuvchilar uchun',
    features: [
      'Premium badge xizmatlarda',
      "Xizmatlarni yuqoriga ko'tarish",
      'Asosiy statistika',
      'Email yordami',
      "1 oylik a'zolik",
    ],
    icon: <LuSparkles size={32} />,
    color: theme.colors?.blue?.[6] || '#2F80ED',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 39999,
    description: "O'sib borayotgan bizneslar uchun",
    features: [
      "Boshlang'ich rejadagi barcha imkoniyatlar",
      'Kengaytirilgan statistika',
      "Xizmatlarni birinchi sahifada ko'rsatish",
      "Prioritetli qo'llab-quvvatlash",
      "3 oylik a'zolik",
      'Maxsus chegirmalar',
    ],
    popular: true,
    icon: <LuTrendingUp size={32} />,
    color: theme.colors?.yellow?.[6] || '#FDB022',
  },
  {
    id: 'business',
    name: 'Biznes',
    price: 59999,
    description: 'Katta kompaniyalar va agentliklar uchun',
    features: [
      'Professional rejadagi barcha imkoniyatlar',
      'Cheksiz xizmatlar',
      'Shaxsiy menejer',
      'API integratsiyasi',
      "6 oylik a'zolik",
      'Maxsus marketing vositalari',
      "24/7 qo'llab-quvvatlash",
    ],
    icon: <LuZap size={32} />,
    color: theme.colors?.orange?.[6] || '#F79009',
  },
];

export const benefits: Benefit[] = [
  {
    icon: <LuUsers size={32} />,
    title: "Ko'proq Ko'rinish",
    description:
      "Xizmatlaringiz birinchi sahifada ko'rsatiladi va ko'proq mijozlarga yetib boradi",
  },
  {
    icon: <LuTrendingUp size={32} />,
    title: 'Statistika',
    description:
      'Batafsil statistika va hisobotlar bilan biznesingizni kuzating va optimallashtiring',
  },
  {
    icon: <LuCrown size={32} />,
    title: 'Premium Badge',
    description:
      "Premium badge bilan xizmatlaringiz ishonchli va professional ko'rinadi",
  },
  {
    icon: <LuShieldCheck size={32} />,
    title: 'Ishonchli Xizmat',
    description:
      "Premium a'zolar uchun maxsus qo'llab-quvvatlash va xavfsizlik kafolatlari",
  },
];

export const faq: FAQItem[] = [
  {
    q: "Premium a'zolik nima?",
    a: "Premium a'zolik - bu xizmatlaringizni ko'proq mijozlarga yetkazish, statistikalarni kuzatish va biznesingizni rivojlantirish uchun maxsus imkoniyatlar to'plami.",
  },
  {
    q: '7 kunlik bepul sinov davri qanday ishlaydi?',
    a: "Siz 7 kun davomida Premium imkoniyatlarini bepul sinab ko'rishingiz mumkin. Bu davrda hech qanday to'lov talab qilinmaydi va istalgan vaqtda bekor qilishingiz mumkin.",
  },
  {
    q: "Tarifni o'zgartirish mumkinmi?",
    a: "Ha, siz istalgan vaqtda tarifingizni yuqoriga yoki pastga o'zgartirishingiz mumkin. O'zgarishlar darhol amalga oshiriladi.",
  },
  {
    q: "To'lov qanday amalga oshiriladi?",
    a: "To'lov bank kartasi, elektron hamyon yoki boshqa qulay usul orqali amalga oshiriladi. Barcha to'lovlar xavfsiz va shifrlangan.",
  },
  {
    q: "A'zolikni bekor qilish mumkinmi?",
    a: "Ha, siz istalgan vaqtda a'zolikni bekor qilishingiz mumkin. Bekor qilgandan keyin sizning a'zoligingiz joriy to'lov davri oxirigacha davom etadi.",
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
};

export const gradientBg = (): string => {
  return `linear-gradient(135deg, ${theme.colors?.blue?.[6]} 0%, ${theme.colors?.purple?.[6] || theme.colors?.blue?.[7]} 100%)`;
};

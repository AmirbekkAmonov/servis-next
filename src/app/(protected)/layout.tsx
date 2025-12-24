'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/');
    }
  }, [isAuthenticated, pathname, router, user]);

  // redirect bo‘layotganda bo‘sh ekran (xohlasangiz loader qo‘shamiz)
  if (!isAuthenticated || !user) return null;

  return children;
}

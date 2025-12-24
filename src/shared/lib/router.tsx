'use client';

import NextLink from 'next/link';
import {
  usePathname,
  useRouter,
  useParams as useNextParams,
} from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

type NavigateFn = (to: string | number, opts?: { replace?: boolean }) => void;

export function useNavigate(): NavigateFn {
  const router = useRouter();
  return (to, opts) => {
    if (typeof to === 'number') {
      // react-router: navigate(-1) kabi
      if (to === -1) {
        router.back();
        return;
      }
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
      return;
    }
    if (opts?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useParams<
  T extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >
>(): T {
  return useNextParams() as T;
}

export function useLocation() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const update = () => {
      setHash(window.location.hash || '');
      setSearch(window.location.search || '');
    };
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, [pathname]);

  return useMemo(() => {
    return {
      pathname,
      search,
      hash,
    };
  }, [hash, pathname, search]);
}

type CompatLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  to: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
};

export function Link({
  to,
  replace,
  scroll,
  prefetch,
  ...rest
}: CompatLinkProps) {
  const isExternal =
    to.startsWith('http://') ||
    to.startsWith('https://') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:');

  if (isExternal) {
    return <a href={to} {...rest} />;
  }

  // NextLink props typing: AnchorHTMLAttributes bilan to‘liq mos emas, shuning uchun cast qilamiz
  return (
    <NextLink
      href={to}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      {...(rest as any)}
    />
  );
}

## Servis (Next.js + TypeScript)

`servis-frontend` (React + Vite) loyihasidan Next.js (App Router) ga migratsiya qilingan UI.

## Ishga tushirish

Development server:

```bash
npm run dev
```

Brauzer: `http://localhost:3000`

## Muhim ENV

`.env.local` ichiga:

- `NEXT_PUBLIC_API_URL` — backend base URL (masalan: `https://api.example.com`)
- `NEXT_PUBLIC_YANDEX_API_KEY` — Yandex Maps API key (xaritaga kerak bo‘lsa)

## Routelar

- `/` (Home)
- `/premium`
- `/category` va `/category/[slug]`
- `/service/[slug]`
- Protected: `/profile`, `/orders`, `/add-service`, `/create-order`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

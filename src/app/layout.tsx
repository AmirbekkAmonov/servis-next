import type { Metadata } from 'next';
import './globals.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import AppShell from './shell';

export const metadata: Metadata = {
  title: 'Servis',
  description: 'Servis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

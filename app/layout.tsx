import './globals.css';
import { Inter } from 'next/font/google';
import { seedCategories } from '@/lib/seed-categories';

const inter = Inter({ subsets: ['latin'] });

seedCategories().catch(console.error);

export const metadata = {
  title: 'Finance Tracker',
  description: 'A simple finance tracker application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

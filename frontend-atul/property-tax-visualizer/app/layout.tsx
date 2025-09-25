// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './lib/providers'; // Import the provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blockchain Visualizer',
  description: 'Visualize your local Anvil blockchain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything with the Providers component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from "@/components/ui/toaster";

// const geistSans = GeistSans({ // Removed: GeistSans is an object, not a function
//   variable: '--font-geist-sans',
// });

// const geistMono = GeistMono({ // Removed: GeistMono is an object, not a function
//   variable: '--font-geist-mono',
// });

export const metadata: Metadata = {
  title: 'ChartVisionAI',
  description: 'AI-powered trading chart analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

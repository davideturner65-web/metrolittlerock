import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { websiteSchema, toJsonLd } from '@/lib/schema';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s | Metro Little Rock',
    default: 'Metro Little Rock — Your Guide to Living, Working & Playing in Central Arkansas',
  },
  description:
    'Neighborhood guides, local events, restaurant spotlights, and real estate resources for the Little Rock, AR metro area.',
  metadataBase: new URL('https://metrolittlerock.com'),
  openGraph: {
    siteName: 'Metro Little Rock',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(websiteSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

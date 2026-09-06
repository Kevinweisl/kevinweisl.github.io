import { Albert_Sans, Young_Serif, Noto_Sans_TC, Noto_Serif_TC, JetBrains_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Spotlight from '@/components/Spotlight';
import React from 'react';
import { siteUrl, siteName, fullName, socialLinks, jobTitle, affiliation, researchInterests } from '@/data/profile';

// Per-page identity (canonical, description, OG/Twitter cards) comes from
// pageMetadata() in src/lib/metadata.ts. Only true site-wide defaults live here.
export const metadata: Metadata = {
  title: siteName,
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
};

// Dark only: tell the browser so native scrollbars, form controls and the
// mobile chrome match the page instead of flashing light. #06090b = --bg-primary.
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#06090b',
};

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const youngSerif = Young_Serif({
  subsets: ['latin'],
  variable: '--font-young-serif',
  weight: ['400'],
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

// Metadata, rail numbers and years. The Latin subset is enough: none of those
// positions ever carries CJK, and .label is checked for it by design-system.test.ts.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: fullName,
  url: siteUrl,
  jobTitle,
  affiliation: {
    '@type': 'Organization',
    name: affiliation,
  },
  sameAs: [
    socialLinks.github,
    socialLinks.googleScholar,
    socialLinks.linkedin,
    socialLinks.twitter,
  ],
  knowsAbout: researchInterests,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${albertSans.variable} ${youngSerif.variable} ${notoSansTC.variable} ${notoSerifTC.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Spotlight />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

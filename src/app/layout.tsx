import { Albert_Sans, Young_Serif, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
// mobile chrome match the page instead of flashing light. #0a1519 = --bg-primary.
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a1519',
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
    <html lang="en" className={`${albertSans.variable} ${youngSerif.variable} ${notoSansTC.variable} ${notoSerifTC.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

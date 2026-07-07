import { Albert_Sans, Young_Serif, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import React from 'react';
import { siteUrl, siteName, fullName, socialLinks } from '@/data/profile';

const siteDescription = 'Personal website of Sheng-Lun (Kevin) Wei — CS PhD candidate at NTU, researching LLM robustness, multimodal AI, and LLM evaluation.';

export const metadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: 'Kevin Wei — CS PhD Candidate @ NTU',
    description: siteDescription,
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kevinweisl',
    creator: '@kevinweisl',
    title: 'Kevin Wei — CS PhD Candidate @ NTU',
    description: siteDescription,
    images: ['/og.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
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

const themeScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
})();
`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: fullName,
  url: siteUrl,
  jobTitle: 'CS PhD Candidate',
  affiliation: {
    '@type': 'Organization',
    name: 'National Taiwan University',
  },
  sameAs: [
    socialLinks.github,
    socialLinks.googleScholar,
    socialLinks.linkedin,
    socialLinks.twitter,
  ],
  knowsAbout: ['LLM Robustness', 'Multimodal AI', 'LLM-as-a-Judge', 'Information Retrieval', 'Natural Language Processing'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${albertSans.variable} ${youngSerif.variable} ${notoSansTC.variable} ${notoSerifTC.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

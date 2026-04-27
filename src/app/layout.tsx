import { Albert_Sans, Young_Serif, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import React from 'react';

const siteUrl = 'https://kevinweisl.github.io';

export const metadata: Metadata = {
  title: { default: 'Kevin Wei', template: '%s | Kevin Wei' },
  description: 'Personal website of Sheng-Lun (Kevin) Wei — CS PhD candidate at NTU, researching LLM robustness, multimodal AI, and LLM evaluation.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Kevin Wei',
    title: 'Kevin Wei — CS PhD Candidate @ NTU',
    description: 'Personal website of Sheng-Lun (Kevin) Wei — CS PhD candidate at NTU, researching LLM robustness, multimodal AI, and LLM evaluation.',
  },
  twitter: {
    card: 'summary',
    site: '@kevinweisl',
    creator: '@kevinweisl',
    title: 'Kevin Wei — CS PhD Candidate @ NTU',
    description: 'Personal website of Sheng-Lun (Kevin) Wei — CS PhD candidate at NTU, researching LLM robustness, multimodal AI, and LLM evaluation.',
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
  name: 'Sheng-Lun (Kevin) Wei',
  url: siteUrl,
  jobTitle: 'CS PhD Candidate',
  affiliation: {
    '@type': 'Organization',
    name: 'National Taiwan University',
  },
  sameAs: [
    'https://github.com/Kevinweisl',
    'https://scholar.google.com/citations?user=200UnXEAAAAJ',
    'https://www.linkedin.com/in/kevinwei-nlp/',
    'https://x.com/kevinweisl',
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

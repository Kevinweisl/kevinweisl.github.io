'use client';

import React, { useState } from 'react';
import { Mail, Github, Linkedin, GraduationCap, X } from 'lucide-react';
import { obfuscatedEmail, socialLinks } from '@/data/profile';

// X (Twitter) brand mark — lucide has no brand icons, inlined to avoid an icon-library dependency
const XTwitterIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ContactLinkItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isEmail?: boolean;
}

const ContactLinks: React.FC = () => {
  const [showEmail, setShowEmail] = useState(false);

  const links: ContactLinkItem[] = [
    { label: 'Email', icon: <Mail size={16} />, isEmail: true },
    { label: 'GitHub', icon: <Github size={16} />, href: socialLinks.github },
    { label: 'LinkedIn', icon: <Linkedin size={16} />, href: socialLinks.linkedin },
    ...(socialLinks.googleScholar
      ? [{ label: 'Scholar', icon: <GraduationCap size={16} />, href: socialLinks.googleScholar }]
      : []),
    ...(socialLinks.twitter
      ? [{ label: 'Twitter', icon: <XTwitterIcon size={14} />, href: socialLinks.twitter }]
      : []),
  ];

  const cardClassName =
    'group relative overflow-hidden flex items-center gap-2 text-[var(--text-body)] py-3 px-5.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] text-[13px] font-semibold transition-all duration-200 hover:text-[var(--text-on-primary)] hover:border-transparent hover:-translate-y-0.5 hover:shadow-[var(--shadow-contact-hover)] cursor-pointer';

  const cardContent = (link: ContactLinkItem) => (
    <>
      <span
        className="absolute inset-0 accent-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">
        {link.icon}
        {link.label}
      </span>
    </>
  );

  return (
    <>
      <div className="flex gap-3.5 justify-center flex-wrap">
        {links.map((link) => {
          if (link.isEmail) {
            return (
              <button
                key={link.label}
                className={cardClassName}
                onClick={() => setShowEmail(true)}
              >
                {cardContent(link)}
              </button>
            );
          }

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
            >
              {cardContent(link)}
            </a>
          );
        })}
      </div>

      {showEmail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowEmail(false)}
        >
          <div
            className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] p-8 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEmail(false)}
              className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="accent-bg p-2.5 rounded-[var(--radius)]">
                <Mail size={20} className="text-[var(--text-on-primary)]" />
              </div>
              <h3 className="font-serif text-[20px] font-semibold text-[var(--text-primary)]">Email</h3>
            </div>
            <p className="text-[var(--text-body)] text-[16px] font-mono select-all">
              {obfuscatedEmail}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactLinks;

'use client';

import React, { useState } from 'react';
import { Mail, Github, Linkedin, GraduationCap, X } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

interface ContactLinksProps {
  obfuscatedEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  googleScholarUrl?: string;
  twitterUrl?: string;
}

interface ContactLinkItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  isEmail?: boolean;
}

const ContactLinks: React.FC<ContactLinksProps> = ({
  obfuscatedEmail,
  githubUrl,
  linkedinUrl,
  googleScholarUrl,
  twitterUrl,
}) => {
  const [showEmail, setShowEmail] = useState(false);

  const links: ContactLinkItem[] = [
    { label: 'Email', icon: <Mail size={16} />, isEmail: true },
    { label: 'GitHub', icon: <Github size={16} />, href: githubUrl },
    { label: 'LinkedIn', icon: <Linkedin size={16} />, href: linkedinUrl },
    ...(googleScholarUrl
      ? [{ label: 'Scholar', icon: <GraduationCap size={16} />, href: googleScholarUrl }]
      : []),
    ...(twitterUrl
      ? [{ label: 'Twitter', icon: <FaXTwitter size={14} />, href: twitterUrl }]
      : []),
  ];

  const cardClassName =
    'group relative overflow-hidden flex items-center gap-2 text-[var(--text-body)] py-3 px-5.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] text-[13px] font-semibold transition-all duration-200 hover:text-white hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(54,120,142,0.22)] cursor-pointer';

  const cardContent = (link: ContactLinkItem) => (
    <>
      <span
        className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
              <div className="gradient-bg p-2.5 rounded-[var(--radius)]">
                <Mail size={20} className="text-white" />
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

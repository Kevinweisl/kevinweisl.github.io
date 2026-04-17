'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/publications', label: 'Publications' },
  { href: '/notes', label: 'Notes' },
  { href: '/experience', label: 'Experience' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-[var(--bg-nav)] backdrop-blur-[20px] border-b border-[var(--border)]"
      style={{ padding: '14px 0' }}
    >
      <div className="mx-auto flex items-center justify-between px-6" style={{ maxWidth: '1100px' }}>
        {/* Brand */}
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-[var(--text-primary)] no-underline"
          onClick={closeMobileMenu}
        >
          Kevin Wei
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[var(--text-nav)] no-underline transition-colors duration-200 hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="text-[var(--text-nav)] focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-nav)] backdrop-blur-[20px] border-t border-[var(--border)] px-6 py-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded px-3 py-2 text-[13px] font-medium text-[var(--text-nav)] no-underline transition-colors duration-200 hover:text-[var(--accent)]"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

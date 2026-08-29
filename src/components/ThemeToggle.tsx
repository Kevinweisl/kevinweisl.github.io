'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from '@/lib/theme';

/**
 * A static export ships ONE html file for both themes, so this button renders
 * both icons and both labels; `.dark` on <html> — set before first paint by
 * themeInitScript — picks the visible pair (see globals.css).
 *
 * Nothing here is state-dependent, so the shipped markup is correct for both
 * themes with no JS and there is nothing for React to reconcile. `display:none`
 * also drops the hidden label from the accessibility tree, so the accessible
 * name is always the accurate one. Do NOT add an aria-label: it would override
 * these labels with one fixed string.
 */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle p-2 rounded-[var(--radius)] text-[var(--text-nav)] hover:text-[var(--accent)] transition-colors duration-200 cursor-pointer"
    >
      <Moon size={18} aria-hidden="true" data-theme-only="light" />
      <Sun size={18} aria-hidden="true" data-theme-only="dark" />
      <span className="sr-only" data-theme-only="light">Switch to dark mode</span>
      <span className="sr-only" data-theme-only="dark">Switch to light mode</span>
    </button>
  );
}

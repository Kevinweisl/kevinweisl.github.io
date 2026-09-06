import React from 'react';
import { siteName } from '@/data/profile';

const Footer: React.FC = () => {
  return (
    <footer
      className="py-7 mt-auto text-[13px]"
      style={{ background: 'var(--bg-footer)', color: 'var(--text-footer)' }}
    >
      {/* It had no inner container at all, so it lined up with neither column. */}
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

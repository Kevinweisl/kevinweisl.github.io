import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="py-7 mt-auto text-center text-[13px]"
      style={{ background: 'var(--bg-footer)', color: 'var(--text-footer)' }}
    >
      <p>&copy; 2025 Kevin Wei. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

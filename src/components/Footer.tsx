import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p suppressHydrationWarning>&copy; {currentYear} Kevin Wei. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

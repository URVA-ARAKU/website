import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const NotFoundPage: React.FC = () => {
  usePageSEO({
    title: '404 Page Not Found | URVA',
    description: 'The page you are looking for does not exist or has been moved.',
    noIndex: true,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F1EA] p-4 font-sans">
      <div className="bg-[#FAF8F4] shadow-xs border border-[#E2D9CC] rounded-3xl p-8 max-w-md text-center">
        <h1 className="text-6xl font-serif font-bold text-[#5A3825] mb-3">404</h1>
        <h2 className="text-xl font-sans font-semibold mb-3 text-[#5A3825]">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-[#5A3825]/75 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] px-6 py-2.5 rounded-xl transition font-medium text-xs uppercase tracking-wider inline-block shadow-xs">
          Return to Storefront
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;


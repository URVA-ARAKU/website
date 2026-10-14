import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';

interface PopularProductsProps {
  products?: Product[];
}

const CATEGORY_TABS = [
  'All',
  'Tribal Araku',
  'Mana Godavari',
  'Eco-Friendly',
  'Swadesi Handlooms',
  'Kadiyam Plants',
];

const isNotCandle = (p: Product) => {
  const cat = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return !cat.includes('candle') && !name.includes('candle') && !cat.includes('urli');
};

const PopularProducts: React.FC<PopularProductsProps> = ({ products = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  // Use real products directly from the database
  const allAvailableProducts = useMemo(() => {
    return (products || [])
      .filter((p) => p && p.isActive !== false && isNotCandle(p))
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products]);

  // Filter by selected tab
  const filteredProducts = useMemo(() => {
    if (activeTab === 'All') return allAvailableProducts;
    const filterKeyword = activeTab.toLowerCase().split(' ')[0];
    return allAvailableProducts.filter((p) =>
      (p.category || '').toLowerCase().includes(filterKeyword)
    );
  }, [allAvailableProducts, activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-2 pb-12 sm:pt-4 sm:pb-16 bg-[#FAFAFA] border-b border-neutral-200 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-5 sm:mb-6 gap-3">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
              CUSTOMER FAVORITES • TOP RATED
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight font-sans">
              Our Best Sellers
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-normal max-w-xl">
              Loved and cherished regional harvests, heritage foods, and handcrafted essentials.
            </p>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
            <Link
              to="/products"
              className="text-xs sm:text-sm font-medium text-neutral-800 hover:text-black underline-offset-4 hover:underline transition-colors mr-2"
            >
              Explore All Products &rarr;
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label="Previous best sellers"
                className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label="Next best sellers"
                className="w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black hover:text-black'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Best Sellers Carousel / Grid */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="w-[260px] sm:w-[290px] lg:w-[320px] shrink-0 snap-start flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Cue */}
        <div className="mt-2 flex sm:hidden justify-center items-center gap-1.5 text-[11px] text-gray-400 font-light">
          <span>&larr; Swipe to view more best sellers &rarr;</span>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;

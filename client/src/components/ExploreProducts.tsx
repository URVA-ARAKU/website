import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';

interface ExploreProductsProps {
  products?: Product[];
}

const CATEGORY_TABS = [
  'All Products',
  'Tribal Araku Products',
  'Mana Godavari Foods',
  'Eco-Friendly Products',
  'Swadesi Handlooms',
  'Kadiyam Plants',
];

const isNotCandle = (p: Product) => {
  const cat = (p.category || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return !cat.includes('candle') && !name.includes('candle') && !cat.includes('urli');
};

export const ExploreProducts: React.FC<ExploreProductsProps> = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low'>('featured');

  // Use non-candle products directly from the database
  const allProducts = useMemo(() => {
    return (products || []).filter(
      (p) => p && p.isActive !== false && isNotCandle(p)
    );
  }, [products]);

  // Filter by category
  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (selectedCategory !== 'All Products') {
      const keyword = selectedCategory.toLowerCase().split(' ')[0];
      list = list.filter((p) =>
        (p.category || '').toLowerCase().includes(keyword)
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      return Number(b.featured) - Number(a.featured);
    });
  }, [allProducts, selectedCategory, sortBy]);

  return (
    <section
      aria-label="Explore All Products"
      className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-neutral-200 font-sans"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
              OUR COMPLETE CURATION • REGIONAL SPECIALTIES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight font-sans">
              Explore All Products
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-normal max-w-xl">
              Authentic regional foods, tribal coffee and honey, handlooms, plants, and sustainable essentials.
            </p>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center justify-center md:justify-end gap-2 text-xs">
            <span className="text-neutral-500 font-medium flex items-center gap-1">
              <FaFilter className="text-[10px] text-neutral-700" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800 font-medium focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="featured">Featured First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategory(tab)}
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

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <div key={product._id} className="flex flex-col h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View Full Catalog Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm px-7 py-3.5 rounded-lg shadow-xs hover:shadow-md transition-all tracking-wider uppercase group"
          >
            <span>View Full Catalog</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-2 text-[11px] text-neutral-500">
            Over 50+ regional treasures available direct from artisan cooperatives
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;

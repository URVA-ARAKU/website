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
      className="py-12 sm:py-16 bg-[#F4F1EA] border-b border-[#E2D9CC] font-sans"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5A3825] tracking-tight font-sans">
              Explore All Products
            </h2>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center justify-center md:justify-end gap-2 text-xs">
            <span className="text-[#8C7364] font-medium flex items-center gap-1">
              <FaFilter className="text-[10px] text-[#8B5A2B]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF8F4] border border-[#E2D9CC] rounded-lg px-3 py-1.5 text-xs text-[#5A3825] font-medium focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    ? 'bg-[#5A3825] text-[#F4F1EA] shadow-xs'
                    : 'bg-[#FAF8F4] text-[#5A3825] border border-[#E2D9CC] hover:border-[#8B5A2B] hover:text-[#8B5A2B]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;

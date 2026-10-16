import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FilterOptionsProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    minPrice?: number | undefined;
    setMinPrice?: (price: number) => void;
    maxPrice?: number | undefined;
    setMaxPrice?: (price: number) => void;
    sort: 'asc' | 'desc' | 'relevance';
    setSort: (sort: 'asc' | 'desc' | 'relevance') => void;
    clearFilters: () => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    sort,
    setSort,
    clearFilters,
}) => {
    const [showCategories, setShowCategories] = useState(true);

    return (
        <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] space-y-5 shadow-xs font-sans">
            {/* Sort options */}
            <div>
                <label className="block text-xs font-semibold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Sort By
                </label>
                <select
                    className="w-full px-3 py-2 text-xs font-sans font-medium text-[#5A3825] bg-[#F4F1EA] border border-[#E2D9CC] focus:outline-none focus:border-[#5A3825] rounded-xl"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'asc' | 'desc' | 'relevance')}
                >
                    <option value="relevance">Featured & Relevant</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>

            {/* Category filter */}
            <div>
                <div 
                    className="flex items-center justify-between cursor-pointer py-1" 
                    onClick={() => setShowCategories(!showCategories)}
                >
                    <h3 className="text-xs font-semibold text-[#5A3825] uppercase tracking-wider">
                        Categories
                    </h3>
                    {showCategories ? <FaChevronUp className="h-3 w-3 text-[#8B5A2B]" /> : <FaChevronDown className="h-3 w-3 text-[#8B5A2B]" />}
                </div>

                {showCategories && (
                    <ul className="mt-2 space-y-1">
                        <li
                            className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                selectedCategory === ''
                                    ? 'bg-[#8B5A2B] text-[#FAF8F4] font-semibold shadow-2xs'
                                    : 'text-[#5A3825] hover:bg-[#F4F1EA]'
                            }`}
                            onClick={() => setSelectedCategory('')}
                        >
                            All Categories
                        </li>
                        {categories.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#8B5A2B] text-[#FAF8F4] font-semibold shadow-2xs'
                                        : 'text-[#5A3825] hover:bg-[#F4F1EA]'
                                }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Clear filters button */}
            <button
                className="w-full bg-[#F4F1EA] text-[#5A3825] border border-[#E2D9CC] py-2 rounded-xl text-xs font-medium hover:bg-[#8B5A2B] hover:text-[#FAF8F4] hover:border-[#8B5A2B] transition-colors duration-200 cursor-pointer shadow-2xs"
                onClick={clearFilters}
            >
                Reset Filters
            </button>
        </div>
    );
};

export default FilterOptions;

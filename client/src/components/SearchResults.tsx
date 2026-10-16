import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/api-types';

// Define the props for the SearchResults component
interface SearchResultsProps {
  products: Product[];
}

// Define the SearchResults component
const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
  return (
    // Container for search results
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Map through the products and display each one */}
      {products.map((product) => (
        <div key={product._id} className="bg-[#FAF8F4] border border-[#E2D9CC] rounded-2xl p-4 flex flex-col justify-between h-full shadow-2xs font-sans">
          {/* Product Image */}
          <img src={product.photo} alt={product.name} className="w-full h-48 object-cover rounded-xl border border-[#E2D9CC]" />
          {/* Product Name */}
          <h3 className="text-base font-bold text-[#5A3825] mt-4">{product.name}</h3>
          {/* Product Price */}
          <p className="text-base font-bold text-[#8B5A2B]">₹ {product.price}</p>
          {/* View Details Button */}
          <Link to={`/product/${product._id}`} className="mt-4 bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] py-2 px-4 rounded-xl text-xs font-semibold text-center transition shadow-xs">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;


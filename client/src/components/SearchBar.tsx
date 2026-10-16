import React from 'react';

// Define the props for the SearchBar component
interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: () => void;
}

// Define the SearchBar component
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
    return (
        <div className="flex items-center mb-4 font-sans">
            {/* Input field for search term */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-grow px-4 py-2 border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] placeholder-[#5A3825]/50 focus:outline-none focus:border-[#5A3825] rounded-l-xl text-xs"
            />
            {/* Button to trigger search */}
            <button
                onClick={onSearch}
                className="bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] px-4 py-2 rounded-r-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;


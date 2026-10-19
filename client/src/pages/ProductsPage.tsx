import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import { usePageSEO } from '../hooks/usePageSEO';
import { collectionPageSchema, breadcrumbSchema, itemListSchema } from '../seo/schemas';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    new URLSearchParams(location.search).get('category') || '',
  );
  const [sort, setSort] = useState<'asc' | 'desc' | 'relevance'>('relevance');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSelectedCategory(new URLSearchParams(location.search).get('category') || '');
    setPage(1);
  }, [location.search]);

  const { data: categoriesData } = useCategoriesQuery('');
  const { data, isLoading, isError } = useSearchProductsQuery({
    search,
    category: selectedCategory || undefined,
    price: undefined,
    sort: sort !== 'relevance' ? sort : undefined,
    page,
  });

  const productList = data?.products || [];

  usePageSEO({
    title: selectedCategory 
      ? `${selectedCategory} – Explore Authentic Products | URVA` 
      : 'Explore Regional Products, Sweets & Crafts | URVA',
    description: selectedCategory
      ? `Browse authentic ${selectedCategory} sourced directly from rural artisans, cooperatives, and farmers across India on URVA.`
      : 'Browse products from URVA: authentic regional foods, Araku coffee, Godavari sweets, handlooms, plants, and thoughtful everyday goods.',
    canonical: '/products',
    keywords: selectedCategory
      ? `${selectedCategory}, buy ${selectedCategory} online, URVA, rural marketplace, swadeshi India`
      : 'URVA, rural products India, regional foods, swadeshi handlooms, kadiyam plants, araku coffee',
    schema: [
      collectionPageSchema({
        url: '/products',
        name: selectedCategory ? `${selectedCategory} | URVA` : 'Explore Products | URVA',
        description: 'Explore regional and rural specialty products from across India.',
        numberOfItems: data?.totalProducts || productList.length,
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: selectedCategory ? selectedCategory : 'Products', url: '/products' },
        ],
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
      ]),
      ...(productList.length > 0 ? [
        itemListSchema(
          productList.slice(0, 10).map((p, idx) => ({
            name: p.name,
            url: `/product/${p._id}`,
            position: idx + 1,
          }))
        )
      ] : []),
    ],
  });

  const categories = categoriesData?.categories || [];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setPage(1);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl bg-[#5A3825] px-6 py-10 text-white sm:px-10 border border-[#3F2618] shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CCA887]">
            One Village – One Product
          </p>
          <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-4xl text-[#F4F1EA] tracking-tight">
            Explore the URVA Collection
          </h1>
          <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#E2D9CC]">
            Discover authentic regional foods, tribal harvests, handlooms, and everyday essentials.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] p-5 self-start shadow-xs">
            <h2 className="border-b border-[#E2D9CC] pb-3 font-sans text-sm font-semibold uppercase tracking-wider text-[#5A3825]">
              Categories
            </h2>
            <ul className="mt-3 space-y-1">
              <li>
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-colors ${
                    selectedCategory === ''
                      ? 'bg-[#8B5A2B] text-white font-medium'
                      : 'text-[#5A3825] hover:bg-[#F4F1EA] hover:text-[#8B5A2B]'
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#8B5A2B] text-white font-medium'
                        : 'text-[#5A3825] hover:bg-[#F4F1EA] hover:text-[#8B5A2B]'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] p-3.5 sm:flex-row shadow-xs">
              <label className="relative w-full max-w-md">
                <FaSearch aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8C7364]" />
                <span className="sr-only">Search products</span>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-full border border-[#E2D9CC] bg-[#F4F1EA] py-2 pl-9 pr-4 text-xs text-[#5A3825] placeholder:text-[#8C7364] focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-[#8C7364]">
                <span>Sort by:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as 'asc' | 'desc' | 'relevance')}
                  className="rounded-lg border border-[#E2D9CC] bg-[#FAF8F4] px-3 py-1.5 text-xs font-medium text-[#5A3825] focus:outline-none focus:border-[#8B5A2B]"
                >
                  <option value="relevance">Recommended</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </label>
            </div>

            {isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
                  <p className="text-xs text-neutral-500">Loading products...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
                <p className="mb-2 text-3xl">🌾</p>
                <h2 className="font-sans text-base font-semibold text-neutral-800">Unable to load products</h2>
                <p className="mt-1 text-xs text-neutral-500">Please check your connection and try again.</p>
              </div>
            ) : !data?.products || data.products.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
                <p className="mb-2 text-3xl">📦</p>
                <h2 className="font-sans text-base font-semibold text-neutral-800">No products found</h2>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearch('');
                    setPage(1);
                  }}
                  className="mt-4 rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
                >
                  View all products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {data.products.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {data.totalPage > 1 && (
                  <div className="mt-10 flex justify-center">
                    <ReactPaginate
                      pageCount={data.totalPage}
                      pageRangeDisplayed={2}
                      marginPagesDisplayed={1}
                      onPageChange={handlePageClick}
                      containerClassName="flex items-center space-x-1 sm:space-x-2 bg-white px-4 py-2 rounded-full shadow-xs border border-neutral-200 text-xs"
                      pageClassName="rounded-full overflow-hidden"
                      pageLinkClassName="w-8 h-8 flex items-center justify-center text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      previousClassName="rounded-full overflow-hidden"
                      previousLinkClassName="px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      nextClassName="rounded-full overflow-hidden"
                      nextLinkClassName="px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      activeClassName="bg-black text-white"
                      activeLinkClassName="text-white hover:bg-black"
                      disabledClassName="opacity-30 cursor-not-allowed"
                      forcePage={page - 1}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

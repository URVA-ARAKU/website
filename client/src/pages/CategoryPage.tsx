import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProductCard from '../components/ProductCard';
import { useSearchProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import { usePageSEO } from '../hooks/usePageSEO';
import { urvaaCategories } from '../data/categories';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug
    ? urvaaCategories[categorySlug as keyof typeof urvaaCategories]
    : undefined;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

  usePageSEO({
    title: category ? `${category.title} | URVA` : 'Category | URVA',
    description: category?.description ?? 'Explore curated collections from URVA.',
    canonical: categorySlug ? `/category/${categorySlug}` : '/category',
  });

  const { data, isLoading, isError, refetch } = useSearchProductsQuery(
    {
      search: '',
      category: category?.title ?? '',
      price: '',
      sort: '',
      page,
    },
    { skip: !category },
  );

  if (!category) return <Navigate to="/not-found" replace />;

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 font-medium">
          <Link to="/" className="transition hover:text-black">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link to="/products" className="transition hover:text-black">Products</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" className="font-semibold text-[#111111]">{category.title}</span>
        </nav>

        <header className="relative isolate flex min-h-64 items-end overflow-hidden rounded-2xl bg-[#111111] p-6 sm:min-h-80 sm:p-10 border border-neutral-800">
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="max-w-2xl text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">Discover the collection</p>
            <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl text-white tracking-tight">{category.title}</h1>
            <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-neutral-300">{category.description}</p>
          </div>
        </header>

        <section
          aria-label={`${category.title} products and order information`}
          className="grid gap-5 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr] shadow-xs"
        >
          <div>
            <h2 className="font-sans text-base font-semibold text-[#111111]">Available in this collection</h2>
            <ul className="mt-3 grid gap-2 text-xs text-neutral-600 sm:grid-cols-2">
              {category.products.map((product) => (
                <li key={product} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-0.5 text-black">•</span>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 border-t border-neutral-200 pt-4 text-xs sm:pt-4 lg:border-l lg:border-t-0 lg:pl-5">
            <p>
              <span className="font-semibold text-[#111111]">Minimum order:</span>{' '}
              <span className="text-neutral-600">{category.minimumOrder}</span>
            </p>
            {'bulkPricing' in category && (
              <p>
                <span className="font-semibold text-[#111111]">Bulk pricing:</span>{' '}
                <span className="text-neutral-600">{category.bulkPricing}</span>
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="category-products-heading" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Made to be discovered</p>
              <h2 id="category-products-heading" className="mt-1 font-sans text-2xl font-semibold text-[#111111]">
                Shop {category.title}
              </h2>
            </div>
            <Link to="/products" className="text-xs font-semibold text-neutral-800 transition hover:text-black">
              Browse all products <span aria-hidden="true">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center" role="status">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
                <p className="text-xs text-neutral-500">Loading {category.title.toLowerCase()}...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
              <h2 className="font-sans text-base font-semibold text-neutral-800">Unable to load this collection</h2>
              <p className="mt-1 text-xs text-neutral-500">Please check your connection and try again.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-full bg-black px-5 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
              >
                Try again
              </button>
            </div>
          ) : !data?.products.length ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
              <h2 className="font-sans text-base font-semibold text-neutral-800">No products in this collection yet</h2>
              <p className="mt-1 text-xs text-neutral-500">Explore all products to find something you love.</p>
              <Link to="/products" className="mt-4 inline-flex rounded-full bg-black px-5 py-2 text-xs font-medium text-white transition hover:bg-neutral-800">
                View all products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {data.products.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {data.totalPage > 1 && (
                <div className="mt-8 flex justify-center">
                  <ReactPaginate
                    pageCount={data.totalPage}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    containerClassName="flex items-center space-x-1 sm:space-x-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-xs text-xs"
                    pageClassName="overflow-hidden rounded-full"
                    pageLinkClassName="flex h-8 w-8 items-center justify-center text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                    previousClassName="overflow-hidden rounded-full"
                    previousLinkClassName="px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    nextClassName="overflow-hidden rounded-full"
                    nextLinkClassName="px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    activeClassName="bg-black text-white"
                    activeLinkClassName="text-white hover:bg-black"
                    disabledClassName="opacity-30"
                    breakLabel="..."
                    previousLabel="Previous"
                    nextLabel="Next"
                    forcePage={page - 1}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default CategoryPage;

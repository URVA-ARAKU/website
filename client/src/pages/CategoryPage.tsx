import React, { useEffect, useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProductCard from '../components/ProductCard';
import { useSearchProductsQuery } from '../redux/api/product.api';
import { useGetCategoriesQuery } from '../redux/api/category.api';
import { Product } from '../types/api-types';
import { usePageSEO } from '../hooks/usePageSEO';
import { urvaaCategories } from '../data/categories';
import { collectionPageSchema, breadcrumbSchema, itemListSchema, faqSchema } from '../seo/schemas';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: catData } = useGetCategoriesQuery();

  const category = useMemo(() => {
    if (!categorySlug) return undefined;
    const staticMatch = urvaaCategories[categorySlug as keyof typeof urvaaCategories];
    if (staticMatch) return staticMatch;

    const dynamicMatch = catData?.categories?.find(
      (c: any) =>
        c.slug === categorySlug ||
        c.id === categorySlug ||
        c.name?.toLowerCase().replace(/\s+/g, '-') === categorySlug?.toLowerCase() ||
        c.name?.toLowerCase() === categorySlug?.toLowerCase().replace(/-/g, ' ')
    );

    if (dynamicMatch) {
      return {
        title: dynamicMatch.name,
        description: dynamicMatch.description || (dynamicMatch as any).tagline || `Explore authentic ${dynamicMatch.name} directly from rural artisans.`,
        heroImage: dynamicMatch.image || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
        image: dynamicMatch.image || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
        products: [] as string[],
        highlights: ['100% Genuine', 'Rural Sourced', 'Direct Artisan Support'],
        minimumOrder: 'Direct Cooperative Sourcing',
        bulkPricing: 'Custom packing and bulk orders available.',
      };
    }
    return undefined;
  }, [categorySlug, catData]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

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

  const productList = data?.products || [];

  const categoryFaqs = (category as any)?.faqs;

  usePageSEO({
    title: (category as any)?.seoTitle || (category ? `${category.title} – Buy Authentic Rural Specialties | URVA` : 'Category | URVA'),
    description: (category as any)?.seoDescription || (category?.description 
      ? `${category.description} 100% authentic, farmer & artisan direct with nationwide delivery across India on URVA.` 
      : 'Explore curated regional collections from URVA.'),
    canonical: categorySlug ? `/category/${categorySlug}` : '/products',
    ogImage: category?.image,
    ogType: 'website',
    keywords: (category as any)?.seoKeywords || (category 
      ? `${category.title}, buy ${category.title} online, URVA, ${category.products.join(', ')}, swadeshi, authentic rural India` 
      : 'URVA, regional products, swadeshi'),
    schema: category ? [
      collectionPageSchema({
        url: `/category/${categorySlug}`,
        name: `${category.title} | URVA`,
        description: category.description,
        image: category.image,
        numberOfItems: data?.totalProducts || category.products.length,
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: category.title, url: `/category/${categorySlug}` },
        ],
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: category.title, url: `/category/${categorySlug}` },
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
      ...(categoryFaqs && categoryFaqs.length > 0 ? [faqSchema(categoryFaqs)] : []),
    ] : [],
  });

  if (!category) return <Navigate to="/not-found" replace />;

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#8C7364] font-medium">
          <Link to="/" className="transition hover:text-[#5A3825]">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link to="/products" className="transition hover:text-[#5A3825]">Products</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" className="font-semibold text-[#5A3825]">{category.title}</span>
        </nav>

        <header className="relative isolate flex min-h-64 items-end overflow-hidden rounded-2xl bg-[#5A3825] p-6 sm:min-h-80 sm:p-10 border border-[#3F2618] shadow-sm">
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-[#5A3825]/70 to-black/40" />
          <div className="max-w-2xl text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CCA887]">Discover the collection</p>
            <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl text-[#F4F1EA] tracking-tight">{category.title}</h1>
            <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-[#E2D9CC]">{category.description}</p>
          </div>
        </header>



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
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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

        {/* ─── SEO Content: Heritage Story & Craft Provenance ─── */}
        {(category as any)?.detailedStory && (
          <section aria-label="About this collection" className="rounded-2xl bg-[#FAF8F4] p-6 sm:p-8 border border-[#E2D9CC] space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5A2B] bg-[#F4F1EA] px-2.5 py-1 rounded-full border border-[#E2D9CC] inline-block">
              One Village One Product
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5A3825]">
              The Heritage & Authenticity of {category.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#8C7364]">
              {(category as any).detailedStory}
            </p>
          </section>
        )}

        {/* ─── SEO Content: Frequently Asked Questions (FAQ) Accordion ─── */}
        {categoryFaqs && categoryFaqs.length > 0 && (
          <section aria-label="Frequently Asked Questions" className="rounded-2xl bg-[#FAF8F4] p-6 sm:p-8 border border-[#E2D9CC] space-y-4">
            <div className="border-b border-[#E2D9CC] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5A2B]">Customer Queries</span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#5A3825] mt-0.5">
                Frequently Asked Questions about {category.title}
              </h2>
              <p className="text-xs text-[#8C7364] mt-0.5">
                Learn more about origin, purity, preparation, and fast regional delivery across Andhra Pradesh & Telangana.
              </p>
            </div>
            <div className="divide-y divide-[#E2D9CC]/70 space-y-2">
              {categoryFaqs.map((faq: { question: string; answer: string }, idx: number) => (
                <details key={idx} className="group pt-3 cursor-pointer">
                  <summary className="font-semibold text-xs sm:text-sm text-[#5A3825] flex justify-between items-center select-none group-hover:text-[#8B5A2B] transition-colors">
                    <span>{faq.question}</span>
                    <span className="text-[10px] text-[#8C7364] transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-xs sm:text-sm text-[#8C7364] mt-2 leading-relaxed pl-1 pb-1">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;


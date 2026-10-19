import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { cn } from '../lib/utils';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';
import { useGetCategoriesQuery } from '../redux/api/category.api';

export interface CategoryItem {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  link: string;
  badge?: string;
  highlightColor?: string;
}

// Retain alias for backwards compatibility
export type CategoryFlipItem = CategoryItem;

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'shop-all',
    name: 'Shop All',
    subtitle: 'All Products',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
    imageAlt: 'Browse all URVA products and collections',
    link: '/products',
    badge: 'All',
    highlightColor: '#C79A56',
  },
  {
    id: 'tribal-araku-products',
    name: 'Araku Tribal Products',
    subtitle: 'Coffee & Wild Honey',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904994/urvaa/images/categories/tribal-araku.jpg',
    imageAlt: 'Araku tribal coffee, forest honey and organic turmeric',
    link: '/category/tribal-araku-products',
    badge: 'Organic',
    highlightColor: '#1b3b28',
  },
  {
    id: 'mana-godavari-foods',
    name: 'Mana Godavari Foods',
    subtitle: 'Palm Jaggery & Sweets',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904992/urvaa/images/categories/mana-godavari.jpg',
    imageAlt: 'Traditional Godavari palm jaggery, putharekulu, and regional sweets',
    link: '/category/mana-godavari-foods',
    badge: 'Heritage',
    highlightColor: '#7c3817',
  },
  {
    id: 'eco-friendly-products',
    name: 'Eco-Friendly Products',
    subtitle: 'Leaf Plates & Dhoop',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904990/urvaa/images/categories/eco-friendly.jpg',
    imageAlt: 'Siali leaf plates and natural herbal dhoop',
    link: '/category/eco-friendly-products',
    badge: 'Zero Plastic',
    highlightColor: '#234e40',
  },
  {
    id: 'swadesi-handlooms',
    name: 'Swadesi Handlooms',
    subtitle: 'Pure Cotton & Sarees',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904993/urvaa/images/categories/swadesi-handlooms.jpg',
    imageAlt: 'Artisanal handwoven sarees and cotton textiles',
    link: '/category/swadesi-handlooms',
    badge: 'Artisanal',
    highlightColor: '#6a283b',
  },
  {
    id: 'kadiyam-plants',
    name: 'Kadiyam Plants',
    subtitle: 'Nursery & Saplings',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904991/urvaa/images/categories/kadiyam-plants.jpg',
    imageAlt: 'Lush exotic nursery plants and fruit saplings',
    link: '/category/kadiyam-plants',
    badge: 'Green Living',
    highlightColor: '#1d4838',
  },
];

export interface ShopByCategoryProps {
  items?: CategoryItem[];
  className?: string;
  heading?: string;
  subheading?: string;
  eyebrow?: string;
}

export function ShopByCategory({
  items,
  className,
  heading = 'Shop by Category',
  subheading,
  eyebrow = 'CURATED REGIONAL COLLECTIONS',
}: ShopByCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: catData } = useGetCategoriesQuery();

  const categoriesList = useMemo<CategoryItem[]>(() => {
    if (items && items.length > 0) return items;
    if (catData?.categories && catData.categories.length > 0) {
      const active = catData.categories.filter((c: any) => c.isActive !== false);
      return [
        {
          id: 'shop-all',
          name: 'Shop All',
          subtitle: 'All Products',
          image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
          imageAlt: 'Browse all URVA products and collections',
          link: '/products',
          badge: 'All',
          highlightColor: '#C79A56',
        },
        ...active.map((c: any) => ({
          id: c.slug || c.id,
          name: c.name,
          subtitle: c.tagline || c.subtitle || `${c.productCount || 0} Products`,
          image: c.image || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
          imageAlt: c.name,
          link: `/category/${c.slug || c.id}`,
          badge: c.badge || undefined,
          highlightColor: c.highlightColor || '#5A3825',
        }))
      ];
    }
    return DEFAULT_CATEGORIES;
  }, [items, catData]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      aria-label="Shop by Category"
      className={cn(
        'w-full bg-[#F4F1EA] border-t border-[#E2D9CC] pt-6 pb-3 sm:pt-8 sm:pb-4',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 sm:mb-5 gap-3">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C7364] block mb-1">
              {eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5A3825] tracking-tight font-sans">
              {heading}
            </h2>
            {subheading && (
              <p className="mt-1 text-xs sm:text-sm text-[#8C7364] max-w-xl font-normal leading-relaxed">
                {subheading}
              </p>
            )}
          </div>

          {/* Desktop Navigation Arrows & View All Link */}
          <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
            <Link
              to="/products"
              className="text-xs sm:text-sm font-medium text-[#8B5A2B] hover:text-[#5A3825] underline-offset-4 hover:underline transition-colors mr-2"
            >
              View All Products &rarr;
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label="Scroll categories left"
                className="w-8 h-8 rounded-full border border-[#E2D9CC] bg-[#FAF8F4] text-[#5A3825] hover:bg-[#8B5A2B] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label="Scroll categories right"
                className="w-8 h-8 rounded-full border border-[#E2D9CC] bg-[#FAF8F4] text-[#5A3825] hover:bg-[#8B5A2B] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Circular Categories Scroll / Grid Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex items-start gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1 px-1 snap-x snap-mandatory justify-start md:justify-center"
          >
            {categoriesList.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group flex flex-col items-center shrink-0 snap-center text-center transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5A2B] rounded-2xl p-1"
                style={{ width: 'clamp(96px, 14vw, 136px)' }}
              >
                {/* Round Avatar Circle Container */}
                <div className="relative mb-3">
                  {/* Outer Ring with Terracotta Hover Accent */}
                  <div
                    className={cn(
                      'relative p-[3px] rounded-full transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:-translate-y-1',
                      category.id === 'shop-all'
                        ? 'bg-gradient-to-tr from-[#5A3825] via-[#8B5A2B] to-[#5A3825]'
                        : 'bg-gradient-to-tr from-[#E2D9CC] via-[#F4F1EA] to-[#E2D9CC] group-hover:from-[#8B5A2B] group-hover:via-[#5A3825] group-hover:to-[#8B5A2B]'
                    )}
                  >
                    {/* Inner Circle Wrapper */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-[#FAF8F4] p-[2px]">
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-[#EAE5D9]">
                        <img
                          src={optimizeCloudinaryUrl(category.image, 240)}
                          alt={category.imageAlt || category.name}
                          className="w-full h-full object-cover rounded-full transition-transform duration-500 ease-out group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Pill Badge on the circle */}
                  {category.badge && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs border border-white uppercase tracking-wider bg-[#5A3825] text-[#F4F1EA]"
                    >
                      {category.badge}
                    </span>
                  )}
                </div>

                {/* Category Name Label */}
                <h3 className="text-xs sm:text-sm font-semibold text-[#5A3825] group-hover:text-[#8B5A2B] transition-colors leading-snug line-clamp-2 max-w-[120px] font-sans">
                  {category.name}
                </h3>

                {/* Subtitle / Micro Hint */}
                {category.subtitle && (
                  <span className="text-[10px] sm:text-[11px] text-[#8C7364] font-normal mt-0.5 line-clamp-1 max-w-[110px] group-hover:text-[#5A3825]">
                    {category.subtitle}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-2 flex sm:hidden justify-center items-center gap-1.5 text-[11px] text-[#8C7364] font-light">
          <span>&larr; Swipe to explore categories &rarr;</span>
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;

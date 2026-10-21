import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedSection from '../components/FeaturedSection';
import ShopByCategory from '../components/ShopByCategory';
import PopularProducts from '../components/PopularProduct';
import CommunityGallery from '../components/CommunityGallery';
import YouTubeSection from '../components/YouTubeSection';
import CustomerTestimonials from '../components/CustomerTestimonials';
import ExploreProducts from '../components/ExploreProducts';
import { useLatestProductsQuery } from '../redux/api/product.api';
import { useGetBannersQuery } from '../redux/api/banner.api';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, faqSchema } from '../seo/schemas';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';
import FAQSection, { faqData } from '../components/common/FAQSection';

const HomePage: React.FC = () => {
  const { data: productData } = useLatestProductsQuery('');
  const products = productData?.products || [];

  const { data: showcaseData } = useGetBannersQuery('showcase_banner');
  const showcaseBanner = showcaseData?.banners?.find((b) => b.isActive !== false);

  usePageSEO({
    title: 'URVA – Buy Authentic Araku Coffee, Godavari Sweets & Rural Goods Online',
    description:
      'Shop 100% authentic Araku Arabica coffee powder, Atreyapuram Bellam Putharekulu, pure forest honey, cotton handlooms, and Kadiyam live plants online. Direct from rural cooperatives with fast delivery in AP & Telangana.',
    canonical: '/',
    keywords:
      'buy araku coffee online, atreyapuram putharekulu online, raw honey andhra, thati bellam palm jaggery, kadiyam plants hyderabad, pure cotton handloom sarees, tribal millets vizag, URVA rural aura, one village one product india, urva swadeshi',
    schema: [
      webPageSchema({
        url: '/',
        name: 'URVA | Delivering the Authentic Rural Aura',
        description:
          'Authentic Indian regional commerce built around One Village – One Product, direct farmer sourcing, and certified purity.',
        breadcrumb: [{ name: 'Home', url: '/' }],
      }),
      faqSchema(faqData),
    ],
  });

  return (
    <div className="min-h-screen w-full">
      {/* ─── 1. Hero Carousel (Dynamic Admin Managed) ─── */}
      <FeaturedSection />

      {/* ─── 2. Shop by Category (Round E-Commerce Categories) ─── */}
      <ShopByCategory />

      {/* ─── 4. Best Sellers (Popular Products) ─── */}
      <PopularProducts products={products} />

      {/* ─── 5. UrvAA Rural Marketplace Showcase Banner (Dynamic Admin Managed) ─── */}
      <section className="w-full bg-[#F4F1EA] py-2 sm:py-5 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-[#E2D9CC] bg-[#FAF8F4] shadow-xs transition-all hover:border-[#8B5A2B]/40 group">
            {showcaseBanner?.linkUrl ? (
              <Link to={showcaseBanner.linkUrl} className="block w-full">
                <picture>
                  {showcaseBanner.mobileImageUrl && showcaseBanner.mobileImageUrl !== showcaseBanner.imageUrl && (
                    <source
                      media="(max-width: 639px)"
                      srcSet={optimizeCloudinaryUrl(showcaseBanner.mobileImageUrl, 800)}
                    />
                  )}
                  <img
                    src={optimizeCloudinaryUrl(
                      showcaseBanner.imageUrl ||
                      'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905013/urvaa/images/urvaa-rural-marketplace-showcase.png',
                      1400
                    )}
                    alt={showcaseBanner.title || 'UrvAA Rural Marketplace Showcase'}
                    className="w-full h-auto object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </Link>
            ) : (
              <picture>
                {showcaseBanner?.mobileImageUrl && showcaseBanner.mobileImageUrl !== showcaseBanner.imageUrl && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={optimizeCloudinaryUrl(showcaseBanner.mobileImageUrl, 800)}
                  />
                )}
                <img
                  src={optimizeCloudinaryUrl(
                    showcaseBanner?.imageUrl ||
                    'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905013/urvaa/images/urvaa-rural-marketplace-showcase.png',
                    1400
                  )}
                  alt={showcaseBanner?.title || 'UrvAA Rural Marketplace Showcase'}
                  className="w-full h-auto object-cover sm:object-contain mx-auto"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}
          </div>
        </div>
      </section>

      {/* ─── 6. Explore All Products Grid ─── */}
      <ExploreProducts products={products} />

      {/* ─── 7. Snaps of the URVA Community (Artisans & Field Gallery) ─── */}
      <div className="content-auto">
        <CommunityGallery />
      </div>

      {/* ─── 8. Official YouTube Channel & Documentaries Showcase ─── */}
      <div className="content-auto">
        <YouTubeSection />
      </div>

      {/* ─── 10. Customer Testimonials ─── */}
      <div className="content-auto">
        <CustomerTestimonials />
      </div>

      {/* ─── 11. Frequently Asked Questions (FAQ Section) ─── */}
      <div className="content-auto">
        <FAQSection />
      </div>
    </div>
  );
};

export default HomePage;

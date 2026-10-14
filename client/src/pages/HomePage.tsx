import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedSection from '../components/FeaturedSection';
import ShopByCategory from '../components/ShopByCategory';
import PopularProducts from '../components/PopularProduct';
import CommunityGallery from '../components/CommunityGallery';
import CommunityVideos from '../components/CommunityVideos';
import CustomerTestimonials from '../components/CustomerTestimonials';
import ExploreProducts from '../components/ExploreProducts';
import { useLatestProductsQuery } from '../redux/api/product.api';
import { useGetBannersQuery } from '../redux/api/banner.api';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema } from '../seo/schemas';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

const HomePage: React.FC = () => {
  const { data: productData } = useLatestProductsQuery('');
  const products = productData?.products || [];

  const { data: showcaseData } = useGetBannersQuery('showcase_banner');
  const showcaseBanner = showcaseData?.banners?.find((b) => b.isActive !== false);

  usePageSEO({
    title: 'URVA | Delivering the Authentic Rural Aura',
    description:
      'Discover regional products, traditional foods, indigenous craftsmanship, handlooms, plants, and thoughtful everyday goods with URVA.',
    canonical: '/',
    keywords:
      'URVA, rural products India, regional products, One Village One Product, Indian artisans, regional foods, handlooms, nursery plants',
    schema: [
      webPageSchema({
        url: '/',
        name: 'URVA | Delivering the Authentic Rural Aura',
        description:
          'A rural-products commerce brand built around One Village – One Product and the regional stories behind India’s goods.',
        breadcrumb: [{ name: 'Home', url: '/' }],
      }),
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
      <section className="w-full bg-[#FAF7F2] border-y border-[#EBE3D5] my-2">
        {showcaseBanner?.linkUrl ? (
          <Link to={showcaseBanner.linkUrl} className="block group">
            <img
              src={optimizeCloudinaryUrl(
                showcaseBanner.imageUrl ||
                'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905013/urvaa/images/urvaa-rural-marketplace-showcase.png',
                1200
              )}
              alt={showcaseBanner.title || 'UrvAA Rural Marketplace Showcase'}
              className="block w-full h-auto object-contain mx-auto transition-transform duration-300 group-hover:opacity-95"
              loading="lazy"
              decoding="async"
            />
          </Link>
        ) : (
          <img
            src={optimizeCloudinaryUrl(
              showcaseBanner?.imageUrl ||
              'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905013/urvaa/images/urvaa-rural-marketplace-showcase.png',
              1200
            )}
            alt={showcaseBanner?.title || 'UrvAA Rural Marketplace Showcase'}
            className="block w-full h-auto object-contain mx-auto"
            loading="lazy"
            decoding="async"
          />
        )}
      </section>

      {/* ─── 6. Explore All Products Grid ─── */}
      <ExploreProducts products={products} />

      {/* ─── 7. Life Across India's Villages (Artisans & Field Gallery) ─── */}
      <div className="content-auto">
        <CommunityGallery />
      </div>

      {/* ─── 8. Video Stories from the Ground ─── */}
      <div className="content-auto">
        <CommunityVideos />
      </div>

      {/* ─── 9. Customer Testimonials ─── */}
      <div className="content-auto">
        <CustomerTestimonials />
      </div>
    </div>
  );
};

export default HomePage;

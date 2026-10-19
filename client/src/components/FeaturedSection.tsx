import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetBannersQuery } from '../redux/api/banner.api';
import { StoreBanner } from '../types/api-types';

const defaultHeroBanners: Partial<StoreBanner>[] = [
  {
    id: 'hero_1',
    title: 'Delivering the Authentic Rural Aura',
    subtitle: 'Discover regional treasures, single-origin harvests & artisanal heritage directly from India’s rural cooperatives.',
    imageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
    mobileImageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905009/urvaa/images/hero/from-our-villages.jpg',
    linkUrl: '/products',
    buttonText: 'Shop All Collections',
    badge: 'ONE VILLAGE ONE PRODUCT',
  },
  {
    id: 'hero_2',
    title: 'Untouched Flavors of Mana Godavari',
    subtitle: 'Wood-fired palm jaggery, Bellam Putharekulu, and heritage sweets crafted with zero chemicals.',
    imageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905012/urvaa/images/hero/rural-heritage.jpg',
    mobileImageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905012/urvaa/images/hero/rural-heritage.jpg',
    linkUrl: '/category/mana-godavari-foods',
    buttonText: 'Taste Godavari Sweets',
    badge: 'HERITAGE RECIPES',
  },
  {
    id: 'hero_3',
    title: 'Wild Araku Tribal Coffee & Forest Honey',
    subtitle: 'Single-origin Arabica coffee beans and raw cliff honey sourced directly from indigenous forest tribes.',
    imageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905011/urvaa/images/hero/rooted-in-rural-life.jpg',
    mobileImageUrl: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905011/urvaa/images/hero/rooted-in-rural-life.jpg',
    linkUrl: '/category/tribal-araku-products',
    buttonText: 'Discover Tribal Araku',
    badge: 'ORGANIC HARVEST',
  },
];

const FeaturedSection: React.FC = () => {
  const { data: bannerData } = useGetBannersQuery('hero');
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroBanners =
    bannerData?.banners && bannerData.banners.length > 0
      ? bannerData.banners
      : defaultHeroBanners;

  useEffect(() => {
    if (isPaused || heroBanners.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroBanners.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [isPaused, heroBanners.length]);

  const showImage = (index: number) => {
    setActiveImage((index + heroBanners.length) % heroBanners.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      showImage(activeImage + 1);
    } else if (distance < -40) {
      showImage(activeImage - 1);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#111111] group aspect-[2/1] sm:aspect-[2.2/1] md:aspect-auto md:h-[clamp(20rem,55vw,44rem)] touch-pan-y"
      role="region"
      aria-label="URVA stories from rural India"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Slides */}
      {heroBanners.map((banner, index) => {
        const isCurrent = index === activeImage;
        const imgSrc = banner.imageUrl || defaultHeroBanners[0].imageUrl;
        const mobileSrc = banner.mobileImageUrl || imgSrc;

        const slideContent = (
          <picture className="block h-full w-full">
            <source media="(max-width: 640px)" srcSet={mobileSrc} />
            <img
              src={imgSrc}
              alt={banner.title || 'URVA rural products banner'}
              className="h-full w-full object-cover object-center"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </picture>
        );

        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            aria-hidden={!isCurrent}
          >
            {banner.linkUrl ? (
              <Link to={banner.linkUrl} className="block h-full w-full cursor-pointer" tabIndex={isCurrent ? 0 : -1}>
                {slideContent}
              </Link>
            ) : (
              slideContent
            )}
          </div>
        );
      })}

      {/* Dots Indicator - Centered at bottom on mobile, bottom-right on desktop */}
      {heroBanners.length > 1 && (
        <div className="absolute bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0 z-30 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/10">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => showImage(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeImage ? 'true' : undefined}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === activeImage ? 'w-5 sm:w-6 bg-[#8B5A2B]' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;

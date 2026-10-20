import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetBannersQuery } from '../redux/api/banner.api';

const FeaturedSection: React.FC = () => {
  const { data: bannerData, isLoading } = useGetBannersQuery('hero');
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const heroBanners = (bannerData?.banners || []).filter((b) => b.isActive !== false);

  useEffect(() => {
    if (isPaused || heroBanners.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroBanners.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [isPaused, heroBanners.length]);

  if (isLoading) {
    return (
      <div className="w-full bg-[#FAF8F5] aspect-[2/1] sm:aspect-[2.2/1] md:aspect-auto md:h-[clamp(22rem,55vw,46rem)] animate-pulse" />
    );
  }

  if (!heroBanners || heroBanners.length === 0) {
    return null;
  }

  const activeIndex = activeImage >= heroBanners.length ? 0 : activeImage;

  const showImage = (index: number) => {
    setActiveImage((index + heroBanners.length) % heroBanners.length);
  };

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
      showImage(activeIndex + 1);
    } else if (distance < -40) {
      showImage(activeIndex - 1);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF8F5] group aspect-[2/1] sm:aspect-[2.2/1] md:aspect-auto md:h-[clamp(22rem,55vw,46rem)] touch-pan-y"
      role="region"
      aria-label="URVA stories from rural India"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Dynamic Background Slides loaded from Admin Dashboard */}
      {heroBanners.map((banner, index) => {
        const isCurrent = index === activeIndex;
        const imgSrc = banner.imageUrl;
        const mobileSrc = banner.mobileImageUrl || imgSrc;

        if (!imgSrc) return null;

        const slideContent = (
          <picture className="block h-full w-full">
            {mobileSrc && mobileSrc !== imgSrc && (
              <source media="(max-width: 640px)" srcSet={mobileSrc} />
            )}
            <img
              src={imgSrc}
              alt={banner.title || 'URVA hero banner'}
              className="h-full w-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding={index === 0 ? 'sync' : 'async'}
            />
          </picture>
        );

        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
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

      {/* Dots Indicator — Active when more than one dynamic banner exists */}
      {heroBanners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-xs">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => showImage(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 h-2 bg-[#8B5A2B]'
                  : 'w-2 h-2 bg-white/80 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;

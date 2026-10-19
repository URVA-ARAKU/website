import React from 'react';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

const communityImages = [
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904995/urvaa/images/community/community-01.webp', alt: 'Eco-friendly plates and tableware' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904996/urvaa/images/community/community-02.jpg', alt: 'Traditional flowers from the region' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904996/urvaa/images/community/community-03.jpg', alt: 'Women sorting coffee beans at an Araku farm' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904997/urvaa/images/community/community-04.webp', alt: 'Eco-friendly household and dining products' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904998/urvaa/images/community/community-05.jpg', alt: 'Natural leaf plates' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904999/urvaa/images/community/community-06.jpg', alt: 'Handcrafted wooden tableware' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905000/urvaa/images/community/community-07.jpg', alt: 'Handwoven natural-fiber bag' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905000/urvaa/images/community/community-08.jpg', alt: 'Traditional regional sweets' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905001/urvaa/images/community/community-09.jpg', alt: 'Flowering plants in colorful pots' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905002/urvaa/images/community/community-10.jpg', alt: 'Women weaving a traditional handloom' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905003/urvaa/images/community/community-11.jpg', alt: 'Herbs harvested by local growers' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905003/urvaa/images/community/community-12.jpg', alt: 'A craftswoman working at a handloom' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905004/urvaa/images/community/community-13.jpg', alt: 'Rural growers harvesting mustard greens' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905004/urvaa/images/community/community-14.jpg', alt: 'Artisan working at a traditional loom' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905005/urvaa/images/community/community-15.jpg', alt: 'Decorative kolam artwork' },
  { url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905006/urvaa/images/community/community-16.jpg', alt: 'A grower tending plants at a nursery' },
];

const CommunityGallery: React.FC = () => (
  <section aria-labelledby="community-gallery-heading" className="overflow-hidden bg-[#F4F1EA] border-t border-[#E2D9CC] py-10 md:py-14">
    <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:mb-10 sm:px-6">
      <h2 id="community-gallery-heading" className="font-sans text-2xl font-semibold tracking-tight text-[#5A3825] sm:text-3xl lg:text-4xl">
        Life Across India's Villages
      </h2>
    </div>

    <div className="overflow-hidden">
      <div className="animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-4 pr-4"
          >
            {communityImages.map((image, idx) => (
              <div
                key={`${copy}-${idx}`}
                className="h-52 w-40 shrink-0 overflow-hidden rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] shadow-xs sm:h-64 sm:w-52"
              >
                <img
                  src={optimizeCloudinaryUrl(image.url, 320)}
                  alt={copy === 0 ? image.alt : ''}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CommunityGallery;

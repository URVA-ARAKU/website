import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaCopy, FaGift } from 'react-icons/fa';
import { useGetBannersQuery } from '../../redux/api/banner.api';

export const FestivalCampaignSection: React.FC = () => {
  const { data: bannerData } = useGetBannersQuery('festival_banner');
  const [copied, setCopied] = useState(false);

  const activeBanner = bannerData?.banners?.find((b) => b.isActive !== false);

  if (!activeBanner) {
    return null; // Gracefully hidden when no seasonal campaign is running
  }

  // Extract coupon code if found in tagline/subtitle
  const promoCodeMatch =
    activeBanner.tagline?.match(/CODE:\s*([A-Z0-9]+)/i) ||
    activeBanner.subtitle?.match(/CODE:\s*([A-Z0-9]+)/i) ||
    (activeBanner.badge?.includes('CODE') ? activeBanner.badge.match(/([A-Z0-9]{4,10})/) : null);

  const promoCode = promoCodeMatch ? promoCodeMatch[1] : 'URVA10';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="w-full py-6 md:py-10 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      <div className="relative overflow-hidden rounded-3xl bg-[#3F2618] text-[#FAF8F4] shadow-2xl border border-[#5A3825]">
        {/* Background Image with Ambient Glow */}
        {activeBanner.imageUrl && (
          <div className="absolute inset-0 z-0">
            <picture>
              {activeBanner.mobileImageUrl && (
                <source media="(max-width: 640px)" srcSet={activeBanner.mobileImageUrl} />
              )}
              <img
                src={activeBanner.imageUrl}
                alt={activeBanner.title || 'Festive Campaign'}
                className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-[#3F2618] via-[#3F2618]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3F2618] via-transparent to-transparent" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            {/* Festive Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8B5A2B]/40 border border-[#8B5A2B] text-[#FAF8F4] text-xs font-bold tracking-wider uppercase">
                <FaGift className="text-xs" />
                {activeBanner.badge || 'FESTIVE SEASON SPECIAL'}
              </span>
              {activeBanner.tagline && (
                <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-[#E2D9CC] font-semibold">
                  • {activeBanner.tagline}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FAF8F4] font-serif tracking-tight leading-tight">
              {activeBanner.title}
            </h3>

            {/* Description */}
            {activeBanner.subtitle && (
              <p className="text-xs sm:text-sm text-[#E2D9CC] leading-relaxed max-w-xl">
                {activeBanner.subtitle}
              </p>
            )}
          </div>

          {/* Action Callout Box */}
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Promo Code Box */}
            <div className="bg-[#2E1C13]/70 backdrop-blur-md border border-[#5A3825] rounded-2xl p-2.5 px-4 flex items-center justify-between gap-4">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#E2D9CC]/70 font-medium">
                  Promo Code
                </span>
                <span className="text-sm font-mono font-bold text-[#FAF8F4] tracking-widest">
                  {promoCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="Copy Promo Code"
                className="px-2.5 py-1.5 rounded-xl bg-[#5A3825] hover:bg-[#8B5A2B] text-[#FAF8F4] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <FaCheck className="text-emerald-300 text-[10px]" />
                    <span className="text-emerald-300 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="text-[10px]" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* CTA Button */}
            {activeBanner.linkUrl && (
              <Link
                to={activeBanner.linkUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FAF8F4] hover:bg-[#F4F1EA] text-[#5A3825] text-xs sm:text-sm font-bold tracking-wide shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
              >
                <span>{activeBanner.buttonText || 'Shop Collection'}</span>
                <span>&rarr;</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FestivalCampaignSection;

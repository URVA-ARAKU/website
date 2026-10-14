import React, { useState } from 'react';
import { useGetBannersQuery } from '../redux/api/banner.api';
import { FaPlay, FaYoutube } from 'react-icons/fa';

interface CommunityVideoItem {
  id: string;
  title: string;
  subtitle?: string;
}

const defaultCommunityVideos: CommunityVideoItem[] = [
  { id: 'aN2sDNVf-Js', title: 'Pure Honey Harvested by Araku Tribes', subtitle: 'Araku Valley, AP' },
  { id: 'BeNpZc_SULs', title: 'Sorting Fresh Native Harvest', subtitle: 'Godavari Delta' },
  { id: 'vwImmm2jPWU', title: 'Delta Farming Traditions', subtitle: 'East Godavari' },
  { id: 'bgq_DG7ptsE', title: 'From Village Artisans to Your Home', subtitle: 'Rural Crafts' },
];

// Helper to extract clean 11-char YouTube ID from URL or raw ID
export function getYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('?')) {
    return trimmed;
  }
  const match = trimmed.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : trimmed;
}

const CommunityVideos: React.FC = () => {
  const { data: videoData } = useGetBannersQuery('story_video');
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);

  const dynamicVideos: CommunityVideoItem[] =
    videoData?.banners && videoData.banners.length > 0
      ? videoData.banners
          .filter((b) => b.isActive !== false)
          .map((b) => ({
            id: getYouTubeId(b.linkUrl || b.imageUrl || ''),
            title: b.title || 'Village Story',
            subtitle: b.subtitle || '',
          }))
          .filter((v) => Boolean(v.id))
      : defaultCommunityVideos;

  const videos: CommunityVideoItem[] = dynamicVideos.length > 0 ? dynamicVideos : defaultCommunityVideos;

  if (videos.length === 0) return null;

  return (
    <section aria-labelledby="community-videos-heading" className="bg-[#FAFAFA] border-t border-neutral-200 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center max-w-2xl mx-auto sm:mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 block mb-1.5">
            VILLAGE STORIES
          </span>
          <h2
            id="community-videos-heading"
            className="font-sans text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl lg:text-4xl"
          >
            Watch Our Rural Heritage
          </h2>
          <p className="mt-2 text-xs md:text-sm text-neutral-500 max-w-lg mx-auto">
            Short glimpses into the traditional craftsmanship and sustainable harvests behind URVA.
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 gap-4 pr-4 sm:gap-8 sm:pr-8"
              >
                {videos.map((video, idx) => {
                  const cardKey = `${copy}-${video.id}-${idx}`;
                  const isPlaying = activeCardKey === cardKey;

                  return (
                    <div
                      key={cardKey}
                      className="aspect-[9/16] w-[min(44vw,260px)] shrink-0 overflow-hidden rounded-xl bg-black border border-neutral-200 relative group cursor-pointer shadow-xs hover:shadow-md transition-shadow"
                      onClick={() => setActiveCardKey(isPlaying ? null : cardKey)}
                    >
                      {isPlaying ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=0&loop=1&playlist=${video.id}&playsinline=1&controls=1&modestbranding=1&rel=0`}
                          title={video.title}
                          className="h-full w-full border-0 pointer-events-auto"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          referrerPolicy="strict-origin-when-cross-origin"
                          tabIndex={copy === 1 ? -1 : 0}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {/* Lightweight Poster Thumbnail (Only ~30KB vs 1MB+ iframe) */}
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                            alt={video.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Gradient Vignette for Legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

                          {/* Top Tag */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10">
                              <FaYoutube className="text-red-500 text-xs" />
                              <span>Short</span>
                            </span>
                          </div>

                          {/* Centered Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                              <FaPlay className="text-sm ml-0.5 text-neutral-900" />
                            </div>
                          </div>

                          {/* Bottom Title & Subtitle */}
                          <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                            <p className="text-xs font-bold text-white line-clamp-2 drop-shadow-sm">
                              {video.title}
                            </p>
                            {video.subtitle && (
                              <p className="text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                                {video.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityVideos;

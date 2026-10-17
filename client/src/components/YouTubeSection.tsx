import React, { useState } from 'react';
import { FaYoutube, FaPlay, FaExternalLinkAlt, FaCheckCircle, FaTv } from 'react-icons/fa';
import { useGetStoreSettingsQuery } from '../redux/api/settings.api';
import { YouTubeVideoItem } from '../types/api-types';

const defaultVideos: YouTubeVideoItem[] = [
  {
    id: 'aN2sDNVf-Js',
    title: 'Araku Valley Tribal Honey & Coffee Harvesting Heritage',
    subtitle: 'Step into Araku hills to witness how indigenous tribes ethically collect wild forest honey and shade-grown Arabica coffee.',
  },
  {
    id: 'BeNpZc_SULs',
    title: 'Godavari Traditional Delta Craftsmanship & Artisans',
    subtitle: 'Generations of rural families preserving indigenous palm crafts, handloom weaving, and heritage pottery.',
  },
  {
    id: 'bgq_DG7ptsE',
    title: 'From Rural Heartlands Directly to Your Kitchen',
    subtitle: 'URVA’s One Village One Product journey bringing unadulterated foods straight from farmer cooperatives.',
  },
];

export const YouTubeSection: React.FC = () => {
  const { data: settingsData } = useGetStoreSettingsQuery();
  const settings = settingsData?.settings;

  const channelUrl = settings?.youtubeChannelUrl || 'https://www.youtube.com/@urvaswadeshi';
  const channelName = settings?.youtubeChannelName || 'URVA Swadeshi Official';
  const videoList: YouTubeVideoItem[] =
    settings?.youtubeVideos && settings.youtubeVideos.length > 0
      ? settings.youtubeVideos
      : defaultVideos;

  const [activeVideoId, setActiveVideoId] = useState<string>(
    settings?.featuredYoutubeVideoId || videoList[0]?.id || 'aN2sDNVf-Js'
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const activeVideo = videoList.find((v) => v.id === activeVideoId) || videoList[0] || {
    id: activeVideoId,
    title: 'Discover URVA’s Heritage Stories',
    subtitle: 'Watch real rural artisans and farmer cooperatives across India.',
  };

  const handleSelectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setIsPlaying(true);
  };

  return (
    <section className="bg-[#FAF8F4] border-t border-b border-[#E2D9CC] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading & YouTube Channel CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider">
                <FaYoutube className="text-red-600 text-sm" />
                <span>YouTube Channel Spotlight</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#8C7364]">
                <FaCheckCircle className="text-emerald-600 text-xs" /> Verified Stories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#5A3825]">
              Experience Our Rural Heritage in Motion
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8C7364] max-w-2xl">
              Authentic documentary glimpses, harvest traditions, and conversations with the rural
              artisans behind your favorite URVA products.
            </p>
          </div>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all group shrink-0"
          >
            <FaYoutube className="text-lg text-white" />
            <span>Subscribe on YouTube</span>
            <FaExternalLinkAlt className="text-[10px] opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Featured Player & Playlist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 16:9 Featured Video Display */}
          <div className="lg:col-span-8 bg-black rounded-3xl overflow-hidden shadow-xl border border-[#E2D9CC]/50">
            <div className="relative aspect-video w-full bg-black">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg`}
                    onError={(e) => {
                      // Fallback to hqdefault if maxres is unavailable
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`;
                    }}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <FaPlay className="text-xl sm:text-2xl ml-1 text-white" />
                    </div>
                  </div>

                  {/* Video Title on Thumbnail */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 pointer-events-none">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-2">
                      Now Playing
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-md line-clamp-2">
                      {activeVideo.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* Video Description Bar */}
            <div className="bg-[#FAF8F4] p-5 sm:p-6 border-t border-[#E2D9CC]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#5A3825]">
                    {activeVideo.title}
                  </h3>
                  {activeVideo.subtitle && (
                    <p className="text-xs sm:text-sm text-[#8C7364] mt-1 leading-relaxed">
                      {activeVideo.subtitle}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#8C7364]">Presented by</span>
                  <span className="px-3 py-1 rounded-lg bg-[#F4F1EA] text-[#5A3825] text-xs font-bold border border-[#E2D9CC]">
                    {channelName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Playlist: Other Stories */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A3825] flex items-center gap-1.5">
                <FaTv className="text-sm text-[#8B5A2B]" />
                <span>Featured Documentaries</span>
              </span>
              <span className="text-[11px] text-[#8C7364] font-medium">
                {videoList.length} Videos
              </span>
            </div>

            <div className="space-y-3">
              {videoList.map((video) => {
                const isSelected = video.id === activeVideoId;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => handleSelectVideo(video.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 group ${
                      isSelected
                        ? 'bg-[#FAF8F4] border-[#8B5A2B] ring-2 ring-[#8B5A2B]/20 shadow-md'
                        : 'bg-[#FAF8F4] border-[#E2D9CC] hover:bg-[#F4F1EA] hover:border-[#8C7364]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden shrink-0 bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-red-600 text-white' : 'bg-white/80 text-black'
                          }`}
                        >
                          <FaPlay className="text-[9px] ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold line-clamp-2 leading-tight ${
                          isSelected ? 'text-[#8B5A2B]' : 'text-[#5A3825]'
                        }`}
                      >
                        {video.title}
                      </p>
                      {video.subtitle && (
                        <p className="text-[11px] text-[#8C7364] line-clamp-1 mt-1">
                          {video.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                          <FaYoutube className="text-xs" /> Watch
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                            Playing
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subscribe Banner Card */}
            <div className="mt-2 bg-[#F4F1EA] border border-[#E2D9CC] rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-[#5A3825]">
                Want to see more rural stories & recipes?
              </p>
              <p className="text-[11px] text-[#8C7364] mt-1 mb-3">
                Join our YouTube community celebrating Indian traditional crafts and organic farming.
              </p>
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#5A3825] hover:bg-[#3F2618] text-[#F4F1EA] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <FaYoutube className="text-red-400 text-sm" />
                <span>Visit YouTube Channel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;

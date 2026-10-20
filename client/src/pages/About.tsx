import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaLeaf,
  FaLocationDot,
  FaHandshake,
  FaAward,
  FaArrowRight,
  FaUsers,
  FaSeedling,
  FaWhatsapp,
} from 'react-icons/fa6';
import { usePageSEO } from '../hooks/usePageSEO';
import { breadcrumbSchema, webPageSchema } from '../seo/schemas';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

interface HubItem {
  slug: string;
  title: string;
  region: string;
  description: string;
  image: string;
  tag: string;
}

const regionalHubs: HubItem[] = [
  {
    slug: 'tribal-araku-products',
    title: 'Tribal Araku Valley',
    region: 'Eastern Ghats, Andhra Pradesh',
    description: 'High-altitude shade-grown Arabica coffee, raw wild cliff honey, and indigenous tribal forest harvests.',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440012/urvaa/categories/tribal-araku-products.png',
    tag: 'TRIBAL COOPERATIVES',
  },
  {
    slug: 'mana-godavari-foods',
    title: 'Mana Godavari Foods',
    region: 'Godavari Delta, Andhra Pradesh',
    description: 'Artisanal Atreyapuram Bellam Putharekulu, pure chemical-free palm jaggery, and ancestral sweets.',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440015/urvaa/categories/mana-godavari-foods.png',
    tag: 'HERITAGE RECIPES',
  },
  {
    slug: 'swadesi-handlooms',
    title: 'Swadesi Handlooms',
    region: 'Uppada & Coastal Handloom Belts',
    description: 'Pure cotton sarees, natural vegetable dye fabrics, and breathable weaves hand-spun on traditional looms.',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440020/urvaa/categories/swadesi-handlooms.png',
    tag: 'GENERATIONAL WEAVERS',
  },
  {
    slug: 'kadiyam-plants',
    title: 'Kadiyam Nurseries',
    region: 'Kadiyam Green Belt, Andhra Pradesh',
    description: 'Renowned fragrant Royal Jasmine plants, exotic floral varieties, and lush fruit-bearing native saplings.',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440023/urvaa/categories/kadiyam-plants.png',
    tag: 'ALL-NATURAL GREENERY',
  },
  {
    slug: 'eco-friendly-products',
    title: 'Eco-Friendly Tableware',
    region: 'Coastal Agro-Rural Collectives',
    description: 'Naturally shed Areca palm leaf dining plates and artisanal sustainable tableware with zero plastic.',
    image: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1792440018/urvaa/categories/eco-friendly-products.png',
    tag: 'ZERO PLASTIC',
  },
];

const pillars = [
  {
    icon: <FaLocationDot className="h-5 w-5 text-[#8B5A2B]" />,
    title: 'Geographical Authenticity',
    description: 'Every product is sourced strictly from its native geographical epicenter, celebrating authentic regional terroir and ancestral recipes.',
  },
  {
    icon: <FaHandshake className="h-5 w-5 text-[#8B5A2B]" />,
    title: 'Direct Producer Empowerment',
    description: 'We partner directly with village self-help groups, tribal societies, and independent smallholders, ensuring fair prices with zero middlemen.',
  },
  {
    icon: <FaLeaf className="h-5 w-5 text-[#8B5A2B]" />,
    title: 'Pure & Chemical-Free',
    description: 'No synthetic additives, artificial flavors, or compromises. Traditional small-batch preparations honoring natural health.',
  },
  {
    icon: <FaAward className="h-5 w-5 text-[#8B5A2B]" />,
    title: 'Specialized Protective Packaging',
    description: 'Custom engineered protective packing suited for fragile glassware, fresh heritage sweets, and live rooted nursery plants.',
  },
];

const artisanSnaps = [
  {
    url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905003/urvaa/images/community/community-12.jpg',
    title: 'Handloom Weaver',
    subtitle: 'Preserving ancestral Uppada warp & weft',
  },
  {
    url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904996/urvaa/images/community/community-03.jpg',
    title: 'Araku Coffee Sorting',
    subtitle: 'Hand-picked by indigenous tribal growers',
  },
  {
    url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905004/urvaa/images/community/community-14.jpg',
    title: 'Artisan Wood & Tableware',
    subtitle: 'Hand-carved natural sustainable crafts',
  },
  {
    url: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905006/urvaa/images/community/community-16.jpg',
    title: 'Kadiyam Nursery Care',
    subtitle: 'Nurtured in fertile Godavari soil',
  },
];

const AboutPage: React.FC = () => {
  usePageSEO({
    title: 'Our Story | URVA — Delivering the Authentic Rural Aura',
    description:
      'Learn about URVA, a rural commerce movement celebrating One Village – One Product, direct artisan sourcing, and authentic regional goods.',
    canonical: '/about',
    keywords:
      'URVA story, rural products India, regional products, One Village One Product, Araku tribal coffee, Godavari putharekulu, Indian handlooms, Kadiyam nursery',
    schema: [
      webPageSchema({
        url: '/about',
        name: 'Our Story | URVA — Delivering the Authentic Rural Aura',
        description:
          'Learn about URVA, a rural commerce movement celebrating One Village – One Product, direct artisan sourcing, and authentic regional goods.',
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: 'Our Story', url: '/about' },
        ],
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Our Story', url: '/about' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#5A3825] font-sans">
      {/* ─── Breadcrumb Navigation ─── */}
      <div className="border-b border-[#E2D9CC] bg-[#FAF8F4] px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center gap-2 text-xs text-[#8C7364]">
          <Link to="/" className="hover:text-[#5A3825] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#5A3825]">Our Story</span>
        </div>
      </div>

      {/* ─── 1. One Village – One Product Philosophy ─── */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block">
              OUR MISSION & PHILOSOPHY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#5A3825] leading-snug">
              A Product is Also a Place, a Hand, and a Generation of Skill
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#5A3825]/90">
              In a world flooded with industrialized, anonymous commodities, URVA was founded on a simple truth: the finest goods carry the unmistakable identity of their soil and the people who nurture them.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#5A3825]/90">
              Inspired by the <em>One Village – One Product</em> ethos, we discover distinct regional specialties: shade-grown Arabica coffee nurtured by indigenous Araku tribes, paper-thin Bellam Putharekulu rolled by Godavari delta artisans, hand-spun breathable cotton sarees from master weavers, and vibrant live jasmine plants from the legendary Kadiyam nurseries.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] p-3.5 shadow-2xs">
                <FaUsers className="text-[#8B5A2B] text-base mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-xs text-[#5A3825]">Empowering Rural Makers</h4>
                  <p className="text-[11px] text-[#8C7364] mt-0.5">Fair prices and steady livelihood for rural families.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] p-3.5 shadow-2xs">
                <FaSeedling className="text-[#8B5A2B] text-base mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-xs text-[#5A3825]">Zero Middlemen</h4>
                  <p className="text-[11px] text-[#8C7364] mt-0.5">Farm & loom straight to your dining and living space.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2D9CC] bg-[#FAF8F4] p-2 shadow-sm group">
              <img
                src={optimizeCloudinaryUrl(
                  'https://res.cloudinary.com/idi6k3ue/image/upload/v1791905011/urvaa/images/hero/rooted-in-rural-life.jpg',
                  800
                )}
                alt="Rural artisans and farmers at work with URVA"
                className="w-full h-80 sm:h-96 object-cover rounded-xl transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/80 backdrop-blur-xs p-3 text-white border border-white/10 shadow-lg">
                <p className="text-[11px] font-semibold tracking-wide text-[#CCA887] uppercase">Preserving Living Heritage</p>
                <p className="text-xs text-neutral-200 mt-0.5">Empowering over 500+ rural artisans, weavers, and growers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Core Values / What Guides URVA ─── */}
      <section className="border-y border-[#E2D9CC] bg-[#FAF8F4] py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5A3825]">
              What Guides the URVA Experience
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8C7364] max-w-lg mx-auto">
              Every package dispatched honors tradition, purity, and environmental responsibility.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-[#E2D9CC] bg-[#F4F1EA] p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:shadow-sm hover:border-[#8B5A2B]/40"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] border border-[#E2D9CC] shadow-2xs">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#5A3825]">{pillar.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8C7364]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Regional Hubs Visual Exploration ─── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
            REGIONAL SPECIALTIES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5A3825]">
            Discover India by Origin
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#8C7364]">
            Explore curated collections directly associated with renowned regional craft clusters.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionalHubs.map((hub) => (
            <Link
              key={hub.slug}
              to={`/category/${hub.slug}`}
              className="group flex flex-col rounded-2xl border border-[#E2D9CC] bg-[#FAF8F4] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:border-[#8B5A2B]"
            >
              {/* Category Visual */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F4F1EA]">
                <img
                  src={optimizeCloudinaryUrl(hub.image, 500)}
                  alt={hub.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
                  }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#CCA887] shadow-xs">
                  {hub.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-[#8B5A2B] uppercase tracking-wider block">
                    {hub.region}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#5A3825] group-hover:text-[#8B5A2B] transition-colors mt-0.5">
                    {hub.title}
                  </h3>
                  <p className="text-xs text-[#8C7364] mt-1.5 leading-relaxed">
                    {hub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2D9CC] flex items-center justify-between text-xs font-semibold text-[#8B5A2B]">
                  <span>Explore Collection</span>
                  <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 5. Faces of the URVA Community Gallery ─── */}
      <section className="border-t border-[#E2D9CC] bg-[#FAF8F4] py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center max-w-xl mx-auto">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B5A2B] block mb-1">
              FIELD PHOTOGRAPHY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A3825]">
              Moments from the Ground
            </h2>
            <p className="mt-1.5 text-xs text-[#8C7364]">
              Glimpses of daily life, handcrafts, and harvesting across our artisan partner communities.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {artisanSnaps.map((snap, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-[#E2D9CC] bg-[#F4F1EA] shadow-xs"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(snap.url, 400)}
                    alt={snap.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 bg-[#FAF8F4] border-t border-[#E2D9CC]">
                  <p className="text-xs font-bold text-[#5A3825] truncate">{snap.title}</p>
                  <p className="text-[10px] text-[#8C7364] truncate mt-0.5">{snap.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Clean Call-To-Action Footer Section ─── */}
      <section className="bg-[#3F2618] text-[#F4F1EA] py-14 px-4 sm:px-6 text-center border-t border-[#5A3825]">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Bring the Authentic Rural Aura Home
          </h2>
          <p className="text-xs sm:text-sm text-[#E2D9CC] font-normal leading-relaxed">
            Experience wholesome farm harvests, handcrafted textiles, and heritage sweets delivered directly to your doorstep anywhere in India.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#8B5A2B] hover:bg-[#A06935] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow"
            >
              <span>Explore All Products</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
            <a
              href="https://wa.me/919494957576"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F4] hover:bg-white text-[#5A3825] border border-[#E2D9CC] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
            >
              <FaWhatsapp className="text-emerald-600 text-sm" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

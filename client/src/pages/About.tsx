import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaHeart, FaLeaf, FaPeopleGroup } from 'react-icons/fa6';
import { usePageSEO } from '../hooks/usePageSEO';
import { breadcrumbSchema, webPageSchema } from '../seo/schemas';
import { urvaaCategories } from '../data/categories';

const pillars = [
  {
    icon: <FaGlobe className="h-6 w-6 text-[#28533A]" />,
    title: 'Regional discovery',
    description: 'Explore products through the places, traditions, and specialties that shape them.',
  },
  {
    icon: <FaPeopleGroup className="h-6 w-6 text-[#28533A]" />,
    title: 'People-first commerce',
    description: 'Make room for the stories of makers, growers, and producer communities.',
  },
  {
    icon: <FaLeaf className="h-6 w-6 text-[#28533A]" />,
    title: 'Thoughtful choices',
    description: 'Find regional goods and practical alternatives with clear product information.',
  },
  {
    icon: <FaHeart className="h-6 w-6 text-[#28533A]" />,
    title: 'A marketplace with meaning',
    description: 'Bring products from diverse rural traditions together in one convenient place.',
  },
];

const AboutPage: React.FC = () => {
  usePageSEO({
    title: 'Our Story | URVA — Delivering the Authentic Rural Aura',
    description:
      'Meet URVA, a rural-products commerce brand built around One Village – One Product and the regional stories behind India’s goods.',
    canonical: '/about',
    keywords: 'URVA, rural products India, regional products, One Village One Product, Indian artisans, regional foods, handlooms, plants',
    schema: [
      webPageSchema({
        url: '/about',
        name: 'Our Story | URVA',
        description: 'Learn about URVA’s vision for regional discovery and rural commerce.',
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
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      <section className="bg-[#111111] px-4 py-16 text-white sm:px-6 sm:py-20 border-b border-neutral-800">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-neutral-700 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300">
            Our story
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
            Delivering the Authentic Rural Aura
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-neutral-400">
            URVA is a rural-products commerce brand built around a simple idea: every region has something distinctive worth discovering.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">One Village – One Product</p>
          <h2 className="mt-2 font-sans text-2xl sm:text-3xl font-semibold text-[#111111]">
            A product is also a place, a skill, and a story.
          </h2>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-600">
            URVA aims to make regional products easier to discover while helping rural producers reach customers beyond their immediate communities. Our vision is to bring traditional foods, indigenous craftsmanship, handlooms, plants, and considered everyday goods into one thoughtful shopping experience.
          </p>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-600">
            As the collection grows, we want product pages to make origin, materials, ingredients, and maker information clear—so customers can shop with context and confidence.
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png"
          alt="URVA — Delivering the Authentic Rural Aura"
          className="mx-auto w-40 rounded-2xl bg-white p-3 shadow-xs border border-neutral-200 sm:w-48"
        />
      </section>

      <section className="border-y border-neutral-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[#111111]">What guides URVA</h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              A marketplace shaped by authenticity, regional discovery, and convenience.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-xl border border-neutral-200 bg-[#FAFAFA] p-6 shadow-xs">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-neutral-200 shadow-2xs">
                  {pillar.icon}
                </div>
                <h3 className="font-sans text-base font-semibold text-[#111111]">{pillar.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">A growing collection</p>
          <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-semibold text-[#111111]">Five ways to discover regional India</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(urvaaCategories).map(([slug, category]) => (
            <article key={slug} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-sans text-base font-semibold text-[#111111]">{category.title}</h3>
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-neutral-600">
                {category.products.map((product) => (
                  <li key={product} className="flex gap-2">
                    <span aria-hidden="true" className="text-black">•</span>
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 border-t border-neutral-200 pt-3 text-xs leading-relaxed text-neutral-500">
                <p><span className="font-semibold text-[#111111]">Minimum order:</span> {category.minimumOrder}</p>
                {'bulkPricing' in category && (
                  <p><span className="font-semibold text-[#111111]">Bulk pricing:</span> {category.bulkPricing}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] px-4 py-12 text-center text-white border-t border-neutral-800">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-sans text-2xl font-semibold sm:text-3xl">Let’s bring more regional stories into view.</h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Browse the collection or get in touch with questions about products and partnerships.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-neutral-200"
          >
            Explore products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

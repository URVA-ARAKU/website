import React from 'react';

const highlights = [
  { icon: '☕', title: 'Tribal Araku Products', desc: 'Explore regional coffee, honey, and more' },
  { icon: '🥮', title: 'Mana Godavari Foods', desc: 'Discover traditional regional flavors' },
  { icon: '🌱', title: 'Eco-Friendly Products', desc: 'Find thoughtful everyday alternatives' },
  { icon: '🧵', title: 'Swadesi Handlooms', desc: 'Celebrate regional weaving traditions' },
  { icon: '🪴', title: 'Kadiyam Plants', desc: 'Bring greenery into your space' },
];

const Banner: React.FC = () => {
  const marqueeList = [...highlights, ...highlights];

  return (
    <section className="hidden w-full overflow-hidden border-y border-white/10 bg-[#234331] py-4 shadow-inner md:block">
      <div className="relative flex w-full overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {marqueeList.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 backdrop-blur-sm">
              <span aria-hidden="true" className="flex-shrink-0 text-2xl">{item.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold leading-tight tracking-wide text-white">{item.title}</span>
                <span className="mt-0.5 text-[11px] text-white/75">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;

import React from 'react';

const marketplaceSteps = [
  ['Discover the origin', 'Find products connected to regional specialties and production hubs.'],
  ['Meet the makers', 'Learn about the people and communities behind the products.'],
  ['Explore the details', 'Review product information, pricing, and available sourcing details.'],
  ['Bring it home', 'Order online and follow your purchase through the customer account.'],
];

const ProductInfographic: React.FC = () => (
  <section className="my-12 w-full overflow-hidden rounded-3xl border border-[#E2D9CC] bg-[#FAF8F4] shadow-md font-sans">
    <div className="bg-[#5A3825] px-5 py-7 text-center text-[#FAF8F4] sm:px-8">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl">The URVA Way</h2>
      <p className="mt-2 text-xs font-semibold tracking-wider text-[#E2D9CC] uppercase">One Village – One Product</p>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
      {marketplaceSteps.map(([title, description], index) => (
        <article key={title} className="rounded-2xl border border-[#E2D9CC] bg-[#F4F1EA] p-5 shadow-2xs">
          <span className="text-xs font-bold tracking-widest text-[#8B5A2B] font-mono">0{index + 1}</span>
          <h3 className="mt-2 font-serif text-base font-bold text-[#5A3825]">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#5A3825]/75">{description}</p>
        </article>
      ))}
    </div>
  </section>
);

export default ProductInfographic;

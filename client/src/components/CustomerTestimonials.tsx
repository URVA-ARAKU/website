import React, { useMemo } from 'react';
import { FaStar } from 'react-icons/fa';
import { useGetReviewsQuery } from '../redux/api/review.api';

const CustomerTestimonials: React.FC = () => {
  const { data } = useGetReviewsQuery();
  const reviews = useMemo(() => data?.reviews || [], [data]);

  const marqueeItems = useMemo(() => {
    if (reviews.length === 0) return [];
    if (reviews.length >= 6) return reviews;
    const repeated = [...reviews];
    while (repeated.length < 6) {
      repeated.push(...reviews);
    }
    return repeated;
  }, [reviews]);

  // Zero mock data: Do not render mock reviews if no real customer reviews exist
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="customer-testimonials-heading"
      className="w-full overflow-hidden border-t border-[#E2D9CC] bg-[#F4F1EA] py-12 md:py-16"
    >
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:mb-10 sm:px-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C7364] block mb-1.5">
          VOICES OF URVA
        </span>
        <h2
          id="customer-testimonials-heading"
          className="font-sans text-2xl font-semibold tracking-tight text-[#5A3825] sm:text-3xl font-serif"
        >
          Loved by Customers Across India
        </h2>
        <p className="mt-2 text-xs md:text-sm text-[#8C7364] max-w-lg mx-auto">
          Real experiences and honest feedback from patrons cherishing genuine rural craftsmanship and regional flavors.
        </p>
      </div>

      <div className="overflow-hidden">
        <div className="animate-marquee flex">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-3 pr-3 sm:gap-5 sm:pr-5"
            >
              {marqueeItems.map((rev, index) => (
                <article
                  key={`${copy}-${rev.id}-${index}`}
                  className="flex w-[min(280px,calc(100vw-2rem))] shrink-0 flex-col justify-between rounded-2xl border border-[#E2D9CC] bg-[#FAF8F4] p-5 shadow-xs transition-shadow hover:shadow-sm sm:w-[320px] md:w-[350px]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="truncate inline-block rounded-xs bg-[#5A3825] text-[#F4F1EA] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                        {rev.productName || 'Verified Purchase'}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs shrink-0">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h4 className="text-xs font-bold text-[#5A3825] font-serif mb-1 line-clamp-1">
                        {rev.title}
                      </h4>
                    )}

                    <p className="line-clamp-3 w-full whitespace-normal break-words text-xs italic leading-relaxed text-[#5A3825]">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 flex min-w-0 items-center gap-3 border-t border-[#E2D9CC] pt-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-[#5A3825] text-[#FAF8F4] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {rev.authorName ? rev.authorName[0] : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold leading-snug text-[#5A3825]">
                        {rev.authorName}
                      </p>
                      <p className="truncate text-[10px] text-[#8C7364]">
                        {rev.authorLocation || 'Verified Indian Patron'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;

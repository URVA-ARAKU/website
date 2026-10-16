import React from 'react';

const customerReviews = [
  {
    name: 'Amulya Devi',
    location: 'Rajahmundry, Andhra Pradesh',
    metric: 'Regional Foods',
    review: 'Loved exploring Andhra foods. The wood-pressed groundnut oil details were truly authentic.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914048/urvaa/avatars/Amulya.webp',
  },
  {
    name: 'Ajay Reddy',
    location: 'Vijayawada, Andhra Pradesh',
    metric: 'Eco-Friendly Finds',
    review: 'The areca leaf plates are perfect for family get-togethers. Very sturdy and eco-friendly.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914049/urvaa/avatars/Ajay_Reddy.webp',
  },
  {
    name: 'Shridhar Reddy',
    location: 'Kadiyam, Andhra Pradesh',
    metric: 'Garden & Nursery',
    review: 'Happy to find Kadiyam plants alongside other local specialties delivered safely.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914050/urvaa/avatars/Shridhar_Reddy.webp',
  },
  {
    name: 'Bhargavi Reddy',
    location: 'Visakhapatnam, Andhra Pradesh',
    metric: 'Everyday Essentials',
    review: 'The neem wooden spoons are useful for everyday cooking and gifting. Lovely finish.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914051/urvaa/avatars/Bhargavi.webp',
  },
  {
    name: 'Avinash Varma',
    location: 'Araku Valley, Andhra Pradesh',
    metric: 'Regional Discoveries',
    review: 'I love discovering authentic rural products and stories from tribal communities.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914053/urvaa/avatars/Avinash.webp',
  },
  {
    name: 'Harshini Katta',
    location: 'Kakinada, Andhra Pradesh',
    metric: 'Regional Foods',
    review: 'The regional foods are easy to browse, with authentic taste and clear farm details.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914054/urvaa/avatars/Harshini_Katta.webp',
  },
  {
    name: 'Sai Kiran',
    location: 'Tirupati, Andhra Pradesh',
    metric: 'Thoughtful Gifting',
    review: 'A wonderful place to find regional handloom goods and meaningful festive gifts.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914055/urvaa/avatars/Sai_Kiran.webp',
  },
  {
    name: 'Suma Latha',
    location: 'Guntur, Andhra Pradesh',
    metric: 'Eco-Friendly Finds',
    review: 'Found great reusable kitchenware, and the clay and wood products are superb.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914056/urvaa/avatars/Suma.webp',
  },
  {
    name: 'Prafful Kumar',
    location: 'Eluru, Andhra Pradesh',
    metric: 'Local Products',
    review: 'I enjoy discovering genuine village products directly supporting our local artisans.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914056/urvaa/avatars/Prafful.webp',
  },
  {
    name: 'Pavani S.',
    location: 'Srikakulam, Andhra Pradesh',
    metric: 'Regional Discoveries',
    review: 'Regional specialties and eco-friendly everyday products delivered right to our doorstep.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914057/urvaa/avatars/Pavani.webp',
  },
  {
    name: 'Jalender Rao',
    location: 'Ongole, Andhra Pradesh',
    metric: 'Everyday Essentials',
    review: 'Loved finding pure wood pressed oils and rural kitchen essentials in one trusted store.',
    avatar: 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791914058/urvaa/avatars/Jalender.webp',
  },
];

const CustomerTestimonials: React.FC = () => (
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
        className="font-sans text-2xl font-semibold tracking-tight text-[#5A3825] sm:text-3xl"
      >
        Loved by Customers Across India
      </h2>
      <p className="mt-2 text-xs md:text-sm text-[#8C7364] max-w-lg mx-auto">
        Real experiences from patrons cherishing genuine rural craftsmanship and regional flavors.
      </p>
    </div>

    <div className="overflow-hidden">
      <div className="animate-marquee">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-3 pr-3 sm:gap-5 sm:pr-5"
          >
            {customerReviews.map((customer) => (
              <article
                key={`${copy}-${customer.name}`}
                className="flex w-[min(270px,calc(100vw-2rem))] shrink-0 flex-col justify-between rounded-xl border border-[#E2D9CC] bg-[#FAF8F4] p-5 shadow-xs transition-shadow hover:shadow-sm sm:w-[300px] md:w-[340px]"
              >
                <div className="min-w-0">
                  <span className="mb-3 inline-block rounded-xs bg-[#5A3825] text-[#F4F1EA] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                    {customer.metric}
                  </span>
                  <p className="line-clamp-3 w-full whitespace-normal break-words text-xs italic leading-relaxed text-[#5A3825] sm:text-sm">
                    “{customer.review}”
                  </p>
                </div>

                <div className="mt-4 flex min-w-0 items-center gap-3 border-t border-[#E2D9CC] pt-3">
                  <img
                    src={customer.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 rounded-full border border-[#E2D9CC] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold leading-snug text-[#5A3825]">
                      {customer.name}
                    </p>
                    <p className="truncate text-[10px] text-[#8C7364]">
                      {customer.location}
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

export default CustomerTestimonials;

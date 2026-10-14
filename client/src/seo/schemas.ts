/**
 * Centralised JSON-LD schema builders for URVA.
 * Every function returns a plain object ready for JSON.stringify.
 */

const BASE = 'https://urvaswadeshi.in';
const ORG_ID = `${BASE}/#organization`;

// BREADCRUMB
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.url}`,
    })),
  };
}

// WEBPAGE (generic)
export function webPageSchema({
  url,
  name,
  description,
  breadcrumb,
}: {
  url: string;
  name: string;
  description: string;
  breadcrumb?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}${url}`,
    url: `${BASE}${url}`,
    name,
    description,
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': ORG_ID },
    ...(breadcrumb
      ? { breadcrumb: breadcrumbSchema(breadcrumb) }
      : {}),
    inLanguage: 'en-IN',
  };
}

// PRODUCT
export function productSchema({
  name,
  description,
  image,
  url,
  sku,
  price,
  mrp,
  availability = 'https://schema.org/InStock',
}: {
  name: string;
  description: string;
  image: string;
  url: string;
  sku?: string;
  price: number;
  mrp?: number;
  availability?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url: `${BASE}${url}`,
    sku: sku || `URVA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'URVA',
    },
    manufacturer: {
      '@id': ORG_ID,
    },
    itemCondition: 'https://schema.org/NewCondition',
    category: 'Regional Products',
    keywords: 'regional products, rural products, India, URVA, swadeshi',
    offers: {
      '@type': 'Offer',
      url: `${BASE}${url}`,
      priceCurrency: 'INR',
      price: price.toFixed(2),
      priceValidUntil: '2027-12-31',
      ...(mrp ? { highPrice: mrp.toFixed(2) } : {}),
      availability,
      seller: { '@id': ORG_ID },
    },
  };
}

// COLLECTION PAGE / CATEGORY
export function collectionPageSchema({
  url,
  name,
  description,
  image,
  breadcrumb,
  numberOfItems,
}: {
  url: string;
  name: string;
  description: string;
  image?: string;
  breadcrumb?: { name: string; url: string }[];
  numberOfItems?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE}${url}`,
    url: `${BASE}${url}`,
    name,
    description,
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    ...(image ? { image } : {}),
    ...(numberOfItems !== undefined ? { numberOfItems } : {}),
    ...(breadcrumb ? { breadcrumb: breadcrumbSchema(breadcrumb) } : {}),
  };
}

// FAQ PAGE
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: { '@id': ORG_ID },
      },
    })),
  };
}

// ITEM LIST
export function itemListSchema(
  items: { name: string; url: string; position: number }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'URVA Products',
    url: `${BASE}/products`,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: `${BASE}${item.url}`,
    })),
  };
}

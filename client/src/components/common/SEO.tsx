import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  noindex?: boolean;
  ogType?: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

const DOMAIN = 'https://urvaa.in';

const DEFAULT_TITLE = 'URVA | Delivering the Authentic Rural Aura';
const DEFAULT_DESCRIPTION =
  'Discover regional products, traditional foods, indigenous craftsmanship, handlooms, plants, and thoughtful everyday goods with URVA.';
const DEFAULT_KEYWORDS =
  'URVA, rural products India, regional products, One Village One Product, Indian artisans, regional foods, handlooms, nursery plants';
const DEFAULT_OG_IMAGE = `${DOMAIN}https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png`;

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '',
  noindex = false,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}) => {
  const canonicalUrl = canonicalPath
    ? `${DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : DOMAIN;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="URVA" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

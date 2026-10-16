import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

const DEFAULT_TITLE = "PANA Institute Limited - Empowering Talent Across Sectors";
const DEFAULT_DESCRIPTION = "Africa's leading competency solution partner for Energy, Engineering, Oil & Gas, Digital Transformation, and Sustainability.";
const DEFAULT_KEYWORDS = "training, consulting, research, energy sector, digital transformation, leadership development, professional development, Nigeria, corporate training, Oil and Gas training, OGTAN, NCDMB";
const DOMAIN = "https://pana-institute.com";
const DEFAULT_IMAGE = `${DOMAIN}/logo.png`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  schema,
}) => {
  const fullTitle = title 
    ? (title.includes('PANA Institute') ? title : `${title} | PANA Institute`)
    : DEFAULT_TITLE;

  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : `${DOMAIN}${canonical}`)
    : undefined;

  const imageUrl = ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`;

  return (
    <Helmet>
      {/* Basic HTML Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="PANA Institute Limited" />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical Link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* OpenGraph */}
      <meta property="og:site_name" content="PANA Institute" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@panaacademy" />
      <meta name="twitter:creator" content="@panaacademy" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Optional Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

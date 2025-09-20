import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title = 'Tabib Life', 
  description = 'Plateforme de prise de rendez-vous médicaux en ligne au Maroc', 
  path = '/',
  type = 'website',
  image = '/logo.webp',
  noIndex = false
}) => {
  const siteUrl = 'https://tabib.life';
  const fullUrl = `${siteUrl}${path}`;
  const imageUrl = `${siteUrl}${image}`;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tabib Life",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.webp`,
    "sameAs": [
      "https://facebook.com/tabiblife",
      "https://instagram.com/tabiblife",
      "https://linkedin.com/company/tabiblife"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212 563308663",
      "contactType": "customer service",
      "areaServed": "MA",
      "availableLanguage": ["French", "Arabic"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Casablanca",
      "addressCountry": "Morocco"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": fullUrl
      }
    ]
  };

  // WebPage Schema
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": fullUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Tabib Life",
      "logo": `${siteUrl}/logo.webp`
    },
    "inLanguage": "fr",
    "datePublished": "2023-01-01T00:00:00Z",
    "dateModified": new Date().toISOString()
  };

  // LocalBusiness Schema (for healthcare service)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Tabib Life",
    "image": `${siteUrl}/logo.webp`,
    "url": siteUrl,
    "telephone": "+212 563308663",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Casablanca",
      "addressCountry": "Morocco"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.5731",
      "longitude": "-7.5898"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$$"
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title} | Tabib Life</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Tabib Life" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webpageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;

import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import { Organization, BreadcrumbList, Breadcrumb } from 'schema-dts';

export const SEO = ({ title = 'Tabib Life: Médecins et Rendez-vous En Ligne au Maroc', description = 'Prenez rendez-vous en ligne avec vos médecins au Maroc sur Tabib Life. Trouvez un dentiste, gynécologue, ophtalmologue et plus, en quelques clics.', path = '/', image = '/logo.png' }) => {
  const siteUrl = 'https://www.tabiblife.com';
  const fullUrl = `${siteUrl}${path}`;
  const imageUrl = `${siteUrl}${image}`;

  // Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tabib Life",
    "url": siteUrl,
    "logo": imageUrl,
    "sameAs": [
      "https://facebook.com/tabiblife",
      "https://instagram.com/tabiblife",
      "https://linkedin.com/company/tabiblife"
    ]
  };

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
        "name": "Médecins",
        "item": `${siteUrl}/medecins`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Rendez-vous",
        "item": `${siteUrl}/rendez-vous`
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="Tabib Life, médecin en ligne Maroc, rendez-vous médecin, dentiste Casablanca, gynécologue Maroc, ophtalmologue Marrakech, téléconsultation" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export const SEOProvider = ({ children }) => (
  <HelmetProvider>
    {children}
  </HelmetProvider>
);

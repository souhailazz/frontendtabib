import { Helmet } from 'react-helmet-async';

const PageMeta = ({ title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, ogType = 'website' }) => {
  const siteName = 'Tabib Life';
  const defaultImage = 'https://tabib.life/logo.webp';
  const defaultUrl = 'https://tabib.life';
  const currentDate = new Date().toISOString();

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={ogUrl || defaultUrl} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      <meta name="twitter:site" content="@tabiblife" />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content="Tabib Life" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Tabib Life`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl || defaultUrl} />

      {/* JSON-LD for this page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ogType === 'article' ? 'Article' : 'WebPage',
          "headline": ogTitle || title,
          "description": ogDescription || description,
          "image": ogImage || defaultImage,
          "url": ogUrl || defaultUrl,
          "datePublished": currentDate,
          "dateModified": currentDate,
          "author": {
            "@type": "Organization",
            "name": siteName
          }
        })}
      </script>
    </Helmet>
  );
};

export default PageMeta;

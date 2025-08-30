import { Helmet } from 'react-helmet-async';

const PageMeta = ({ title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, ogType = 'website' }) => {
  const siteName = 'Tabib Life';
  const defaultImage = 'https://tabib.life/logo.png';
  const defaultUrl = 'https://tabib.life';

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
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl || defaultUrl} />
    </Helmet>
  );
};

export default PageMeta;

/**
 * Checks if the browser supports WebP format
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=';
  });
};

/**
 * Returns the appropriate image source based on WebP support
 * @param {string} webpSrc - WebP image source
 * @param {string} fallbackSrc - Fallback image source (e.g., PNG)
 * @returns {Promise<string>} The appropriate image source URL
 */
export const getOptimalImageSource = async (webpSrc, fallbackSrc) => {
  const supportsWebP = await checkWebPSupport();
  return supportsWebP ? webpSrc : fallbackSrc;
};

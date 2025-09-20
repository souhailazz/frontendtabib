/**
 * Rate limiting utility for frontend signup attempts
 * This is a basic client-side implementation that should be supplemented with server-side limiting
 */

const RATE_LIMIT_KEY = 'signup_attempts';
const MAX_ATTEMPTS = 3;
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if the user has exceeded the rate limit
 * @returns {boolean} True if rate limit exceeded, false otherwise
 */
export function isRateLimited() {
  const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const now = Date.now();
  
  // Filter out attempts older than the time window
  const recentAttempts = attempts.filter(attempt => 
    now - attempt < TIME_WINDOW
  );
  
  // Update localStorage with recent attempts
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentAttempts));
  
  return recentAttempts.length >= MAX_ATTEMPTS;
}

/**
 * Record a signup attempt
 */
export function recordAttempt() {
  const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  attempts.push(Date.now());
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
}

/**
 * Get the time when the rate limit will reset
 * @returns {number|null} Timestamp when rate limit resets, or null if not rate limited
 */
export function getRateLimitResetTime() {
  const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const now = Date.now();
  
  if (attempts.length < MAX_ATTEMPTS) {
    return null;
  }
  
  // Find the oldest attempt within the time window
  const oldestAttempt = attempts[0];
  return oldestAttempt + TIME_WINDOW;
}

/**
 * Format time remaining in a human-readable format
 * @param {number} timestamp - Timestamp to format
 * @returns {string} Formatted time remaining
 */
export function formatTimeRemaining(timestamp) {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) {
    return '0 minutes';
  }
  
  const minutes = Math.ceil(diff / (1000 * 60));
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
import { useEffect, useState, useCallback } from 'react';
import './ScrollIndicator.css';

export const ScrollIndicator = ({ sections = [], activeSection = 0, onDotClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on component mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Throttle scroll handler
  const handleScroll = useCallback(() => {
    if (isMobile) {
      // On mobile, always show the indicator but with reduced opacity when not needed
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const shouldShow = scrollY < windowHeight * 0.8;
      document.querySelector('.scroll-indicator').classList.toggle('hidden', !shouldShow);
    }
  }, [isMobile]);
  
  // Add scroll listener with passive: true for better performance
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!sections || sections.length <= 1) return null;

  return (
    <div 
      className={`scroll-indicator ${!isVisible && 'hidden'}`}
      style={{
        position: 'fixed',
        right: isMobile ? '0.5rem' : '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0.6rem' : '1rem',
        padding: isMobile ? '0.6rem 0.3rem' : '1rem 0.5rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {sections.map((_, index) => (
        <button
          key={index}
          className={`scroll-dot ${activeSection === index ? 'active' : ''}`}
          onClick={() => onDotClick && onDotClick(index)}
          aria-label={`Go to section ${index + 1}`}
          style={{
            width: isMobile ? '8px' : '12px',
            height: isMobile ? '8px' : '12px',
            borderRadius: '50%',
            background: activeSection === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            outline: 'none',
            transform: activeSection === index ? 'scale(1.3)' : 'scale(1)',
            boxShadow: activeSection === index ? '0 0 0 2px var(--primary-color)' : 'none'
          }}
        >
          <span 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--primary-color)',
              opacity: activeSection === index ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </button>
      ))}
    </div>
  );
};

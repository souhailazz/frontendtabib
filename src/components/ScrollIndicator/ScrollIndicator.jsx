import { useEffect, useState } from 'react';
import './ScrollIndicator.css';

export const ScrollIndicator = ({ sections = [], activeSection = 0, onDotClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide indicator based on scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollY < windowHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || !sections || sections.length <= 1) return null;

  return (
    <div 
      className="scroll-indicator"
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem 0.5rem',
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
            width: '12px',
            height: '12px',
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

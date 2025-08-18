import { useEffect, useRef, forwardRef } from 'react';
import './ScrollContainer.css';

export const ScrollContainer = forwardRef(({ children, onSectionChange }, ref) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!onSectionChange) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const scrollPosition = container.scrollTop;

      // Find the active section
      let activeIndex = 0;
      container.childNodes.forEach((child, index) => {
        if (!child) return;
        const childRect = child.getBoundingClientRect();
        const childTop = childRect.top - containerTop;
        
        if (scrollPosition >= childTop) {
          activeIndex = index;
        }
      });

      onSectionChange(activeIndex);
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [onSectionChange]);

  return (
    <div 
      ref={node => {
        containerRef.current = node;
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      className="scroll-container"
    >
      {children}
    </div>
  );
});

export const ScrollSection = ({ children, className = '' }) => (
  <div className={`scroll-section ${className}`}>
    <div className="scroll-section-wrapper">
      {children}
    </div>
  </div>
);

export const ScrollContent = ({ children }) => (
  <div className="scroll-content-inner">
    {children}
  </div>
);
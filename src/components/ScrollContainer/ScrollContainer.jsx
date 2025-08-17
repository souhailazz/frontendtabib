import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, forwardRef } from 'react';
import './ScrollContainer.css';

export const ScrollContainer = forwardRef(({ children, onSectionChange }, ref) => {
  const containerRef = useRef();
  const sections = [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const scrollPosition = -containerTop + containerHeight * 0.4; // 40% from top

      // Find the active section
      let activeIndex = 0;
      sections.forEach((section, index) => {
        if (!section) return;
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top - containerTop;
        const sectionBottom = sectionTop + sectionRect.height;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          activeIndex = index;
        }
      });

      if (onSectionChange) {
        onSectionChange(activeIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onSectionChange, sections]);

  // Clone children to add refs
  const childrenWithRefs = children.map((child, index) => {
    return (
      <div 
        key={index} 
        ref={el => sections[index] = el}
        className="scroll-section"
      >
        {child}
      </div>
    );
  });

  return (
    <div 
      ref={(node) => {
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
      {childrenWithRefs}
    </div>
  );
});

// For backward compatibility
export const ScrollSection = ({ children, className = '' }) => {
  return (
    <div className={`scroll-section-wrapper ${className}`}>
      {children}
    </div>
  );
};

export const ScrollContent = ({ children }) => {
  return (
    <div className="scroll-content-inner">
      {children}
    </div>
  );
};
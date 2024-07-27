/* eslint-disable react/prop-types */
'use client'
import { useEffect, useRef } from 'react';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';



export function InfiniteScrollAnimation ({
  children,
  speed = 1,
  direction = 'left',
})  {
  const controls = useAnimation();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const calculateWidthAndAnimate = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const fullWidth = scrollContainer.scrollWidth / 2; // Adjust based on content duplication
        const initialX = direction === 'right' ? -fullWidth : 0;

        controls.start({
          x: direction === 'left' ? [-fullWidth, 0] : [0, -fullWidth],
          transition: {
            duration: fullWidth / 100 * speed,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }
        });

        if (direction === 'right') {
          // For initial position when direction is right
          controls.set({ x: initialX });
        }
      }
    };

    calculateWidthAndAnimate();
    // Debounce resize event to prevent excessive calls
    const handleResize = () => {
      setTimeout(calculateWidthAndAnimate, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [controls, speed, direction]);

  return (
    <div className="overflow-hidden relative" style={{ width: '100%', maxWidth: '100vw' }}>
       <LazyMotion features={domAnimation}>
      <m.div
        ref={scrollContainerRef}
        className="flex items-center gap-4 justify-start"
        animate={controls}
        style={{ display: 'flex', minWidth: '200%' }} // Ensure the container is always wider
      >
        {children}
        {children} 
      </m.div>
      </LazyMotion>
    </div>
  );
}

export default InfiniteScrollAnimation;

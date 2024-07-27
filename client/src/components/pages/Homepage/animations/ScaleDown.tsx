import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScaleDown = () => {
  const control = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate the visible fraction of the component
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        const totalHeight = rect.bottom - rect.top;
        const visibleFraction = Math.max(0, visibleHeight / totalHeight);

        // Calculate the scaling based on how centered the image is
        const scaleAmount = 1 - Math.min(visibleFraction * 0.5, 0.2); // Scales down up to 0.8

        // Console log to see the values


        // Apply scaling dynamically until the scrollY reaches 2100, then freeze at last scale
        if (scrollY >= 2300) {
          control.stop();  // Stop the animation at the current value
        } else {
          control.set({ scale: scaleAmount });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden" ref={ref}>
      <motion.div
        animate={control}
        className="absolute"
      >
        <img src="feature3.svg" alt="Feature" style={{ width: '100%', height: 'auto' }} />
      </motion.div>
    </div>
  );
};

export default ScaleDown;

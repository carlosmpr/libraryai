import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Flip3D = () => {
  const control = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate the visible fraction of the component
        const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        const totalHeight = rect.bottom - rect.top;
        const visibleFraction = Math.max(0, visibleHeight / totalHeight);

        // Calculate the rotation based on how centered the image is
        const flipRotation = 180 - (visibleFraction * 180);

        // Log the current scroll position
        console.log(`Scroll Y: ${scrollY}, Rotation: ${flipRotation}`);

        // Apply dynamic rotation until the scroll position reaches 3300
        if (scrollY >= 3500) {
          control.set({ rotateX: 0 }); // Reset rotation to 0 degrees
        } else {
          control.set({ rotateX: flipRotation });
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
        style={{
          perspective: '1000px', // Adjust perspective for 3D effect
          transformStyle: 'preserve-3d' // Needed for 3D transformations
        }}
      >
        <img src="feature1.svg" alt="Feature" style={{ width: '100%', height: 'auto', backfaceVisibility: 'hidden' }} />
      </motion.div>
    </div>
  );
};

export default Flip3D;

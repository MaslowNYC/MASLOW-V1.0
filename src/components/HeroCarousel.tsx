import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images: string[] = [
    '/hero-carousel/marble-sink-brass-faucet.png', // Image 4 - your favorite
    '/hero-carousel/marble-countertop-closeup.png', // Image 5
    '/hero-carousel/control-panel-blue-leds.png', // Image 1
    '/hero-carousel/changing-station-walnut.png', // Image 2
    '/hero-carousel/vanity-mirror-hollywood-lights.png', // Image 3
  ];

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % images.length);
    }, 8000); // 8 seconds per image

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            duration: 2,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt="Maslow Suite"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images: string[] = [
    // Drop images into /public/hero-carousel/ and add paths here
    '/hero-carousel/angola-gathering.jpg',
    '/hero-carousel/moroccan-riad.jpg',
    '/hero-carousel/japanese-garden.jpg',
    '/hero-carousel/bryant-park.jpg',
    '/hero-carousel/chinese-chess.jpg',
    '/hero-carousel/bissau-women.jpg',
    '/hero-carousel/tree-gathering.jpg',
    '/hero-carousel/angola-tree.jpg',
    '/hero-carousel/men-playing.jpg',
    '/hero-carousel/bryant-park-2.jpg', // filename fixed from byrant-park-2.jpg
    '/ivy.jpg', // fallback placeholder
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

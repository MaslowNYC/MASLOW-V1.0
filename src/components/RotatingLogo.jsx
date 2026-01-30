import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const logoVariations = [
  '/maslow-logos/maslow-universal.png',
  '/maslow-logos/maslow-cane.png',
  '/maslow-logos/maslow-wheelchair.png',
  '/maslow-logos/maslow-cape.png',
  '/maslow-logos/maslow-family.png',
  '/maslow-logos/maslow-body-positive.png',
  '/maslow-logos/maslow-cape-alt.png',
  '/maslow-logos/maslow-man.png',
  '/maslow-logos/maslow-woman.png'
];

const RotatingLogo = ({ className = "w-48 h-48" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logoVariations.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={logoVariations[currentIndex]}
          alt="Maslow Logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-contain rounded-lg"
        />
      </AnimatePresence>
    </div>
  );
};

export default RotatingLogo;

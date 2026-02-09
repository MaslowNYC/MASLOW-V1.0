import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const messages: string[] = [
  "Your Recharge Station",
  "Your Restroom",
  "Your Phone Booth",
  "Your Nursing Station",
  "Your Sanctuary",
  "Your Vanity Station",
  "Your Dressing Room",
  "Your Respite",
  "Your Refill Point",
  "Your Meeting Room"
];

const WelcomeMessages: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-24 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-serif text-[#3B5998]/80 text-center px-4"
        >
          {messages[currentIndex]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
};

export default WelcomeMessages;

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  className = '',
  distance = 55,
  once = true,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0, scale: 0.93 };
      case 'down':
        return { y: -distance, opacity: 0, scale: 0.93 };
      case 'left':
        return { x: distance, opacity: 0, scale: 0.93 };
      case 'right':
        return { x: -distance, opacity: 0, scale: 0.93 };
      case 'zoom':
        return { opacity: 0, scale: 0.85 };
      case 'none':
      default:
        return { opacity: 0, scale: 0.95 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1, scale: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1, scale: 1 };
      case 'zoom':
        return { opacity: 1, scale: 1 };
      case 'none':
      default:
        return { opacity: 1, scale: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getFinalPosition()}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

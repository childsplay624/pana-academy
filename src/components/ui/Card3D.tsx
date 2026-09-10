import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  depth?: number;
  glare?: boolean;
  glowColor?: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  intensity = 15,
  depth = 20,
  glare = true,
  glowColor = 'rgba(220, 38, 38, 0.15)', // PANA Red glow default
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high performance physics feel
  const mouseX = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 25 });

  // Transform raw position into rotation angles
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

  // Glare position calculation
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transform-gpu ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          translateZ: isHovered ? depth : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="relative w-full h-full rounded-2xl transition-shadow duration-300 preserve-3d"
      >
        {/* Glow backdrop behind the card */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Card Content Container */}
        <div className="relative w-full h-full rounded-2xl preserve-3d">
          {children}
        </div>

        {/* Dynamic Light Glare Overlay */}
        {glare && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{
              opacity: isHovered ? 0.35 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <motion.div
              className="w-[150%] h-[150%] -translate-x-[25%] -translate-y-[25%]"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Card3D;

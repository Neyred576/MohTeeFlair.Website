import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MagneticButton({ children, className = '', onClick, type = 'button', disabled = false, style = {}, href, to }) {
  const ref = useRef(null);
  
  // Create motion values for x and y
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth the motion values using springs for natural feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Magnetic pull strength (e.g. 0.3 means it follows the cursor 30% of the way)
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Determine which element to render
  let Component = motion.button;
  let props = { type, disabled };
  
  if (to) {
    Component = motion.create(Link);
    props = { to };
  } else if (href) {
    Component = motion.a;
    props = { href };
  }

  return (
    <Component
      ref={ref}
      {...props}
      className={`${className} magnetic-btn`}
      onClick={handleClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        ...style,
        x: smoothX,
        y: smoothY,
        position: 'relative',
        overflow: 'hidden'
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </span>
    </Component>
  );
}

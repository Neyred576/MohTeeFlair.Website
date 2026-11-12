import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartAnimationContext = createContext();

export function CartAnimationProvider({ children }) {
  const [animations, setAnimations] = useState([]);

  const triggerCartAnimation = useCallback((e, imgUrl) => {
    // Get starting coordinates from the click event
    const startX = e.clientX;
    const startY = e.clientY;

    // Find the cart icon in the navbar to get end coordinates
    const cartIcon = document.getElementById('nav-cart-btn');
    let endX = window.innerWidth - 50; // Fallback
    let endY = 20; // Fallback

    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    const id = Date.now();
    
    setAnimations(prev => [...prev, { id, startX, startY, endX, endY, imgUrl }]);

    // Remove animation after it completes
    setTimeout(() => {
      setAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 1000); // Wait for 1s total before cleanup
  }, []);

  return (
    <CartAnimationContext.Provider value={{ triggerCartAnimation }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          <AnimatePresence>
            {animations.map(anim => (
              <motion.div
                key={anim.id}
                initial={{
                  x: anim.startX - 25,
                  y: anim.startY - 25,
                  scale: 0.2,
                  opacity: 0,
                  rotate: 0
                }}
                animate={{
                  x: [anim.startX - 25, anim.endX - 25],
                  y: [anim.startY - 25, anim.startY - 100, anim.endY - 25], // Arc trajectory
                  scale: [0.2, 1, 0.2],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  times: [0, 0.5, 1] // Keyframes timing
                }}
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundImage: `url(${anim.imgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: '2px solid var(--rg-gold)'
                }}
              />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </CartAnimationContext.Provider>
  );
}

export const useCartAnimation = () => useContext(CartAnimationContext);

import React from 'react';
import { motion } from 'framer-motion';

export default function ProductSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          aspectRatio: '3/4', 
          background: 'rgba(255,255,255,0.03)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="shimmer-wave" />
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><div className="shimmer-wave" /></div>
        <div style={{ width: '80%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}><div className="shimmer-wave" /></div>
        <div style={{ width: '100%', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '4px' }}><div className="shimmer-wave" /></div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .shimmer-wave {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(185, 135, 90, 0.1), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite ease-in-out;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </motion.div>
  );
}

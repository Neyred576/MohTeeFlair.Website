import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ p, index, onClick }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const cardRef = useRef(null);

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, delay: index < 12 ? index * 0.04 : 0 }}
      className="product-card"
      onClick={() => {
        if (p.outOfStock) {
          alert("It's out of stock stocking soon");
        } else {
          onClick(p);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: 'pointer',
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
    >
      <div className="img-wrap" style={{ transform: "translateZ(30px)" }}>
        <img src={p.img} alt={p.name} loading="lazy" />
        
        {/* Wishlist Heart Overlay */}
        <button 
          className={`product-card-heart ${isInWishlist(p.id) ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(p.id);
          }}
          aria-label={isInWishlist(p.id) ? "Remove from wishlist" : "Add to wishlist"}
          style={{ transform: "translateZ(50px)" }} // Pop out heart more
        >
          <Heart 
            size={20} 
            fill={isInWishlist(p.id) ? "var(--rg-gold)" : "none"} 
            color={isInWishlist(p.id) ? "var(--rg-gold)" : "#fff"} 
          />
        </button>

        <div className="card-overlay" style={{ transform: "translateZ(40px)" }}>
          <span className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.72rem', pointerEvents: 'none' }}>
            {p.outOfStock ? 'Out of Stock' : p.comingSoon ? 'Coming Soon' : 'Quick View'}
          </span>
        </div>
      </div>
      <div className="card-body" style={{ transform: "translateZ(20px)" }}>
        <p className="card-category">{p.category}</p>
        <p className="card-name">{p.name}</p>
        <p className="products-card-desc">{p.desc}</p>
        <div className="products-card-footer">
          <p className="card-price">
            {p.outOfStock ? 'OUT OF STOCK' : p.comingSoon ? 'COMING SOON' : `AED ${parseFloat(p.price).toFixed(2)}`}
          </p>
          <div className="products-card-stars">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} size={12} fill="var(--rg-gold)" color="var(--rg-gold)" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

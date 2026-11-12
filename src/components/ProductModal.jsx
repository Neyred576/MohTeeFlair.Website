import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCartAnimation } from '../context/CartAnimationContext';
import './ProductModal.css';

export default function ProductModal({ product, isOpen, onClose, customAddToCart }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { triggerCartAnimation } = useCartAnimation();
  const [added, setAdded] = useState(false);
  const [selectedShade, setSelectedShade] = useState('');
  const [shadeError, setShadeError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [cachedProduct, setCachedProduct] = useState(product);

  // Reset state when a new product is opened, and cache it for the exit animation
  React.useEffect(() => {
    if (product) {
      setCachedProduct(product);
      setSelectedShade('');
      setShadeError(false);
      setAdded(false);
      setWishlisted(isInWishlist(product.id));
    }
  }, [product]);

  const displayProduct = product || cachedProduct;

  if (!displayProduct) return null;

  // Normalize shades — older Firestore docs may not have this field at all
  const shadesArray = Array.isArray(displayProduct.shades) ? displayProduct.shades : [];
  const hasShades = shadesArray.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  const handleAdd = (e) => {
    if (hasShades && !selectedShade) {
      setShadeError(true);
      return;
    }
    
    setShadeError(false);
    const productToAdd = hasShades ? { ...displayProduct, selectedShade } : displayProduct;

    if (customAddToCart) {
      customAddToCart(productToAdd);
    } else {
      addToCart(productToAdd);
    }
    
    triggerCartAnimation(e, productToAdd.img);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  // Use a portal so the modal always renders at document.body level,
  // bypassing any overflow or stacking context issues from parent elements.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="product-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="product-modal"
              layoutId={`product-card-${displayProduct.id}`}
              transition={{ type: "spring", stiffness: 250, damping: 28 }}
            >
              <button className="product-modal-close" onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
              <div className="product-modal-content">
                <div className="product-modal-img">
                  <motion.img 
                    layoutId={`product-image-${displayProduct.id}`}
                    src={displayProduct.img} 
                    alt={displayProduct.name}
                    transition={{ type: "spring", stiffness: 250, damping: 28 }}
                  />
                </div>
                <motion.div 
                  className="product-modal-info"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.span 
                    className="product-modal-category"
                    layoutId={`product-category-${displayProduct.id}`}
                    transition={{ type: "spring", stiffness: 250, damping: 28 }}
                  >
                    {displayProduct.category}
                  </motion.span>
                  
                  <div className="product-modal-title-row">
                    <motion.h2 
                      className="product-modal-title"
                      layoutId={`product-name-${displayProduct.id}`}
                      transition={{ type: "spring", stiffness: 250, damping: 28 }}
                    >
                      {displayProduct.name}
                    </motion.h2>
                    <motion.button 
                      variants={itemVariants}
                      className={`product-modal-wishlist-btn ${isInWishlist(displayProduct.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(displayProduct.id)}
                      aria-label={isInWishlist(displayProduct.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart 
                        size={20} 
                        fill={isInWishlist(displayProduct.id) ? 'var(--rg-gold)' : 'none'} 
                        color={isInWishlist(displayProduct.id) ? 'var(--rg-gold)' : 'rgba(255,255,255,0.5)'} 
                      />
                    </motion.button>
                  </div>
                  
                  <motion.div variants={itemVariants} className="product-modal-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--rg-gold)" color="var(--rg-gold)" />
                    ))}
                  </motion.div>
                  
                  <motion.p variants={itemVariants} className="product-modal-price">
                    {displayProduct.outOfStock ? 'OUT OF STOCK' : displayProduct.comingSoon ? 'COMING SOON' : `AED ${parseFloat(displayProduct.price).toFixed(2)}`}
                  </motion.p>
                  
                  <motion.p variants={itemVariants} className="product-modal-desc">
                    {displayProduct.desc || 'Experience luxury beauty with our premium collection. Expertly crafted for the perfect finish.'}
                  </motion.p>

                  {hasShades && (
                    <motion.div variants={itemVariants} className="product-modal-shades">
                      <label htmlFor={`shade-select-${displayProduct.id}`} className="product-modal-shades-label">
                        Select Shade <span style={{ color: 'var(--rg-gold)' }}>*</span>
                      </label>
                      <select 
                        id={`shade-select-${displayProduct.id}`}
                        className={`product-modal-shades-select ${shadeError ? 'product-modal-shades-select--error' : ''}`}
                        value={selectedShade}
                        onChange={e => {
                          setSelectedShade(e.target.value);
                          setShadeError(false);
                        }}
                      >
                        <option value="" disabled>Choose your shade</option>
                        {shadesArray.map((shade, idx) => (
                          <option key={idx} value={shade}>{shade}</option>
                        ))}
                      </select>
                      {shadeError && <p className="product-modal-shades-error">Please select a shade</p>}
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    {displayProduct.outOfStock ? (
                      <button className="btn btn-ghost product-modal-btn" disabled style={{ opacity: 0.7 }}>
                        Out of Stock
                      </button>
                    ) : displayProduct.comingSoon ? (
                      <button className="btn btn-ghost product-modal-btn" disabled style={{ opacity: 0.7 }}>
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        className={`btn ${added ? 'btn-ghost' : 'btn-primary'} product-modal-btn`}
                        onClick={handleAdd}
                      >
                        <ShoppingBag size={18} />
                        {added ? 'Added to Cart' : 'Add to Cart'}
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

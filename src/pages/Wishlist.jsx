import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import ProductModal from '../components/ProductModal';
import './Wishlist.css';

export default function Wishlist() {
  const { products, loading } = useProducts();
  const { wishlistItems, toggleWishlist } = useWishlist();
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  const wishlistProducts = products.filter(p => wishlistItems.includes(p.id));

  return (
    <div className="wishlist-page">
      <div className="container">
        <motion.div
          className="wishlist-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-lg">Your Wishlist</h1>
          <p className="subtitle">Curated items you love</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Loading...</div>
        ) : wishlistProducts.length === 0 ? (
          <motion.div 
            className="wishlist-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HeartCrack size={60} strokeWidth={1} style={{ marginBottom: '1rem', color: 'var(--rg-gold)' }} />
            <h2 className="heading-md">Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Save items you love here to easily find them later.</p>
            <Link to="/products" className="btn btn-primary">Discover Products</Link>
          </motion.div>
        ) : (
          <motion.div layout className="products-grid">
            <AnimatePresence mode="popLayout">
              {wishlistProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  layoutId={`product-card-${p.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i < 12 ? i * 0.04 : 0 }}
                  className="product-card"
                  onClick={() => {
                    if (p.outOfStock) {
                      alert("It's out of stock stocking soon");
                    } else {
                      setSelectedProduct(p);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="img-wrap">
                    <motion.img 
                      layoutId={`product-image-${p.id}`}
                      src={p.img} 
                      alt={p.name} 
                      loading="lazy" 
                    />
                    
                    {/* Wishlist Heart Overlay */}
                    <button 
                      className="product-card-heart active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={20} fill="var(--rg-gold)" color="var(--rg-gold)" />
                    </button>

                    <div className="card-overlay">
                      <span className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.72rem', pointerEvents: 'none' }}>
                        {p.outOfStock ? 'Out of Stock' : p.comingSoon ? 'Coming Soon' : 'Quick View'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <motion.p layoutId={`product-category-${p.id}`} className="card-category">{p.category}</motion.p>
                    <motion.p layoutId={`product-name-${p.id}`} className="card-name">{p.name}</motion.p>
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
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

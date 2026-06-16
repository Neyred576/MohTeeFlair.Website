import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Sparkles, Tag } from 'lucide-react';
import { useGlowAndSave } from '../context/GlowAndSaveContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import CountdownTimer from '../components/CountdownTimer';
import { Link } from 'react-router-dom';
import './GlowAndSave.css';

export default function GlowAndSave() {
  const { glowSettings, campaigns, bundles, vipSettings, loading } = useGlowAndSave();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (loading) return <div className="glow-inactive">Loading Glow & Save...</div>;

  if (!glowSettings.active) {
    return (
      <div className="glow-inactive">
        <h1 className="heading-lg">Check Back Later!</h1>
        <p>There are no active Glow & Save events right now.</p>
        <Link to="/products" className="btn btn-primary mt-6">Shop Normal Collection</Link>
      </div>
    );
  }

  // Find active campaign (simple logic: first active or closest one)
  const activeCampaign = campaigns.find(c => c.active) || null;
  const isVipActive = vipSettings?.active;
  const userIsVip = user?.isVIP;

  return (
    <div className="glow-page">
      <div className="glow-hero">
        <div className="glow-hero__glow" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="heading-xl gradient-text">{glowSettings.title || 'Glow & Save'}</h1>
          <p className="glow-hero__sub">{glowSettings.subtitle}</p>
        </motion.div>
      </div>

      <div className="container">
        {activeCampaign && activeCampaign.targetDate && (
          <CountdownTimer targetDate={activeCampaign.targetDate} label={activeCampaign.timerLabel || "Sale Ends In"} />
        )}

        {isVipActive && !userIsVip && (
          <div className="vip-locked-banner">
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={18} color="var(--rg-gold)" /> VIP Exclusive Access Activated</h3>
              <p>Join VIP to unlock early access and exclusive bundles.</p>
            </div>
            <Link to="/signup" className="btn btn-primary">Join VIP</Link>
          </div>
        )}

        <div className="glow-sections">
          {(glowSettings.discountedProducts && glowSettings.discountedProducts.length > 0) && (
            <div style={{ marginBottom: 60 }}>
              <div className="glow-section-title">
                <Tag size={24} color="var(--rg-gold)" />
                <h2 className="heading-lg">Products on Discount</h2>
              </div>
              <div className="bundles-grid">
                {glowSettings.discountedProducts.map(dp => {
                  const product = (products || []).find(p => p.id === dp.productId);
                  if (!product) return null;
                  const finalPrice = product.price * (1 - dp.discountPercent / 100);
                  return (
                    <motion.div 
                      key={dp.productId} 
                      className="bundle-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bundle-badge bundle-badge--vip" style={{ background: 'var(--rg-gold)' }}>{dp.discountPercent}% OFF</div>
                      <img src={product.img || '/images/products/skincare/MTF Body Oil.png'} alt={product.name} className="bundle-img" style={{ objectFit: 'cover' }} />
                      <div className="bundle-info">
                        <h3 className="bundle-name">{product.name}</h3>
                        <p className="bundle-desc">{product.desc?.substring(0, 60)}...</p>
                        <div className="bundle-pricing">
                          <span className="bundle-price-orig">AED {product.price?.toFixed(2)}</span>
                          <span className="bundle-price-final">AED {finalPrice.toFixed(2)}</span>
                        </div>
                        
                        <button 
                          className="btn btn-primary w-full"
                          onClick={() => addToCart({ ...product, price: finalPrice })}
                        >
                          <ShoppingBag size={15} /> Add to Bag
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {glowSettings.showBundles !== false && (
            <>
              <div className="glow-section-title">
                <Sparkles size={24} color="var(--rg-gold)" />
                <h2 className="heading-lg">Exclusive Bundles</h2>
              </div>

              <div className="bundles-grid">
                {bundles.length === 0 ? (
                  <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No bundles available right now.</p>
                ) : (
                  bundles.map(bundle => {
                    const isLocked = bundle.vipOnly && (!isVipActive || !userIsVip);

                    return (
                      <motion.div 
                        key={bundle.id} 
                        className={`bundle-card ${isLocked ? 'bundle-card--locked' : ''}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                      >
                        {bundle.vipOnly && (
                          <div className="bundle-badge bundle-badge--vip">VIP Exclusive</div>
                        )}
                        <img src={bundle.img || '/images/products/skincare/MTF Body Oil.png'} alt={bundle.name} className="bundle-img" />
                        <div className="bundle-info">
                          <h3 className="bundle-name">{bundle.name}</h3>
                          <p className="bundle-desc">{bundle.desc}</p>
                          <div className="bundle-pricing">
                            <span className="bundle-price-orig">AED {bundle.originalPrice?.toFixed(2)}</span>
                            <span className="bundle-price-final">AED {bundle.finalPrice?.toFixed(2)}</span>
                          </div>
                          
                          {isLocked ? (
                            <button className="btn btn-outline w-full" disabled>
                              <Lock size={15} /> Locked
                            </button>
                          ) : (
                            <button 
                              className="btn btn-primary w-full"
                              onClick={() => addToCart({ ...bundle, isBundle: true })}
                            >
                              <ShoppingBag size={15} /> Add Bundle to Bag
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

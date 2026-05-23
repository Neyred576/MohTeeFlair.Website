import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, total, subtotalLabel, clearCart, handleSocialCheckout } = useCart();
  const [step, setStep] = useState(1); // 1=bag, 2=options
  const [loading, setLoading] = useState(false);



  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="page-header__glow" />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">Your Selection</span>
            <h1 className="heading-xl gradient-text">
              {step === 1 && 'Shopping Bag'}
              {step === 2 && 'Checkout'}
              {step === 3 && 'Order Confirmed'}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Step Indicator */}
        {step < 3 && (
          <div className="cart-steps">
            {['Your Bag', 'Order Summary'].map((s, i) => (
              <div key={s} className={`cart-step ${step === i + 1 ? 'cart-step--active' : ''} ${step > i + 1 ? 'cart-step--done' : ''}`}>
                <span className="cart-step__num">{step > i + 1 ? '✓' : i + 1}</span>
                <span className="cart-step__label">{s}</span>
              </div>
            ))}
            <div className="cart-steps__line" />
          </div>
        )}

        {/* ─── Step 1: Bag ─── */}
        {step === 1 && (
          <motion.div
            className="cart-content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={60} strokeWidth={1} />
                <h2 className="heading-md">Your bag is empty</h2>
                <p>Add some luxury to your life</p>
                <Link to="/products" className="btn btn-primary mt-6">Explore Products</Link>
              </div>
            ) : (
              <div className="cart-layout">
                {/* Items */}
                <div className="cart-items">
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      className="cart-page-item"
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="cart-page-item__img">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="cart-page-item__info">
                        <p className="cart-page-item__cat">{item.category}</p>
                        <p className="cart-page-item__name">{item.name}</p>
                        <p className="cart-page-item__price">{[1, 3].includes(item.id) ? 'AED 30' : 'COMING SOON'}</p>
                        <div className="cart-page-item__controls">
                          <div className="cart-page-item__qty">
                            <button onClick={() => updateQty(item.id, -1)} id={`qty-minus-${item.id}`}><Minus size={13} /></button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} id={`qty-plus-${item.id}`}><Plus size={13} /></button>
                          </div>
                          <span className="cart-page-item__subtotal">{[1, 3].includes(item.id) ? `AED ${30 * item.qty}` : 'COMING SOON'}</span>
                          <button className="cart-page-item__remove" onClick={() => removeFromCart(item.id)} id={`remove-${item.id}`}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <button className="cart-clear-btn" onClick={clearCart}>Clear Bag</button>
                </div>

                {/* Summary */}
                <div className="cart-summary">
                  <h3 className="cart-summary__title">Order Summary</h3>
                  <div className="cart-summary__rows">
                    <div className="cart-summary__row"><span>Subtotal</span><span>{subtotalLabel}</span></div>
                  </div>
                  <div className="gold-line" />
                  <div className="cart-summary__total">
                    <span>Total</span>
                    <span className="cart-summary__total-price">{subtotalLabel}</span>
                  </div>
                  <button className="btn btn-primary w-full" onClick={() => setStep(2)} id="cart-to-checkout">
                    Proceed to Checkout <ArrowRight size={15} />
                  </button>
                  <Link to="/products" className="cart-continue-link">
                    <ArrowLeft size={14} /> Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}



        {/* ─── Step 2: Checkout Options ─── */}
        {step === 2 && (
          <motion.div
            className="cart-content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            <div className="cart-layout" style={{ display: 'block', maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="heading-lg" style={{ marginBottom: 12 }}>Where would you like to order?</h2>
              <p style={{ marginBottom: 32, color: 'var(--gray-light)' }}>Select a platform to securely send your order directly to our team.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 16, padding: '20px 24px', fontSize: '1rem' }} onClick={() => handleSocialCheckout('facebook')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook Messenger
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 16, padding: '20px 24px', fontSize: '1rem' }} onClick={() => handleSocialCheckout('instagram')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram Direct Message
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 16, padding: '20px 24px', fontSize: '1rem' }} onClick={() => handleSocialCheckout('whatsapp', '254799365118')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  WhatsApp (Kenya)
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 16, padding: '20px 24px', fontSize: '1rem' }} onClick={() => handleSocialCheckout('whatsapp', '971526413089')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  WhatsApp (UAE)
                </button>
              </div>

              <div style={{ marginTop: 32 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}><ArrowLeft size={14} /> Back to Bag</button>
              </div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            className="cart-confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="cart-confirmed__icon">
              <CheckCircle size={48} />
            </div>
            <h2 className="heading-lg gradient-text">Thank You!</h2>
            <p>Your order has been placed successfully.<br />You will receive a confirmation email shortly.</p>
            <div className="hero__btns justify-center mt-8">
              <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
              <Link to="/" className="btn btn-ghost">Back to Home</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQty, subtotalLabel, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const drawerRef = useRef();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setCartOpen]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${cartOpen ? 'cart-overlay--open' : ''}`}
        onClick={() => setCartOpen(false)}
      />
      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} ref={drawerRef} id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-wrap">
            <ShoppingBag size={18} />
            <h2 className="cart-drawer__title">Your Bag</h2>
            {itemCount > 0 && <span className="cart-drawer__count">{itemCount}</span>}
          </div>
          <button className="cart-drawer__close" onClick={() => setCartOpen(false)} id="cart-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Gold line */}
        <div className="gold-line" />

        {/* Items */}
        <div className="cart-drawer__body">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your bag is empty</p>
              <button className="btn btn-outline" onClick={() => { setCartOpen(false); navigate('/products'); }}>
                Explore Products
              </button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">{[1, 3].includes(item.id) ? 'AED 30' : 'COMING SOON'}</p>
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item.id, -1)} className="cart-item__qty-btn"><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="cart-item__qty-btn"><Plus size={12} /></button>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="gold-line" />
            <div className="cart-drawer__total">
              <span>Subtotal</span>
              <span className="cart-drawer__total-price">{subtotalLabel}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCheckout} id="cart-checkout-btn">
              Proceed to Checkout
            </button>
            <button className="cart-drawer__clear" onClick={clearCart}>Clear bag</button>
          </div>
        )}
      </div>
    </>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mtf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mtf_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    if (!user) {
      alert("Please login or sign up to add items to your cart.");
      navigate('/login');
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((s, i) => {
    const price = [1, 3].includes(i.id) ? 30 : 0;
    return s + price * i.qty;
  }, 0);
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const hasPricedItems = cartItems.some(i => [1, 3].includes(i.id));
  const subtotalLabel = hasPricedItems && total > 0 ? `AED ${total}` : 'COMING SOON';

  const handleSocialCheckout = async (platform, phone) => {
    if (cartItems.length === 0) return;
    const itemsText = cartItems.map(i => `${i.qty}x ${i.name}`).join(', ');
    const message = `Hello, I want to buy:\n${itemsText}`;
    
    if (platform === 'whatsapp') {
      const encoded = encodeURIComponent(message);
      window.location.href = `https://wa.me/${phone}?text=${encoded}`;
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        alert('Your order details have been copied to your clipboard! Please paste them into the chat when the app opens.');
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (e) {
      console.warn('Clipboard write failed', e);
      alert(`Please manually send us this message:\n\n${message}`);
    }
    
    if (platform === 'facebook') {
      window.location.href = 'https://m.me/MohTeeflair';
    } else if (platform === 'instagram') {
      window.location.href = 'https://www.instagram.com/mohtee_flair/';
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, total, subtotalLabel, itemCount, cartOpen, setCartOpen, handleSocialCheckout }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

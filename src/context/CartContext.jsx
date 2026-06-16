import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { useGlowAndSave } from './GlowAndSaveContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const { bundles, vipSettings } = useGlowAndSave();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mtf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('mtf_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Enrich cart items with REAL-TIME price from products/bundles and apply VIP discounts
  const enrichedCartItems = useMemo(() => {
    const isVipActive = user?.isVIP && vipSettings?.active;
    const vipDiscount = isVipActive ? (vipSettings.discountPercent || 0) : 0;

    return cartItems.map(item => {
      if (item.isBundle) {
        const liveBundle = bundles.find(b => b.id === item.id);
        if (liveBundle) {
          return {
            ...item,
            name: liveBundle.name || item.name,
            img: liveBundle.img || item.img,
            originalPrice: liveBundle.originalPrice || 0,
            price: liveBundle.finalPrice || 0,
            comingSoon: false,
          };
        }
        return item;
      }

      // Normal product
      const liveProduct = products.find(p => p.id === item.id);
      if (liveProduct) {
        let basePrice = liveProduct.price ?? 0;
        let finalPrice = basePrice;
        let originalPrice = basePrice;

        if (isVipActive && basePrice > 0) {
          finalPrice = basePrice * (1 - (vipDiscount / 100));
        }

        return {
          ...item,
          price: finalPrice,
          originalPrice: originalPrice,
          comingSoon: !!liveProduct.comingSoon,
          name: liveProduct.name ?? item.name,
          img: liveProduct.img ?? item.img,
          category: liveProduct.category ?? item.category,
        };
      }
      return item;
    });
  }, [cartItems, products, bundles, user, vipSettings]);

  const addToCart = (product) => {
    if (!user) {
      alert('Please login or sign up to add items to your cart.');
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

  // Only count items that have a real price (not coming soon)
  const pricedItems = enrichedCartItems.filter(i => !i.comingSoon && (i.price ?? 0) > 0);
  
  const totalOriginalPrice = pricedItems.reduce((s, i) => s + (i.originalPrice ?? i.price ?? 0) * i.qty, 0);
  const total = pricedItems.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);
  const totalDiscount = totalOriginalPrice - total;
  
  const itemCount = enrichedCartItems.reduce((s, i) => s + i.qty, 0);

  // True if EVERY item in the cart has a real price set
  const hasComingSoonItems = enrichedCartItems.some(i => i.comingSoon || !(i.price > 0));
  const allPriced = enrichedCartItems.length > 0 && !hasComingSoonItems;

  const subtotalLabel = allPriced
    ? `AED ${total.toFixed(2)}`
    : enrichedCartItems.length > 0
      ? pricedItems.length > 0
        ? `AED ${total.toFixed(2)} + Coming Soon item(s)`
        : 'COMING SOON'
      : 'AED 0.00';

  const handleSocialCheckout = async (platform, phone) => {
    if (enrichedCartItems.length === 0) return;
    const itemsText = enrichedCartItems.map(i => {
      const priceStr = i.comingSoon ? '(Coming Soon)' : `AED ${((i.price ?? 0) * i.qty).toFixed(2)}`;
      return `${i.qty}x ${i.name} ${i.isBundle ? '(Bundle)' : ''} — ${priceStr}`;
    }).join('\n');
    
    let totalStr = '';
    if (total > 0) {
      if (totalDiscount > 0) {
        totalStr = `\n\nOriginal Total: AED ${totalOriginalPrice.toFixed(2)}\nDiscount Saved: AED ${totalDiscount.toFixed(2)}\nFinal Payment: AED ${total.toFixed(2)}`;
      } else {
        totalStr = `\n\nTotal: AED ${total.toFixed(2)}`;
      }
    }
    
    const message = `Hello, I want to order:\n${itemsText}${totalStr}`;

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
    <CartContext.Provider value={{
      cartItems: enrichedCartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      total,
      totalOriginalPrice,
      totalDiscount,
      subtotalLabel,
      itemCount,
      cartOpen,
      setCartOpen,
      handleSocialCheckout,
      hasComingSoonItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

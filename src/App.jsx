import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationBanner from './components/NotificationBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PushPermissionPrompt from './components/PushPermissionPrompt';
import GuestTracker from './components/GuestTracker';
import { GlowAndSaveProvider } from './context/GlowAndSaveContext';
import Home from './pages/Home';
import Products from './pages/Products';
import BeautyTips from './pages/BeautyTips';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import GlowAndSave from './pages/GlowAndSave';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/"            element={<Home />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/beauty-tips" element={<BeautyTips />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/signup"      element={<SignUp />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin"        element={<AdminDashboard />} />
          <Route path="/glow-and-save" element={<GlowAndSave />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <GlowAndSaveProvider>
            <NotificationProvider>
              <CartProvider>
                <GuestTracker />
                <div className="noise-overlay" />
                <NotificationBanner />
                <Navbar />
                <CartDrawer />
                <main style={{ paddingTop: 'var(--navbar-h)' }}>
                  <AnimatedRoutes />
                </main>
                <Footer />
                <PWAInstallPrompt />
                <PushPermissionPrompt />
              </CartProvider>
            </NotificationProvider>
          </GlowAndSaveProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

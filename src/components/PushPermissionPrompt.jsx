import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './PushPermissionPrompt.css';

const VAPID_PUBLIC_KEY = 'BJnLCMI-QS5sWkLCVkYPO3Cw6h2-WzcKemqcagQ0mGOz4vcLrOiqd0iXTFiV06BU_9YXuK8N5MEBJe4Zac_Vx1M';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    // Don't show if not supported or already granted/denied
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;

    // Check if user already dismissed this session
    if (sessionStorage.getItem('mtf-push-dismissed')) return;

    // Show after a short delay so the user has time to look at the page first
    const timer = setTimeout(() => setShowPrompt(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Subscribe to push
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // Save subscription to Firestore so the admin can push to it later
        const subJSON = subscription.toJSON();
        await addDoc(collection(db, 'pushSubscriptions'), {
          endpoint: subJSON.endpoint,
          keys: subJSON.keys,
          createdAt: new Date(),
          userAgent: navigator.userAgent
        });

        console.log('[Push] Subscription saved to Firestore');
      }
    } catch (error) {
      console.error('[Push] Error subscribing:', error);
    }
    setShowPrompt(false);
    setSubscribing(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('mtf-push-dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="push-prompt"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="push-prompt__icon-wrap">
            <Bell size={22} />
          </div>
          <div className="push-prompt__text">
            <p className="push-prompt__title">Stay Updated ✨</p>
            <p className="push-prompt__desc">Get notified about new arrivals, deals & beauty tips from Moh Tee Flair</p>
          </div>
          <div className="push-prompt__actions">
            <button
              className="push-prompt__btn push-prompt__btn--allow"
              onClick={handleAllow}
              disabled={subscribing}
            >
              {subscribing ? 'Enabling...' : 'Allow'}
            </button>
            <button
              className="push-prompt__btn push-prompt__btn--later"
              onClick={handleDismiss}
            >
              Later
            </button>
          </div>
          <button className="push-prompt__close" onClick={handleDismiss}>
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

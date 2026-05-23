import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';
import './NotificationBanner.css';

export default function NotificationBanner() {
  const { currentNotification, clearNotificationLocally } = useNotifications();

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          className="global-notification-banner"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="notification-content">
            <Bell size={18} className="notification-icon" />
            <p>{currentNotification.message}</p>
          </div>
          <button 
            className="notification-close-btn"
            onClick={clearNotificationLocally}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

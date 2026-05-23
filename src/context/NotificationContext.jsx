import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.js';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Listen for the most recent notification
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const notif = snapshot.docs[0].data();
        
        // Show notification if it's less than 24 hours old
        const oneDay = 24 * 60 * 60 * 1000;
        const isRecent = notif.createdAt && (new Date() - notif.createdAt.toDate()) < oneDay;
        
        if (isRecent) {
          setCurrentNotification({ id: snapshot.docs[0].id, ...notif });
        } else {
          setCurrentNotification(null);
        }
      } else {
        setCurrentNotification(null);
      }
    }, (error) => {
      console.error("Error fetching notifications: ", error);
    });

    return () => unsubscribe();
  }, []);

  const sendNotification = async (message) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        message,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error sending notification: ", error);
      throw error;
    }
  };

  const clearNotificationLocally = () => {
    // This allows a user to dismiss the banner locally without deleting it for everyone
    setCurrentNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ currentNotification, sendNotification, clearNotificationLocally }}>
      {children}
    </NotificationContext.Provider>
  );
};

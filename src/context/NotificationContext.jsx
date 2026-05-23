import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, addDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.js';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(allNotifs);
      
      if (allNotifs.length > 0) {
        const mostRecent = allNotifs[0];
        
        // Show notification if it's less than 24 hours old
        const oneDay = 24 * 60 * 60 * 1000;
        const isRecent = mostRecent.createdAt && (new Date() - mostRecent.createdAt.toDate()) < oneDay;
        
        if (isRecent) {
          setCurrentNotification(mostRecent);
        } else {
          setCurrentNotification(null);
        }
      } else {
        setCurrentNotification(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications: ", error);
      setLoading(false);
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

  const deleteNotification = async (id) => {
    try {
      const notifDocRef = doc(db, 'notifications', id);
      await deleteDoc(notifDocRef);
      console.log(`[NotificationContext] Deleted notification ${id}`);
    } catch (error) {
      console.error("Error deleting notification: ", error);
      throw error;
    }
  };

  const clearNotificationLocally = () => {
    // This allows a user to dismiss the banner locally without deleting it for everyone
    setCurrentNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ 
      currentNotification, 
      notifications, 
      loading,
      sendNotification, 
      deleteNotification,
      clearNotificationLocally 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

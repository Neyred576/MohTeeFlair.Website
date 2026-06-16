import React, { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function GuestTracker() {
  const { user } = useAuth();

  useEffect(() => {
    const trackActivity = async () => {
      const now = new Date().toISOString();

      if (user) {
        // User is logged in, ping lastActive
        try {
          await setDoc(doc(db, 'users', String(user.id)), {
            lastActive: now
          }, { merge: true });
        } catch (err) {
          console.warn('Could not update user activity', err);
        }
      } else {
        // Guest tracking
        let guestId = localStorage.getItem('mtf_guest_id');
        
        if (!guestId) {
          guestId = 'guest_' + Date.now().toString() + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('mtf_guest_id', guestId);
          
          try {
            await setDoc(doc(db, 'guests', guestId), {
              id: guestId,
              createdAt: now,
              lastActive: now,
              lastVisited: now
            });
          } catch (err) {
            console.warn('Could not register guest', err);
          }
        } else {
          // Just update lastActive and lastVisited
          try {
            await setDoc(doc(db, 'guests', guestId), {
              lastActive: now,
              lastVisited: now
            }, { merge: true });
          } catch (err) {}
        }
      }
    };

    trackActivity();

    // Ping every 1 minute to keep active status updated
    const interval = setInterval(trackActivity, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return null;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mtf_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const signUp = async ({ name, email, password }) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('mtf_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('mtf_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    safeUser.isVIP = false;

    // Push to Firestore
    try {
      await setDoc(doc(db, 'users', safeUser.id), {
        ...safeUser
      });
      // Convert guest by deleting guest record
      const guestId = localStorage.getItem('mtf_guest_id');
      if (guestId) {
        await deleteDoc(doc(db, 'guests', guestId));
        localStorage.removeItem('mtf_guest_id');
      }
    } catch (err) {
      console.warn("Failed to sync user to Firestore", err);
    }

    setUser(safeUser);
    localStorage.setItem('mtf_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const login = async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('mtf_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = found;

    // Fetch latest from Firestore for VIP status
    try {
      const userDoc = await getDoc(doc(db, 'users', safeUser.id.toString()));
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        safeUser.isVIP = firestoreData.isVIP || false;
      }
      // Convert guest on login
      const guestId = localStorage.getItem('mtf_guest_id');
      if (guestId) {
        await deleteDoc(doc(db, 'guests', guestId));
        localStorage.removeItem('mtf_guest_id');
      }
    } catch (err) {
      console.warn("Could not fetch latest user data from Firestore", err);
    }

    setUser(safeUser);
    localStorage.setItem('mtf_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mtf_user');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

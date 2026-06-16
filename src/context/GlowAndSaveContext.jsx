import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

const GlowAndSaveContext = createContext();

export function GlowAndSaveProvider({ children }) {
  const [glowSettings, setGlowSettings] = useState({ active: false, title: 'Glow & Save', subtitle: 'Exclusive Offers', banners: [] });
  const [campaigns, setCampaigns] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [vipSettings, setVipSettings] = useState({ active: false, discountPercent: 0, members: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubGlow = onSnapshot(doc(db, 'settings', 'glowAndSave'), (snap) => {
      if (snap.exists()) setGlowSettings(snap.data());
      else setDoc(doc(db, 'settings', 'glowAndSave'), { active: false, title: 'Glow & Save', subtitle: 'Exclusive Offers', banners: [] });
    });
    const unsubVip = onSnapshot(doc(db, 'settings', 'vip'), (snap) => {
      if (snap.exists()) setVipSettings(snap.data());
      else setDoc(doc(db, 'settings', 'vip'), { active: false, discountPercent: 0, members: [] });
    });
    const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snap) => {
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubBundles = onSnapshot(collection(db, 'bundles'), (snap) => {
      setBundles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    setLoading(false);
    return () => { unsubGlow(); unsubVip(); unsubCampaigns(); unsubBundles(); };
  }, []);

  // ─── Settings ───────────────────────────────────────────────
  const updateGlowSettings = (data) => setDoc(doc(db, 'settings', 'glowAndSave'), data, { merge: true });
  const updateVipSettings  = (data) => setDoc(doc(db, 'settings', 'vip'), data, { merge: true });

  // ─── Campaign CRUD ──────────────────────────────────────────
  const addCampaign    = (data) => addDoc(collection(db, 'campaigns'), { ...data, createdAt: new Date().toISOString() });
  const updateCampaign = (id, data) => updateDoc(doc(db, 'campaigns', id), data);
  const deleteCampaign = (id) => deleteDoc(doc(db, 'campaigns', id));

  // ─── Bundle CRUD ────────────────────────────────────────────
  const addBundle    = (data) => addDoc(collection(db, 'bundles'), { ...data, createdAt: new Date().toISOString() });
  const updateBundle = (id, data) => updateDoc(doc(db, 'bundles', id), data);
  const deleteBundle = (id) => deleteDoc(doc(db, 'bundles', id));

  // ─── VIP Member management ──────────────────────────────────
  const addVipMember = async (email) => {
    const members = vipSettings.members || [];
    if (members.includes(email)) return;
    await updateVipSettings({ members: [...members, email] });
    // Also update user doc in Firestore
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const userDoc = usersSnap.docs.find(d => d.data().email === email);
      if (userDoc) await updateDoc(doc(db, 'users', userDoc.id), { isVIP: true });
    } catch (e) { console.warn('Could not update user VIP status', e); }
  };
  const removeVipMember = async (email) => {
    const members = (vipSettings.members || []).filter(m => m !== email);
    await updateVipSettings({ members });
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const userDoc = usersSnap.docs.find(d => d.data().email === email);
      if (userDoc) await updateDoc(doc(db, 'users', userDoc.id), { isVIP: false });
    } catch (e) { console.warn('Could not update user VIP status', e); }
  };

  return (
    <GlowAndSaveContext.Provider value={{
      glowSettings, campaigns, bundles, vipSettings, loading,
      updateGlowSettings, updateVipSettings,
      addCampaign, updateCampaign, deleteCampaign,
      addBundle, updateBundle, deleteBundle,
      addVipMember, removeVipMember,
    }}>
      {children}
    </GlowAndSaveContext.Provider>
  );
}

export const useGlowAndSave = () => useContext(GlowAndSaveContext);

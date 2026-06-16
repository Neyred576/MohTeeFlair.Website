/**
 * One-time utility: sets comingSoon=false on every product in Firestore
 * that doesn't already have the field set, preserving existing prices.
 *
 * Run from browser console after importing, or temporarily call from main.jsx.
 */
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

export async function fixProductComingSoonField() {
  const ref = collection(db, 'products');
  const snapshot = await getDocs(ref);
  let updated = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    // Only update if comingSoon field is missing (undefined)
    if (data.comingSoon === undefined) {
      await updateDoc(doc(db, 'products', docSnap.id), { comingSoon: false });
      updated++;
    }
  }

  console.log(`[fixProductPrices] Updated ${updated} products with comingSoon: false`);
  return updated;
}

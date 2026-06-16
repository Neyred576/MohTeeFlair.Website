// Run with: node scripts/fixProductPrices.mjs
// This sets comingSoon: false on all Firestore products that don't have the field

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBg3Frvs-fXYX7eWjaWT81vnXn7XZ4j6TM",
  authDomain: "mohteeflair-app.firebaseapp.com",
  projectId: "mohteeflair-app",
  storageBucket: "mohteeflair-app.firebasestorage.app",
  messagingSenderId: "785158128760",
  appId: "1:785158128760:web:42a64cc4b8d9b1d95ad98d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const ref = collection(db, 'products');
  const snapshot = await getDocs(ref);
  let updated = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.comingSoon === undefined) {
      await updateDoc(doc(db, 'products', docSnap.id), { comingSoon: false });
      console.log(`  ✓ Updated: ${data.name}`);
      updated++;
    } else {
      console.log(`  - Skipped (already has field): ${data.name}`);
    }
  }

  console.log(`\n✅ Done! Updated ${updated} products with comingSoon: false`);
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

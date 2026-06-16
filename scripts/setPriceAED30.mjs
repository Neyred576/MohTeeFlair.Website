// Run with: node scripts/setPriceAED30.mjs
// Sets MTF Liquid Lipstick and MTF Liquid Lipstick Collection to price: 30, comingSoon: false

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

const TARGET_PRODUCTS = [
  'MTF Liquid Lipstick',
  'MTF Liquid Lipstick Collection'
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const ref = collection(db, 'products');
  const snapshot = await getDocs(ref);
  let updated = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (TARGET_PRODUCTS.includes(data.name)) {
      await updateDoc(doc(db, 'products', docSnap.id), {
        price: 30,
        comingSoon: false
      });
      console.log(`  ✓ Set price to AED 30: ${data.name}`);
      updated++;
    }
  }

  if (updated === 0) {
    console.log('⚠️  No matching products found. Check product names in Firestore.');
  } else {
    console.log(`\n✅ Done! Updated ${updated} product(s) to AED 30`);
  }
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

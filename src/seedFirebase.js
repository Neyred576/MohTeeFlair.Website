import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { products } from "./data/products.js";

export const seedProductsToFirestore = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    // Only seed if the database is empty
    if (snapshot.empty) {
      console.log("[Seeding] Database is empty. Seeding products...");
      let count = 0;
      for (const product of products) {
        // We do not include the old numerical 'id', Firestore will generate one.
        // Or we can save the old ID just in case, but let's let Firestore generate the doc ID.
        const { id, ...productData } = product;
        await addDoc(productsRef, {
          ...productData,
          createdAt: new Date()
        });
        count++;
      }
      console.log(`[Seeding] Successfully added ${count} products to Firestore!`);
    } else {
      console.log("[Seeding] Database already has products. Skipping seed.");
    }
  } catch (error) {
    console.error("[Seeding] Error seeding database:", error);
  }
};

// Execute if run directly
seedProductsToFirestore();

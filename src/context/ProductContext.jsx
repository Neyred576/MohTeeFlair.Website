import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData) => {
    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, {
        ...productData,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedData);
    } catch (error) {
      console.error("Error updating product: ", error);
      throw error;
    }
  };

  const removeProduct = async (id) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error removing product: ", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

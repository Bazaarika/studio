
import { db } from './config';
import { collection, addDoc, getDocs, getDoc, doc, DocumentData, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Product } from '@/lib/mock-data';

// Add a new product to the "products" collection
export const addProduct = async (productData: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to add product");
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    const docRef = doc(db, "products", id);
    try {
        await updateDoc(docRef, productData);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw new Error("Failed to update product");
    }
}

// Get all products from the "products" collection
export const getProducts = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];
    querySnapshot.forEach((doc: DocumentData) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
}

// Get a single product by its ID
export const getProduct = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
        return null;
    }
}

// Delete a product by its ID
export const deleteProduct = async (id: string) => {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
}


// Address types and functions
export interface Address {
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
}

// Get user address
export const getUserAddress = async (userId: string): Promise<Address | null> => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().address) {
        return docSnap.data().address as Address;
    }
    return null;
};

// Save or update user address
export const updateUserAddress = async (userId: string, address: Address) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { address }, { merge: true });
};

    
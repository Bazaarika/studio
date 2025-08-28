
import { db } from './config';
import { collection, addDoc, getDocs, getDoc, doc, DocumentData, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Product, Order, OrderItem } from '@/lib/mock-data';

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

// Get user document data
const getUserDoc = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    return await getDoc(docRef);
}

// Get user address
export const getUserAddress = async (userId: string): Promise<Address | null> => {
    const docSnap = await getUserDoc(userId);
    if (docSnap.exists() && docSnap.data().address) {
        return docSnap.data().address as Address;
    }
    return null;
};

// Get user phone
export const getUserPhone = async (userId: string): Promise<string | null> => {
    const docSnap = await getUserDoc(userId);
    if (docSnap.exists() && docSnap.data().phone) {
        return docSnap.data().phone as string;
    }
    return null;
};

// Save or update user address
export const updateUserAddress = async (userId: string, address: Address) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { address }, { merge: true });
};

// Save or update user phone
export const updateUserPhone = async (userId: string, phone: string) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { phone }, { merge: true });
};


// --- Wishlist Functions ---

// Get user wishlist
export const getUserWishlist = async (userId: string): Promise<string[]> => {
    const docSnap = await getUserDoc(userId);
    if (docSnap.exists() && docSnap.data().wishlist) {
        return docSnap.data().wishlist as string[];
    }
    return [];
};

// Add product to user's wishlist
export const addToUserWishlist = async (userId: string, productId: string) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { wishlist: arrayUnion(productId) }, { merge: true });
};

// Remove product from user's wishlist
export const removeFromUserWishlist = async (userId: string, productId: string) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { wishlist: arrayRemove(productId) }, { merge: true });
};

// Merge local wishlist with Firestore wishlist
export const mergeWishlists = async (userId: string, localWishlist: string[]) => {
    if (localWishlist.length === 0) return;
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { wishlist: arrayUnion(...localWishlist) }, { merge: true });
};


// --- Order Functions ---

// Place a new order
export const placeOrder = async (
    userId: string, 
    items: OrderItem[], 
    total: number, 
    shippingAddress: Address, 
    paymentMethod: string,
    paymentId?: string
): Promise<string> => {
    try {
        const orderData: Omit<Order, 'id'> = {
            userId,
            createdAt: new Date().toISOString(), // Using ISO string for consistency
            status: 'Processing',
            total,
            items,
            shippingAddress,
            paymentMethod,
            paymentId: paymentId || 'N/A',
            trackingHistory: [
                { status: 'Order Placed', date: new Date().toISOString(), location: 'Bazaarika.com' },
            ]
        };
        
        // Add serverTimestamp for Firestore's internal use
        const dataToSave = {
            ...orderData,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "orders"), dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error placing order: ", error);
        throw new Error("Failed to place order");
    }
};

// Get all orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamps to serializable strings
        const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
        
        orders.push({
            id: doc.id,
            ...data,
            createdAt,
        } as Order);
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get a single order by its ID
export const getOrder = async (orderId: string): Promise<Order | null> => {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
        return { 
            id: docSnap.id,
             ...data,
            createdAt,
        } as Order;
    } else {
        return null;
    }
};

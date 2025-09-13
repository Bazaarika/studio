
import { db } from './config';
import { collection, addDoc, getDocs, getDoc, doc, DocumentData, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, where, serverTimestamp, Timestamp, writeBatch, orderBy } from 'firebase/firestore';
import type { Product, Order, OrderItem, HomeSection, Category, Page, ProductWithVendor } from '@/lib/mock-data';
import { activateVendorAccount } from './actions';

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

// Batch add multiple products
export const batchAddProducts = async (products: Omit<Product, 'id'>[]) => {
    const batch = writeBatch(db);
    const productsCollection = collection(db, "products");

    products.forEach(productData => {
        const docRef = doc(productsCollection); // Create a new doc with a generated id
        batch.set(docRef, productData);
    });

    try {
        await batch.commit();
    } catch (e) {
        console.error("Error batch adding documents: ", e);
        throw new Error("Failed to batch add products");
    }
}

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<Product>) => {
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

// Update the status of an order
export const updateOrderStatus = async (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered', location: string) => {
    const orderRef = doc(db, "orders", orderId);
    const newHistoryEntry = {
        status: status,
        date: new Date().toISOString(),
        location: location
    };
    try {
        await updateDoc(orderRef, {
            status: status,
            trackingHistory: arrayUnion(newHistoryEntry)
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status");
    }
};


// --- Home Page Customization Functions ---

// Get the home page layout sections
export const getHomeLayout = async (): Promise<HomeSection[]> => {
    const layoutCollection = collection(db, "home_layout");
    const q = query(layoutCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    const layout: HomeSection[] = [];
    querySnapshot.forEach((doc) => {
        layout.push({ id: doc.id, ...doc.data() } as HomeSection);
    });
    return layout;
}

// Add a new section to the home page layout
export const addHomeSection = async (section: Omit<HomeSection, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, "home_layout"), section);
    return docRef.id;
}

// Update an existing home section
export const updateHomeSection = async (sectionId: string, data: Partial<Pick<HomeSection, 'title' | 'productIds' | 'description'>>) => {
    const docRef = doc(db, "home_layout", sectionId);
    await updateDoc(docRef, data);
};

// Delete a section from the home page layout
export const deleteHomeSection = async (sectionId: string) => {
    await deleteDoc(doc(db, "home_layout", sectionId));
}

// Update the order of all home page sections
export const updateHomeLayoutOrder = async (sections: HomeSection[]) => {
    const batch = writeBatch(db);
    sections.forEach(section => {
        const docRef = doc(db, "home_layout", section.id);
        batch.update(docRef, { order: section.order });
    });
    await batch.commit();
}

// --- Category Management Functions ---

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

// Add a new category
export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, "categories"), category);
    return docRef.id;
}

// Update an existing category
export const updateCategory = async (id: string, data: Partial<Category>) => {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, data);
}

// Delete a category
export const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
}

// --- Custom Page Functions ---

// Get all pages
export const getPages = async (): Promise<Page[]> => {
    const querySnapshot = await getDocs(collection(db, "pages"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page));
}

// Get a single page by its ID
export const getPage = async (id: string): Promise<Page | null> => {
    const docRef = doc(db, "pages", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
            id: docSnap.id, 
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Page;
    }
    return null;
}

// Get a single page by its slug
export const getPageBySlug = async (slug: string): Promise<Page | null> => {
    const q = query(collection(db, "pages"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Page;
    }
    return null;
}


// Add a new page
export const addPage = async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const dataToSave = {
        ...pageData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "pages"), dataToSave);
    return docRef.id;
}

// Update an existing page
export const updatePage = async (id: string, pageData: Partial<Omit<Page, 'id' | 'createdAt'>>) => {
    const docRef = doc(db, "pages", id);
    const dataToUpdate = {
        ...pageData,
        updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, dataToUpdate);
}

// Delete a page
export const deletePage = async (id: string) => {
    await deleteDoc(doc(db, "pages", id));
}

// --- Customer Management Functions ---

export interface UserProfile {
    id: string; // This will be the UID
    name?: string;
    email?: string;
    photoURL?: string;
    phone?: string;
    address?: Address;
}

export interface Customer extends UserProfile {
    totalOrders: number;
    totalSpent: number;
}


// This function fetches all users and calculates their order stats.
export const getCustomers = async (): Promise<Customer[]> => {
    // 1. Fetch all orders
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

    // 2. Aggregate order data by userId
    const customerStats: { [key: string]: { totalOrders: number; totalSpent: number } } = {};
    for (const order of orders) {
        if (!customerStats[order.userId]) {
            customerStats[order.userId] = { totalOrders: 0, totalSpent: 0 };
        }
        customerStats[order.userId].totalOrders += 1;
        customerStats[order.userId].totalSpent += order.total;
    }

    // 3. Fetch all user profiles from the 'users' collection
    const usersSnapshot = await getDocs(collection(db, "users"));
    const customers: Customer[] = [];
    
    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const userId = doc.id;
        const stats = customerStats[userId] || { totalOrders: 0, totalSpent: 0 };
        customers.push({
            id: userId,
            name: userData.displayName || 'N/A', // Assuming you store displayName in the user doc
            email: userData.email || 'N/A',
            photoURL: userData.photoURL || '',
            phone: userData.phone || 'N/A',
            ...stats
        });
    });

    return customers;
}


// --- Vendor Application Management ---

export interface VendorApplicationData {
    shopName: string;
    contactName: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    gstNumber: string;
    panNumber: string;
}

export interface VendorApplication extends VendorApplicationData {
    uid: string;
    status: 'pending' | 'approved' | 'rejected';
}


export const getVendorApplications = async (): Promise<VendorApplication[]> => {
    const q = query(collection(db, "users"), where("role", "==", "vendor"));
    const querySnapshot = await getDocs(q);
    
    const applications: VendorApplication[] = [];
    querySnapshot.forEach((doc) => {
        applications.push(doc.data() as VendorApplication);
    });
    
    return applications;
};

export const approveVendor = async (userId: string) => {
    // 1. Update the user's status in Firestore
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        status: 'approved'
    });

    // 2. Enable the user's Auth account via a Server Action
    await activateVendorAccount(userId);
};


// Get all products and enrich them with vendor's display name
export const getProductsWithVendor = async (): Promise<ProductWithVendor[]> => {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    const vendorIds = [...new Set(products.map(p => p.vendor).filter(v => v !== 'admin' && v))];
    
    const vendorsMap = new Map<string, string>();
    if (vendorIds.length > 0) {
        // Fetch vendor details in chunks of 10 to avoid firestore limitations
        for (let i = 0; i < vendorIds.length; i += 10) {
            const chunk = vendorIds.slice(i, i + 10);
            const vendorsSnapshot = await getDocs(query(collection(db, "users"), where("uid", "in", chunk)));
            vendorsSnapshot.forEach(doc => {
                vendorsMap.set(doc.id, doc.data().displayName || 'Unnamed Vendor');
            });
        }
    }

    // Join products with vendor names
    const productsWithVendor: ProductWithVendor[] = products.map(product => ({
        ...product,
        vendorName: product.vendor === 'admin' ? 'Admin' : vendorsMap.get(product.vendor) || 'Unknown Vendor',
    }));

    return productsWithVendor;
}

// Update a product's status (for admin approval)
export const updateProductStatus = async (productId: string, status: 'Approved' | 'Rejected') => {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { status });
};

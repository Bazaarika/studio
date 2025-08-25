
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Shirt, Diamond, Watch, Footprints, Sparkles, ShoppingBag } from 'lucide-react';

// New, more detailed Product structure
export interface ImageField {
    url: string;
    hint: string;
}

export interface VariantOption {
    name: string;
    values: string; // Comma-separated
}

export interface GeneratedVariant {
    id: string;
    [key: string]: string | number; // e.g., Size: 'S', Color: 'Red'
    price: number;
    stock: number;
}

export interface Product {
  id?: string; // Optional because it's added by Firestore
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  images: ImageField[];
  status: 'Active' | 'Draft';
  vendor: string;
  tags: string[];
  hasVariants: boolean;
  variantOptions: VariantOption[];
  variants: GeneratedVariant[];
}


// Simple Product for Cart and Orders for now
export interface SimpleProduct {
  id: string;
  name:string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  aiHint: string;
}

export interface Category {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
}

export interface Order {
    id: string;
    date: string;
    status: 'Delivered' | 'Shipped' | 'Processing';
    total: number;
    items: (SimpleProduct & { quantity: number })[];
    shippingAddress: string;
    paymentMethod: string;
    trackingHistory: { status: string; date: string; location: string }[];
}

export const categories: Category[] = [
  { id: 'clothing', name: 'Clothing', icon: Shirt },
  { id: 'jewelry', name: 'Jewelry', icon: Diamond },
  { id: 'watches', name: 'Watches', icon: Watch },
  { id: 'shoes', name: 'Shoes', icon: Footprints },
  { id: 'accessories', name: 'Accessories', icon: Sparkles },
  { id: 'bags', name: 'Bags', icon: ShoppingBag },
];

// This mock data is now for the SimpleProduct type for frontend display
export const mockProducts: Omit<SimpleProduct, 'id'>[] = [
  {
    name: 'Elegant Floral Dress',
    description: 'A beautiful floral dress perfect for summer occasions. Made from lightweight and breathable fabric.',
    price: 2499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'floral dress',
  },
  {
    name: 'Classic Leather Watch',
    description: 'A timeless watch with a genuine leather strap and stainless steel case. Water-resistant up to 50m.',
    price: 8999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'watches',
    aiHint: 'leather watch',
  },
  {
    name: 'Silver Heart Necklace',
    description: 'A delicate sterling silver necklace featuring a heart-shaped pendant. A perfect gift for a loved one.',
    price: 3499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'jewelry',
    aiHint: 'silver necklace',
  },
   {
    name: 'Running Sneakers',
    description: 'High-performance running sneakers with cushioned soles and a breathable mesh upper. Ideal for daily workouts.',
    price: 4599,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'shoes',
    aiHint: 'running shoes',
  },
  {
    name: 'Silk Scarf',
    description: 'A luxurious 100% silk scarf with a vibrant print. Can be styled in multiple ways.',
    price: 1899,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'accessories',
    aiHint: 'silk scarf',
  },
];

export const simpleProducts: SimpleProduct[] = mockProducts.map((p, i) => ({ ...p, id: (i + 1).toString() }));


export const orders: Order[] = [
  {
    id: "ORD001",
    date: "June 23, 2024",
    status: "Delivered",
    total: 2499,
    items: [
      { ...simpleProducts[0], quantity: 1 },
    ],
    shippingAddress: '123 Main St, Anytown, 12345, India',
    paymentMethod: 'Credit Card (**** **** **** 1234)',
    trackingHistory: [
        { status: 'Delivered', date: 'June 23, 2024', location: 'Anytown, India' },
        { status: 'Out for Delivery', date: 'June 23, 2024', location: 'Anytown Hub' },
        { status: 'Shipped', date: 'June 22, 2024', location: 'Main Warehouse' },
        { status: 'Order Placed', date: 'June 21, 2024', location: 'Bazaarika.com' },
    ]
  },
  {
    id: "ORD002",
    date: "June 25, 2024",
    status: "Shipped",
    total: 8999,
    items: [{ ...simpleProducts[1], quantity: 1 }],
    shippingAddress: '456 Oak Ave, Someville, 67890, India',
    paymentMethod: 'UPI',
    trackingHistory: [
        { status: 'Shipped', date: 'June 25, 2024', location: 'Main Warehouse' },
        { status: 'Order Placed', date: 'June 25, 2024', location: 'Bazaarika.com' },
    ]
  },
];

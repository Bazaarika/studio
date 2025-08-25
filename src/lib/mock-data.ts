
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Shirt, Diamond, Watch, Footprints, Sparkles, ShoppingBag } from 'lucide-react';
import type { Address } from './firebase/firestore';

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


export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  aiHint: string;
}

export interface Category {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
}

export interface Order {
    id: string;
    userId: string;
    createdAt: string; // Should be a string in ISO format for serialization
    status: 'Delivered' | 'Shipped' | 'Processing';
    total: number;
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: string;
    paymentId?: string;
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

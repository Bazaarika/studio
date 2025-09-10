
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Shirt, Sparkles, User, Spline, PersonStanding, CircleDot } from 'lucide-react';
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
  specifications?: string;
  showcase?: string;
  productHighlights?: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  images: ImageField[];
  status: 'Active' | 'Draft' | 'Pending' | 'Rejected' | 'Approved';
  vendor: string; // User ID of the vendor or 'admin'
  tags: string[];
  hasVariants: boolean;
  variantOptions: VariantOption[];
  variants: GeneratedVariant[];
}

// For displaying products with vendor info in the admin panel
export interface ProductWithVendor extends Product {
    vendorName?: string;
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
  icon: string; // Icon name from lucide-react
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: string;
    updatedAt: string;
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

export interface HomeSection {
    id: string;
    order: number;
    type: 'featured_products' | 'sale_banner';
    title: string;
    description?: string;
    productIds: string[];
}

export interface PopulatedHomeSection extends HomeSection {
    products: Product[];
}

// This is now just for fallback or reference. The source of truth is Firestore.
export const staticCategories = [
  { id: 'kurtis', name: 'Kurtis', icon: User },
  { id: 'sarees', name: 'Sarees', icon: Spline },
  { id: 't-shirts', name: 'T-Shirts', icon: Shirt },
  { id: 'dresses', name: 'Dresses', icon: PersonStanding },
  { id: 'jeans', name: 'Jeans', icon: CircleDot },
  { id: 'ethnic-wear', name: 'Ethnic Wear', icon: Sparkles },
];

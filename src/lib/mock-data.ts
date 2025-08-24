
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Shirt, Diamond, Watch, Footprints, Sparkles, ShoppingBag } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
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
    items: (Product & { quantity: number })[];
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

export const products: Product[] = [
  {
    id: '1',
    name: 'Elegant Floral Dress',
    description: 'A beautiful floral dress perfect for summer occasions. Made from lightweight and breathable fabric.',
    price: 2499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'floral dress',
  },
  {
    id: '2',
    name: 'Classic Leather Watch',
    description: 'A timeless watch with a genuine leather strap and stainless steel case. Water-resistant up to 50m.',
    price: 8999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'watches',
    aiHint: 'leather watch',
  },
  {
    id: '3',
    name: 'Silver Heart Necklace',
    description: 'A delicate sterling silver necklace featuring a heart-shaped pendant. A perfect gift for a loved one.',
    price: 3499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'jewelry',
    aiHint: 'silver necklace',
  },
  {
    id: '4',
    name: 'Running Sneakers',
    description: 'High-performance running sneakers with cushioned soles and a breathable mesh upper. Ideal for daily workouts.',
    price: 4599,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'shoes',
    aiHint: 'running shoes',
  },
  {
    id: '5',
    name: 'Silk Scarf',
    description: 'A luxurious 100% silk scarf with a vibrant print. Can be styled in multiple ways.',
    price: 1899,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'accessories',
    aiHint: 'silk scarf',
  },
  {
    id: '6',
    name: 'Modern Linen Shirt',
    description: 'A stylish and comfortable linen shirt for a relaxed yet sophisticated look. Perfect for warm weather.',
    price: 2999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'linen shirt',
  },
  {
    id: '7',
    name: 'Gold Hoop Earrings',
    description: 'Classic gold hoop earrings that add a touch of elegance to any outfit. Lightweight and comfortable for all-day wear.',
    price: 4999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'jewelry',
    aiHint: 'gold earrings',
  },
  {
    id: '8',
    name: 'Leather Ankle Boots',
    description: 'Chic and versatile leather ankle boots. Features a comfortable block heel and side zipper.',
    price: 6999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'shoes',
    aiHint: 'leather boots',
  },
  {
    id: '9',
    name: 'Canvas Tote Bag',
    description: 'A durable and spacious canvas tote bag, perfect for everyday use, from shopping to beach trips.',
    price: 1599,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'bags',
    aiHint: 'tote bag',
  },
  {
    id: '10',
    name: 'Denim Jacket',
    description: 'A timeless denim jacket with a modern fit. A versatile piece for any wardrobe.',
    price: 4299,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'denim jacket',
  },
  {
    id: '11',
    name: 'Pearl Stud Earrings',
    description: 'Elegant freshwater pearl stud earrings, a classic accessory for any formal or casual occasion.',
    price: 2999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'jewelry',
    aiHint: 'pearl earrings',
  },
  {
    id: '12',
    name: 'Suede Loafers',
    description: 'Comfortable and stylish suede loafers for a smart-casual look.',
    price: 3999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'shoes',
    aiHint: 'suede loafers',
  },
  {
    id: '13',
    name: 'Leather Belt',
    description: 'A high-quality genuine leather belt with a classic buckle.',
    price: 1999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'accessories',
    aiHint: 'leather belt',
  },
  {
    id: '14',
    name: 'Striped Cotton T-Shirt',
    description: 'A soft and breathable cotton t-shirt with a classic striped pattern.',
    price: 1299,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'striped t-shirt',
  },
  {
    id: '15',
    name: 'Digital Sports Watch',
    description: 'A feature-packed digital watch for sports enthusiasts, with a stopwatch, alarm, and backlight.',
    price: 3599,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'watches',
    aiHint: 'digital watch',
  },
  {
    id: '16',
    name: 'Crossbody Bag',
    description: 'A compact and stylish crossbody bag, perfect for carrying your essentials on the go.',
    price: 2799,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'bags',
    aiHint: 'crossbody bag',
  },
  {
    id: '17',
    name: 'Cashmere Sweater',
    description: 'A luxurious and incredibly soft cashmere sweater, perfect for staying warm in style.',
    price: 14999,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'cashmere sweater',
  },
  {
    id: '18',
    name: 'White Canvas Sneakers',
    description: 'Versatile and comfortable white sneakers that pair well with almost any outfit.',
    price: 3299,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'shoes',
    aiHint: 'white sneakers',
  },
  {
    id: '19',
    name: ' Aviator Sunglasses',
    description: 'Classic aviator sunglasses with polarized lenses to protect your eyes from the sun.',
    price: 2499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'accessories',
    aiHint: 'aviator sunglasses',
  },
  {
    id: '20',
    name: 'Tailored Chinos',
    description: 'Smart and comfortable tailored chinos, perfect for both office and casual wear.',
    price: 3499,
    imageUrl: 'https://placehold.co/600x800.png',
    category: 'clothing',
    aiHint: 'tailored chinos',
  },
];


export const orders: Order[] = [
  {
    id: "ORD001",
    date: "June 23, 2024",
    status: "Delivered",
    total: 249.98,
    items: [
      { ...products[1], quantity: 1 },
      { ...products[2], quantity: 1 },
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
    total: 79.99,
    items: [{ ...products[0], quantity: 1 }],
    shippingAddress: '456 Oak Ave, Someville, 67890, India',
    paymentMethod: 'UPI',
    trackingHistory: [
        { status: 'Shipped', date: 'June 25, 2024', location: 'Main Warehouse' },
        { status: 'Order Placed', date: 'June 25, 2024', location: 'Bazaarika.com' },
    ]
  },
];


import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import { Star, Share2 } from 'lucide-react';
import type { Product } from '@/lib/mock-data';
import { ProductActions } from '@/components/product-actions';
import { getProducts } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';

// This function tells Next.js which dynamic routes to pre-render at build time.
export async function generateStaticParams() {
  const products: Product[] = await getProducts();
 
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product: Product | null = await getProduct(params.id);

  if (!product) {
    notFound();
  }
  
  const sizes = [38.5, 39, 40, 41, 41.5];

  return (
    <div>
        <div className="space-y-8 pb-24">
            {/* Image Gallery */}
            <div className="bg-secondary rounded-xl p-4 md:p-8">
                <div className="aspect-square relative">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    data-ai-hint={product.aiHint}
                />
                </div>
            </div>
             <div className="grid grid-cols-5 gap-2 px-8">
                {[product.imageUrl, ...[1, 2, 3].map(() => `https://placehold.co/300x300.png`), product.imageUrl].slice(0, 5).map((img, i) => (
                    <div key={i} className={`aspect-square relative rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'}`}>
                    <Image
                        src={i === 1 || i === 2 || i === 3 ? `https://placehold.co/300x300.png` : product.imageUrl}
                        alt={`${product.name} thumbnail ${i}`}
                        fill
                        className="object-cover"
                        data-ai-hint={product.aiHint}
                    />
                    </div>
                ))}
            </div>


            {/* Product Details */}
            <div className="px-4 space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-muted-foreground font-semibold">{product.category}</p>
                        <h1 className="text-3xl font-bold font-headline">{product.name}</h1>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Share2 />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400"/>
                        <span className="font-bold">4.9</span>
                        <span className="text-sm text-muted-foreground">(235)</span>
                    </div>
                </div>

                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                
                <div>
                    <p className="font-semibold mb-2">Size</p>
                    <div className="flex gap-2">
                        {sizes.map((size, index) => (
                            <Button key={size} variant={index === 2 ? "default" : "outline"} className="w-12 h-12 rounded-full">
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Sticky Footer */}
        <ProductActions product={product} />
    </div>
  );
}

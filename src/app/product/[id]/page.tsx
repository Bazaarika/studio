
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react';
import type { Product } from '@/lib/mock-data';

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product: Product | null = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 pb-24">
        {/* Image Gallery */}
        <div className="grid gap-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border shadow-sm">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={product.aiHint}
            />
            </div>
            <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square relative rounded-lg overflow-hidden border ${i === 1 ? 'ring-2 ring-primary' : ''}`}>
                <Image
                    src={`https://placehold.co/300x300.png`}
                    alt={`${product.name} thumbnail ${i}`}
                    fill
                    className="object-cover opacity-70"
                    data-ai-hint={product.aiHint}
                />
                </div>
            ))}
            </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
            <div>
            <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
            <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-yellow-500">
                    <Star className="h-5 w-5 fill-current"/>
                    <Star className="h-5 w-5 fill-current"/>
                    <Star className="h-5 w-5 fill-current"/>
                    <Star className="h-5 w-5 fill-current"/>
                    <Star className="h-5 w-5 text-muted-foreground fill-muted"/>
                </div>
                <span className="text-sm text-muted-foreground">(123 reviews)</span>
            </div>
            <p className="text-3xl font-semibold text-primary mt-4">₹{product.price.toFixed(2)}</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-10 text-center">1</span>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
            </div>
            
            <Separator />

             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-primary"/>
                <span>Free shipping on orders over ₹500</span>
            </div>
        </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-sm border-t z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                     <div>
                        <p className="text-sm text-muted-foreground">Total price</p>
                        <p className="text-xl md:text-2xl font-bold">₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="lg" className="hidden sm:inline-flex">
                            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                         <Button size="icon" className="sm:hidden">
                            <ShoppingBag className="h-5 w-5" />
                        </Button>
                         <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}


import Image from 'next/image';
import { products } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function ProductPage() {
  const product = products[0];

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="grid gap-4">
        <div className="aspect-square relative rounded-lg overflow-hidden border">
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
             <div key={i} className={`aspect-square relative rounded-lg overflow-hidden border ${i === 1 ? 'border-primary' : ''}`}>
               <Image
                src={`https://placehold.co/300x300.png`}
                alt={`${product.name} thumbnail ${i}`}
                fill
                className="object-cover"
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
          <p className="text-2xl font-semibold text-primary mt-2">₹{product.price.toFixed(2)}</p>
        </div>

        <p className="text-muted-foreground">{product.description}</p>
        
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
          
          <div className="flex gap-2">
            <Button size="lg" className="flex-1">
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

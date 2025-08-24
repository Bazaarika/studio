
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/firebase/firestore';
import { Star, Share2, Minus, Plus } from 'lucide-react';
import type { Product } from '@/lib/mock-data';
import { ProductActions } from '@/components/product-actions';
import { getProducts } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
  const allImages = [product.imageUrl, ...[1, 2, 3].map(() => `https://placehold.co/600x600.png`), product.imageUrl];

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
             <div className="px-8">
                <Carousel opts={{ align: "start", loop: true, }} className="w-full max-w-sm mx-auto">
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {allImages.slice(0, 5).map((img, i) => (
                            <CarouselItem key={i} className="pl-2 md:pl-4 basis-1/4">
                                 <div className={`aspect-square relative rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'}`}>
                                    <Image
                                        src={img}
                                        alt={`${product.name} thumbnail ${i+1}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={product.aiHint}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex"/>
                </Carousel>
            </div>


            {/* Product Details */}
            <div className="px-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-muted-foreground font-semibold">{product.category}</p>
                        <h1 className="text-3xl font-bold font-headline">{product.name}</h1>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Share2 />
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400"/>
                        <span className="font-bold">4.9</span>
                        <span className="text-sm text-muted-foreground">(235)</span>
                    </div>
                     <div className="flex items-center gap-2 bg-secondary p-1 rounded-full">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">1</span>
                         <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <Plus className="h-4 w-4" />
                        </Button>
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

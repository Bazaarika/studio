
"use client";

import Image from 'next/image';
import { Star, Share2, Minus, Plus } from 'lucide-react';
import type { Product } from '@/lib/mock-data';
import { ProductActions } from '@/components/product-actions';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ProductDetailsClient({ product }: { product: Product }) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  
  const allImages = product.images?.length > 0 ? product.images : [{ url: "https://placehold.co/600x800.png", hint: "placeholder image" }];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mainImage = allImages[selectedImageIndex];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error: any) {
        if (error.name !== 'NotAllowedError') {
            console.error('Error sharing:', error);
            toast({
                title: "Could not share",
                description: "There was an error trying to share. This can happen on non-secure connections.",
                variant: "destructive"
            })
        }
      }
    } else {
       toast({
        title: "Share not supported",
        description: "Your browser does not support the share feature.",
        variant: "destructive"
      });
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
        const newQuantity = prev + amount;
        if (newQuantity < 1) return 1;
        // In a real app, you'd check against product.stock
        return newQuantity;
    })
  }
  
  const handleVariantSelect = (optionName: string, value: string) => {
    setSelectedVariant(prev => ({ ...prev, [optionName]: value }));
  };

  return (
    <div>
        <div className="space-y-8 pb-24">
            {/* Image Gallery */}
            <div className="bg-secondary rounded-xl p-4 md:p-8">
                <div className="aspect-square relative">
                <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-contain"
                    data-ai-hint={mainImage.hint}
                />
                </div>
            </div>
             <div className="px-8">
                <Carousel opts={{ align: "start", loop: true, }} className="w-full max-w-sm mx-auto">
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {allImages.map((img, i) => (
                            <CarouselItem key={i} className="pl-2 md:pl-4 basis-1/4">
                                 <button onClick={() => setSelectedImageIndex(i)} className={`aspect-square relative rounded-lg overflow-hidden border-2 w-full ${i === selectedImageIndex ? 'border-primary' : 'border-transparent'}`}>
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} thumbnail ${i+1}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={img.hint}
                                    />
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex"/>
                </Carousel>
            </div>


            {/* Product Details */}
            <div className="px-4 space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-muted-foreground font-semibold">{product.category}</p>
                        <h1 className="text-3xl font-bold font-headline">{product.name}</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
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
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                         <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleQuantityChange(1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                
                {product.hasVariants && product.variantOptions?.length > 0 && (
                    <div className="space-y-4">
                        {product.variantOptions.filter(opt => opt.name && opt.values).map(option => (
                            <div key={option.name}>
                                <p className="font-semibold mb-2">{option.name}</p>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.split(',').map(value => {
                                        const trimmedValue = value.trim();
                                        const isSelected = selectedVariant[option.name] === trimmedValue;
                                        return (
                                            <Button 
                                                key={trimmedValue} 
                                                variant={isSelected ? "default" : "outline"} 
                                                className="rounded-full"
                                                onClick={() => handleVariantSelect(option.name, trimmedValue)}
                                            >
                                                {trimmedValue}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Sticky Footer */}
        <ProductActions product={product} quantity={quantity} />
    </div>
  );
}

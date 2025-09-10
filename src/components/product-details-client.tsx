
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
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';

export function ProductDetailsClient({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const { toast } = useToast();
  const { addProductToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  
  const allImages = product.images?.length > 0 ? product.images : [{ url: "https://placehold.co/600x800.png", hint: "placeholder image" }];

  useEffect(() => {
    if (product.id) {
      addProductToRecentlyViewed(product.id);
    }
  }, [product.id, addProductToRecentlyViewed]);

  const activeVariant = useMemo(() => {
    if (!product.hasVariants || Object.keys(selectedVariant).length === 0) {
      return null;
    }
    // This logic assumes a simple variant ID structure. It might need to be more robust
    // depending on how variant IDs are constructed. For now, it joins the selected values.
    const selectedIdParts = product.variantOptions.map(opt => selectedVariant[opt.name]).filter(Boolean);
    if (selectedIdParts.length !== product.variantOptions.length) return null;
    
    const variantId = selectedIdParts.join(' / ');
    return product.variants.find(v => v.id === variantId) || null;
  }, [product, selectedVariant]);

  const displayPrice = activeVariant ? activeVariant.price : product.price;

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
    <>
      <div className="grid md:grid-cols-2 md:gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                  {allImages.map((img, i) => (
                      <CarouselItem key={i}>
                          <div className="bg-secondary rounded-xl p-4 md:p-8">
                              <div className="aspect-square relative">
                                  <Image
                                      src={img.url}
                                      alt={`${product.name} image ${i + 1}`}
                                      fill
                                      className="object-contain"
                                      data-ai-hint={img.hint}
                                  />
                              </div>
                          </div>
                      </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4" />
              <CarouselNext className="right-2 md:right-4" />
          </Carousel>
        </div>

        {/* Product Details & Actions */}
        <div className="py-6 md:py-0 md:flex md:flex-col">
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-muted-foreground font-semibold">{product.category}</p>
                    <h1 className="text-2xl font-bold font-headline">{product.name}</h1>
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

            <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    {product.specifications && <TabsTrigger value="specifications">Specifications</TabsTrigger>}
                    {product.productHighlights && <TabsTrigger value="highlights">Highlights</TabsTrigger>}
                    {product.showcase && <TabsTrigger value="showcase">Showcase</TabsTrigger>}
                </TabsList>
                <TabsContent value="description" className="mt-4 text-foreground/80 leading-relaxed">
                    {product.description}
                </TabsContent>
                {product.specifications && (
                    <TabsContent value="specifications" className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {product.specifications}
                    </TabsContent>
                )}
                {product.productHighlights && (
                    <TabsContent value="highlights" className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {product.productHighlights}
                    </TabsContent>
                )}
                {product.showcase && (
                    <TabsContent value="showcase" className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {product.showcase}
                    </TabsContent>
                )}
            </Tabs>
          </div>
          
          {/* Actions are now part of the right column on desktop */}
          <div className="mt-auto pt-6">
             <ProductActions product={{...product, price: displayPrice}} quantity={quantity} />
          </div>
        </div>
      </div>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-headline mb-4">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

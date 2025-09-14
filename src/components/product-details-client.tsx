
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
import { useEffect, useState, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from './product-card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper function to parse specifications string into key-value pairs
const parseSpecifications = (specs: string): { key: string, value: string }[] => {
    if (!specs || typeof specs !== 'string') return [];
    return specs.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('- '))
        .map(line => {
            const cleanLine = line.substring(2).trim();
            const parts = cleanLine.split(':');
            const key = parts[0]?.trim() || '';
            const value = parts.slice(1).join(':').trim() || '';
            return { key, value };
        })
        .filter(item => item.key && item.value);
};


export function ProductDetailsClient({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const { toast } = useToast();
  const { addProductToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [isBuyButtonVisible, setIsBuyButtonVisible] = useState(true);
  
  const relatedProductsRef = useRef<HTMLDivElement | null>(null);

  const allImages = product.images?.length > 0 ? product.images : [{ url: "https://placehold.co/600x800.png", hint: "placeholder image" }];

  useEffect(() => {
    if (product.id) {
      addProductToRecentlyViewed(product.id);
    }
  }, [product.id, addProductToRecentlyViewed]);

  // Intersection Observer for hiding the sticky buy button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the related products section is intersecting (visible), hide the button.
        setIsBuyButtonVisible(!entry.isIntersecting);
      },
      {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentRef = relatedProductsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const activeVariant = useMemo(() => {
    if (!product.hasVariants || Object.keys(selectedVariant).length === 0) {
      return null;
    }
    const selectedIdParts = product.variantOptions.map(opt => selectedVariant[opt.name]).filter(Boolean);
    if (selectedIdParts.length !== product.variantOptions.length) return null;
    
    const variantId = selectedIdParts.join(' / ');
    return product.variants.find(v => v.id === variantId) || null;
  }, [product, selectedVariant]);

  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayCompareAtPrice = activeVariant ? undefined : product.compareAtPrice;

  const discountPercent =
    displayCompareAtPrice && displayCompareAtPrice > displayPrice
      ? Math.round(((displayCompareAtPrice - displayPrice) / displayCompareAtPrice) * 100)
      : 0;

  const specificationsList = useMemo(() => parseSpecifications(product.specifications || ''), [product.specifications]);

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
        <div className="-mx-4 md:mx-0">
          <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                  {allImages.map((img, i) => (
                      <CarouselItem key={i}>
                          <div className="bg-secondary rounded-none md:rounded-xl">
                              <div className="aspect-[4/5] relative">
                                  <Image
                                      src={img.url}
                                      alt={`${product.name} image ${i + 1}`}
                                      fill
                                      className="object-cover"
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
            
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">₹{displayPrice.toFixed(2)}</p>
                {displayCompareAtPrice && displayCompareAtPrice > displayPrice && (
                    <p className="text-lg text-muted-foreground line-through">₹{displayCompareAtPrice.toFixed(2)}</p>
                )}
                {discountPercent > 0 && (
                     <Badge variant="destructive">{discountPercent}% OFF</Badge>
                )}
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

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                    <h3 className="text-xl font-bold font-headline">All details</h3>
                </AccordionTrigger>
                <AccordionContent>
                    <Tabs defaultValue="specifications" className="w-full">
                        <TabsList>
                            {specificationsList.length > 0 && <TabsTrigger value="specifications">Specifications</TabsTrigger>}
                            <TabsTrigger value="description">Description</TabsTrigger>
                            {product.productHighlights && <TabsTrigger value="highlights">Highlights</TabsTrigger>}
                            {product.showcase && <TabsTrigger value="showcase">Showcase</TabsTrigger>}
                        </TabsList>
                        {specificationsList.length > 0 && (
                            <TabsContent value="specifications">
                                <div className="mt-4 space-y-4">
                                    <h4 className="text-lg font-semibold">General</h4>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                        {specificationsList.map((spec, index) => (
                                            <div key={index} className="border-b pb-2">
                                                <p className="text-muted-foreground">{spec.key}</p>
                                                <p className="font-medium text-foreground">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center pt-2">
                                        <Button variant="outline" className="rounded-full">
                                            See more <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        )}
                        <TabsContent value="description" className="mt-4 text-foreground/80 leading-relaxed">
                            {product.description}
                        </TabsContent>
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mt-auto pt-6">
             <ProductActions 
                product={{...product, price: displayPrice, compareAtPrice: displayCompareAtPrice}} 
                quantity={quantity}
                isVisible={isBuyButtonVisible}
             />
          </div>
        </div>
      </div>
      
      <div ref={relatedProductsRef}>
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
      </div>
    </>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product, HomeSection } from '@/lib/mock-data';
import Image from 'next/image';

interface FeaturedProductsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onSave: (title: string, selectedProductIds: string[]) => void;
    onUpdate?: (sectionId: string, title: string, selectedProductIds: string[]) => void;
    initialData?: HomeSection | null;
}

export function FeaturedProductsDialog({ isOpen, onClose, products, onSave, onUpdate, initialData }: FeaturedProductsDialogProps) {
    const [title, setTitle] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const isEditMode = !!initialData;

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title);
            setSelectedProductIds(initialData.productIds);
        } else if (!isOpen) {
            // Reset when dialog closes
            setTitle('');
            setSelectedProductIds([]);
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        if (!title || selectedProductIds.length === 0) return;

        if (isEditMode && onUpdate && initialData) {
            onUpdate(initialData.id, title, selectedProductIds);
        } else if (!isEditMode) {
            onSave(title, selectedProductIds);
        }
        
        onClose();
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Section' : 'Create Featured Products Section'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the title or change the featured products.' : 'Give your section a title and select the products you want to feature.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="section-title">Section Title</Label>
                        <Input
                            id="section-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., New Arrivals"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Select Products</Label>
                        <ScrollArea className="h-72 w-full rounded-md border">
                            <div className="p-4">
                                {products.map(product => (
                                    <div key={product.id} className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Image 
                                                src={product.images[0]?.url || ''} 
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                            <span>{product.name}</span>
                                        </div>
                                        <Checkbox
                                            checked={selectedProductIds.includes(product.id!)}
                                            onCheckedChange={() => handleProductSelect(product.id!)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave} disabled={!title || selectedProductIds.length === 0}>
                        {isEditMode ? 'Update Section' : 'Save Section'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

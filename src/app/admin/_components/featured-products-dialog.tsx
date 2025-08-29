
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product } from '@/lib/mock-data';
import Image from 'next/image';

interface FeaturedProductsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onSave: (title: string, selectedProductIds: string[]) => void;
}

export function FeaturedProductsDialog({ isOpen, onClose, products, onSave }: FeaturedProductsDialogProps) {
    const [title, setTitle] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const handleSave = () => {
        if (title && selectedProductIds.length > 0) {
            onSave(title, selectedProductIds);
            onClose();
            // Reset state
            setTitle('');
            setSelectedProductIds([]);
        }
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
                    <DialogTitle>Create Featured Products Section</DialogTitle>
                    <DialogDescription>
                        Give your section a title and select the products you want to feature.
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
                        Save Section
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

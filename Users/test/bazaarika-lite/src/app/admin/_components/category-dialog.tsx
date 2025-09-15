
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, icon: string, imageUrl?: string) => void;
    onUpdate?: (id: string, name: string, icon: string, imageUrl?: string) => void;
    initialData?: Category | null;
}

export function CategoryDialog({ isOpen, onClose, onSave, onUpdate, initialData }: CategoryDialogProps) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const isEditMode = !!initialData;

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setIcon(initialData.icon);
            setImageUrl(initialData.imageUrl || '');
        } else if (!isOpen) {
            // Reset when dialog closes
            setName('');
            setIcon('');
            setImageUrl('');
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        if (!name || (!icon && !imageUrl)) return;

        // If an image URL is provided, we can use a placeholder for the icon name if it's empty.
        // This ensures categories with only images are still valid.
        const iconToSave = icon || (imageUrl ? 'Image' : '');

        if (isEditMode && onUpdate && initialData) {
            onUpdate(initialData.id, name, iconToSave, imageUrl);
        } else if (!isEditMode) {
            onSave(name, iconToSave, imageUrl);
        }
        
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Category' : 'Create Category'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the category details.' : 'Create a new category for your homepage.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                            id="category-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., T-Shirts"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-icon">Lucide Icon Name</Label>
                        <Input
                            id="category-icon"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="e.g., Shirt"
                        />
                         <p className="text-xs text-muted-foreground">
                            Find icon names on <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.
                        </p>
                    </div>
                    <div className="relative my-2">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">OR</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-image-url">Icon Image URL</Label>
                        <Input
                            id="category-image-url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/icon.png"
                        />
                        <p className="text-xs text-muted-foreground">
                           Use a URL for a custom image icon. Overrides Lucide icon.
                        </p>
                        {imageUrl && (
                            <div className="mt-2 flex items-center justify-center rounded-md border bg-muted p-2 h-24 w-24">
                                <Image
                                    src={imageUrl}
                                    alt="Icon Preview"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave} disabled={!name || (!icon && !imageUrl)}>
                        {isEditMode ? 'Update Category' : 'Save Category'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

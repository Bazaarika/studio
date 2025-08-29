
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
    getHomeLayout, 
    getProducts, 
    updateHomeLayoutOrder, 
    deleteHomeSection, 
    addHomeSection, 
    updateHomeSection,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '@/lib/firebase/firestore';
import type { HomeSection, Product, Category } from '@/lib/mock-data';
import { Loader2, PlusCircle, Trash2, GripVertical, Sparkles, Edit } from 'lucide-react';
import Image from 'next/image';
import { FeaturedProductsDialog } from '../_components/featured-products-dialog';
import { generateFestiveSale } from '@/ai/flows/generate-festive-sale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generatePromptBasedSection } from '@/ai/flows/generate-prompt-based-section';
import { CategoryDialog } from '../_components/category-dialog';
import * as LucideIcons from 'lucide-react';

export default function CustomizeHomePage() {
    const [layout, setLayout] = useState<HomeSection[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // Dialog states
    const [isFeaturedDialogOpen, setIsFeaturedDialogOpen] = useState(false);
    const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    
    // Editing states
    const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const { toast } = useToast();

    const fetchData = async () => {
        // No need to setLoading(true) here, let the initial load handle it.
        try {
            const [fetchedLayout, fetchedProducts, fetchedCategories] = await Promise.all([
                getHomeLayout(),
                getProducts(),
                getCategories()
            ]);
            setLayout(fetchedLayout);
            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({ title: "Error", description: "Could not fetch home page data.", variant: "destructive" });
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData().finally(() => setLoading(false));
    }, []);

    // Section handlers
    const handleDeleteSection = async (sectionId: string) => {
        try {
            await deleteHomeSection(sectionId);
            toast({ title: "Success", description: "Section deleted successfully." });
            fetchData();
        } catch (error) {
            console.error("Failed to delete section:", error);
            toast({ title: "Error", description: "Could not delete section.", variant: "destructive" });
        }
    };

    const handleAddFeaturedSection = async (title: string, selectedProductIds: string[]) => {
        const newSection = {
            title,
            productIds: selectedProductIds,
            order: layout.length,
            type: 'featured_products' as const,
        };
        try {
            await addHomeSection(newSection);
            toast({ title: "Success", description: "Section added successfully." });
            fetchData();
        } catch (err) {
            console.error("Failed to add section:", err);
            toast({ title: "Error", description: "Could not add section.", variant: "destructive" });
        }
    };

    const handleUpdateSection = async (sectionId: string, title: string, productIds: string[]) => {
        try {
            await updateHomeSection(sectionId, { title, productIds });
            toast({ title: "Success", description: "Section updated successfully." });
            fetchData();
        } catch (error) {
            console.error("Failed to update section:", error);
            toast({ title: "Error", description: "Could not update section.", variant: "destructive" });
        } finally {
            setEditingSection(null);
        }
    };

    const handleOpenEditDialog = (section: HomeSection) => {
        setEditingSection(section);
        setIsFeaturedDialogOpen(true);
    };

    const handleCloseFeaturedDialog = () => {
        setIsFeaturedDialogOpen(false);
        setEditingSection(null);
    };
    
    // Category handlers
    const handleAddCategory = async (name: string, icon: string) => {
        try {
            await addCategory({ name, icon });
            toast({ title: "Category Added", description: `"${name}" has been added.` });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not add category.", variant: "destructive" });
        }
    };
    
    const handleUpdateCategory = async (id: string, name: string, icon: string) => {
        try {
            await updateCategory(id, { name, icon });
            toast({ title: "Category Updated", description: `"${name}" has been updated.` });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not update category.", variant: "destructive" });
        }
    };
    
    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            toast({ title: "Category Deleted" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete category.", variant: "destructive" });
        }
    };

    const handleOpenEditCategoryDialog = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    }
    
    const handleCloseCategoryDialog = () => {
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
    }

    // AI handlers
    const handleAddFestiveSale = async () => {
        setIsAiLoading(true);
        try {
            const saleDetails = await generateFestiveSale();
            const keywords = saleDetails.suggestedProductKeywords.map(k => k.toLowerCase());
            const festiveProductIds = products
                .filter(p => {
                    const productText = `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
                    return keywords.some(key => productText.includes(key));
                })
                .slice(0, 8)
                .map(p => p.id!);

             if (festiveProductIds.length === 0) {
                toast({ title: "No Products Found", description: `AI could not find any products for the ${saleDetails.festivalName} sale.`, variant: "destructive"});
                setIsAiLoading(false);
                return;
             }

            const newSection = {
                title: saleDetails.saleTitle,
                description: saleDetails.saleDescription,
                productIds: festiveProductIds,
                order: layout.length,
                type: 'sale_banner' as const
            };

            await addHomeSection(newSection);
            toast({ title: "AI Section Added!", description: `${saleDetails.festivalName} sale section has been created.` });
            fetchData();
        } catch(e) {
            console.error("Failed to generate festive sale:", e);
            toast({ title: "AI Error", description: "Could not generate festive sale section.", variant: "destructive" });
        } finally {
            setIsAiLoading(false);
        }
    }
    
    const handleGenerateFromPrompt = async () => {
        if (!customPrompt) {
            toast({ title: "Prompt is empty", description: "Please write a prompt to generate a section.", variant: "destructive" });
            return;
        }
        setIsAiLoading(true);
        try {
            const productsForAi = products.map(p => ({
                id: p.id!, name: p.name, description: p.description, category: p.category, price: p.price, tags: p.tags,
            }));

            const result = await generatePromptBasedSection({ prompt: customPrompt, products: productsForAi });
            
            if (result.productIds.length === 0) {
                toast({ title: "No Products Found", description: "AI could not find any products matching your prompt. Try being more specific.", variant: "destructive" });
                setIsAiLoading(false);
                return;
            }

            const newSection = {
                title: result.title, description: result.description, productIds: result.productIds.slice(0, 8), order: layout.length, type: 'featured_products' as const,
            };

            await addHomeSection(newSection);
            toast({ title: "AI Section Created!", description: `The section "${result.title}" has been added to your home page.` });
            fetchData();
            setIsPromptDialogOpen(false);
            setCustomPrompt('');
        } catch(e) {
            console.error("Failed to generate from prompt:", e);
            toast({ title: "AI Error", description: "Could not generate section from your prompt. Please try again.", variant: "destructive" });
        } finally {
            setIsAiLoading(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">Customize Home Page</h1>
                        <p className="text-muted-foreground">Add, remove, and reorder sections on your home page.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={() => setIsPromptDialogOpen(true)} variant="outline">
                            <Sparkles className="mr-2 h-4 w-4"/>
                            Create with AI Prompt
                        </Button>
                        <Button onClick={() => setIsFeaturedDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Featured Section
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Sections</CardTitle>
                        <CardDescription>Drag and drop to reorder sections. Changes are not saved automatically.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {layout.map((section) => (
                            <Card key={section.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        <div>
                                            <CardTitle>{section.title}</CardTitle>
                                            {section.description && <CardDescription>{section.description}</CardDescription>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(section)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {section.productIds.map(productId => {
                                            const product = products.find(p => p.id === productId);
                                            if (!product) return null;
                                            return (
                                                <div key={productId} className="flex flex-col items-center gap-2 text-center">
                                                    <Image 
                                                        src={product.images[0]?.url || ''} 
                                                        alt={product.name}
                                                        width={80}
                                                        height={80}
                                                        className="aspect-square w-full rounded-md object-cover"
                                                    />
                                                    <p className="text-xs font-medium truncate w-full">{product.name}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {layout.length === 0 && (
                            <p className="text-muted-foreground text-center py-8">No sections found. Add one to get started!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Manage Categories</CardTitle>
                                <CardDescription>Add, edit, or delete categories.</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setIsCategoryDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {categories.map((category) => {
                             // @ts-ignore
                            const IconComponent = LucideIcons[category.icon] || LucideIcons.ShoppingBag;
                            return (
                                <div key={category.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                    <div className="flex items-center gap-3">
                                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditCategoryDialog(category)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteCategory(category.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                         {categories.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No categories created yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

             <FeaturedProductsDialog
                isOpen={isFeaturedDialogOpen}
                onClose={handleCloseFeaturedDialog}
                products={products}
                onSave={handleAddFeaturedSection}
                onUpdate={handleUpdateSection}
                initialData={editingSection}
             />
            
            <CategoryDialog 
                isOpen={isCategoryDialogOpen}
                onClose={handleCloseCategoryDialog}
                onSave={handleAddCategory}
                onUpdate={handleUpdateCategory}
                initialData={editingCategory}
            />

            <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Section with AI Prompt</DialogTitle>
                        <DialogDescription>
                            Describe the section you want to create. AI will generate a title and find matching products.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="custom-prompt">Your Prompt</Label>
                        <Textarea
                            id="custom-prompt"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g., 'A collection of our best party wear sarees under 5000' or 'Summer collection of floral dresses'"
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPromptDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleGenerateFromPrompt} disabled={isAiLoading}>
                             {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                            Generate Section
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

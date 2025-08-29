
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getHomeLayout, getProducts, updateHomeLayoutOrder, deleteHomeSection, addHomeSection } from '@/lib/firebase/firestore';
import type { HomeSection, Product } from '@/lib/mock-data';
import { Loader2, PlusCircle, Trash2, GripVertical, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { FeaturedProductsDialog } from '../_components/featured-products-dialog';
import { generateFestiveSale } from '@/ai/flows/generate-festive-sale';

export default function CustomizeHomePage() {
    const [layout, setLayout] = useState<HomeSection[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchedLayout, fetchedProducts] = await Promise.all([
                getHomeLayout(),
                getProducts()
            ]);
            setLayout(fetchedLayout);
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({ title: "Error", description: "Could not fetch home page data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteSection = async (sectionId: string) => {
        try {
            await deleteHomeSection(sectionId);
            toast({ title: "Success", description: "Section deleted successfully." });
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to delete section:", error);
            toast({ title: "Error", description: "Could not delete section.", variant: "destructive" });
        }
    };

    const handleAddFeaturedSection = (title: string, selectedProductIds: string[]) => {
        const newSection = {
            title,
            productIds: selectedProductIds,
            order: layout.length,
            type: 'featured_products' as const,
        };
        
        addHomeSection(newSection)
            .then(() => {
                toast({ title: "Success", description: "Section added successfully." });
                fetchData();
            })
            .catch(err => {
                 console.error("Failed to add section:", err);
                 toast({ title: "Error", description: "Could not add section.", variant: "destructive" });
            });
    };

    const handleAddFestiveSale = async () => {
        setIsAiLoading(true);
        try {
            const saleDetails = await generateFestiveSale();

            // Find products that match the keywords from AI
            const keywords = saleDetails.suggestedProductKeywords.map(k => k.toLowerCase());
            const festiveProductIds = products
                .filter(p => {
                    const productText = `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
                    return keywords.some(key => productText.includes(key));
                })
                .slice(0, 8) // Limit to 8 products for the section
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


    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customize Home Page</h1>
                    <p className="text-muted-foreground">Drag and drop to reorder sections.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddFestiveSale} variant="outline" disabled={isAiLoading}>
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        Add Festive Sale (AI)
                    </Button>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Featured Section
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {layout.map((section, index) => (
                    <Card key={section.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle>{section.title}</CardTitle>
                                    {section.description && <CardDescription>{section.description}</CardDescription>}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
            </div>

             <FeaturedProductsDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                products={products}
                onSave={handleAddFeaturedSection}
             />
        </div>
    );
}

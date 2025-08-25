
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addProduct } from "@/lib/firebase/firestore";
import { Loader2, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { categories, mockProducts } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateProductDetails } from "@/ai/flows/generate-product-details";

export default function AddProductPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [compareAtPrice, setCompareAtPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [aiHint, setAiHint] = useState("");
    const [sku, setSku] = useState("");
    const [stock, setStock] = useState("");
    const [status, setStatus] = useState("Active");
    const [tags, setTags] = useState("");
    const [vendor, setVendor] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSampleLoading, setIsSampleLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || !description || !price || !category || !imageUrl || !aiHint || !stock || !status) {
            toast({
                title: "Missing fields",
                description: "Please fill out all required fields.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            // This is where you would normally save all the new fields.
            // For now, we are still using the simplified addProduct function.
            await addProduct({
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl,
                aiHint,
            });

            toast({
                title: "Product added!",
                description: `${name} has been added to the store.`,
            });

            // Reset form
            setName("");
            setDescription("");
            setPrice("");
            setCompareAtPrice("");
            setCategory("");
            setImageUrl("");
            setAiHint("");
            setSku("");
            setStock("");
            setStatus("Active");
            setTags("");
            setVendor("");


        } catch (error) {
            console.error("Error adding product:", error);
            toast({
                title: "Error",
                description: "Could not add product. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddSampleProduct = async () => {
        setIsSampleLoading(true);
        try {
            const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
            
            await addProduct(randomProduct);

            toast({
                title: "Sample product added!",
                description: `${randomProduct.name} has been added to the store.`,
            });
        } catch (error: any) {
             console.error("Error adding sample product:", error);
            toast({
                title: "Error Adding Sample Product",
                description: "Could not add sample product. Please check console for details.",
                variant: "destructive",
            });
        } finally {
            setIsSampleLoading(false);
        }
    };

    const handleGenerateDetails = async () => {
        if (!name) {
            toast({
                title: "Product Name is missing",
                description: "Please enter a product name to generate details.",
                variant: "destructive",
            });
            return;
        }
        setIsAiLoading(true);
        try {
            const result = await generateProductDetails({ productName: name });
            setDescription(result.description);
            // Find a matching category or default to the first one
            const suggestedCategory = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
            setCategory(suggestedCategory ? suggestedCategory.id : categories[0]?.id || "");
            setTags(result.tags.join(", "));
             toast({
                title: "AI Details Generated!",
                description: "The product details have been filled in.",
            });
        } catch (error) {
            console.error("Error generating product details:", error);
            toast({
                title: "AI Generation Failed",
                description: "Could not generate details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAiLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>
                                Fill in the details for your new product.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <div className="flex gap-2">
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Elegant Floral Dress" />
                                    <Button variant="outline" size="icon" type="button" onClick={handleGenerateDetails} disabled={isAiLoading}>
                                        {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        <span className="sr-only">Generate with AI</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Product Description</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl">Image URL</Label>
                                    <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://placehold.co/600x800.png" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aiHint">AI Image Hint</Label>
                                    <Input id="aiHint" value={aiHint} onChange={(e) => setAiHint(e.target.value)} placeholder="e.g., floral dress" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (INR)</Label>
                                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 2499" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="compareAtPrice">Compare-at price (INR)</Label>
                                    <Input id="compareAtPrice" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="e.g., 2999" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                     <Card>
                        <CardHeader>
                            <CardTitle>Inventory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="FLORAL-DRESS-S" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Set status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">Draft</Badge>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Active">
                                         <div className="flex items-center gap-2">
                                            <Badge variant="default">Active</Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vendor">Vendor</Label>
                                <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g., Bazaarika" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., summer, new" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles /> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleAddSampleProduct} disabled={isSampleLoading} className="w-full" variant="secondary" type="button">
                                {isSampleLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                    </>
                                ) : (
                                    "Add Sample Product"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3 flex justify-end">
                     <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save Product"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}

    
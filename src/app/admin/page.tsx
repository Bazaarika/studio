
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addProduct, addTestData } from "@/lib/firebase/firestore";
import { Loader2, PlusCircle, Sparkles, TestTube } from "lucide-react";
import { useState } from "react";
import { categories, mockProducts } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [aiHint, setAiHint] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSampleLoading, setIsSampleLoading] = useState(false);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || !description || !price || !category || !imageUrl || !aiHint) {
            toast({
                title: "Missing fields",
                description: "Please fill out all fields.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
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
            setCategory("");
            setImageUrl("");
            setAiHint("");

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
        } catch (error) {
             console.error("Error adding sample product:", error);
            toast({
                title: "Error",
                description: "Could not add sample product. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSampleLoading(false);
        }
    };

    const handleTestDatabase = async () => {
        setIsTestLoading(true);
        try {
            await addTestData();
            toast({
                title: "Success!",
                description: "Saved 'raj kumar' to the database.",
            });
        } catch (error) {
            console.error("Database test error:", error);
            toast({
                title: "Database Test Failed",
                description: "Could not save data. Check the console for errors.",
                variant: "destructive",
            });
        } finally {
            setIsTestLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <PlusCircle /> Add a New Product
                    </CardTitle>
                    <CardDescription>
                        Fill in the details below to add a new product to your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Elegant Floral Dress" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Product Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (INR)</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 79.99" />
                            </div>
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
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://placehold.co/600x800.png" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aiHint">AI Image Hint</Label>
                            <Input id="aiHint" value={aiHint} onChange={(e) => setAiHint(e.target.value)} placeholder="e.g., floral dress" />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                </>
                            ) : (
                                "Add Product"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Sparkles /> Quick Actions
                    </CardTitle>
                    <CardDescription>
                        Use this to quickly populate your store with sample data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAddSampleProduct} disabled={isSampleLoading} className="w-full" variant="secondary">
                         {isSampleLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                            </>
                        ) : (
                            "Add Random Sample Product"
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <TestTube /> Database Connection Test
                    </CardTitle>
                    <CardDescription>
                        Click this button to add a simple piece of data to the database to verify the connection is working.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleTestDatabase} disabled={isTestLoading} className="w-full" variant="outline">
                         {isTestLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...
                            </>
                        ) : (
                            "Add 'raj kumar' to Database"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

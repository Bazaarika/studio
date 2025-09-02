
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addProduct, getCategories, updateProduct } from "@/lib/firebase/firestore";
import { Loader2, PlusCircle, Sparkles, Trash2, ImageIcon, Image as ImageIconSparkles } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import type { Product, ImageField, VariantOption, GeneratedVariant, Category } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateProductDetails } from "@/ai/flows/generate-product-details";
import { generateImageHint } from "@/ai/flows/generate-image-hint";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { generateProductDetailsFromImage } from "@/ai/flows/generate-product-details-from-image";
import { generateRichProductDetails } from "@/ai/flows/generate-rich-product-details";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFormProps {
    mode: 'add' | 'edit';
    initialData?: Product | null;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [specifications, setSpecifications] = useState("");
    const [showcase, setShowcase] = useState("");
    const [productHighlights, setProductHighlights] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState<ImageField[]>([{ url: "", hint: "" }]);
    const [status, setStatus] = useState("Active");
    const [tags, setTags] = useState("");
    const [vendor, setVendor] = useState("");
    const [price, setPrice] = useState("");
    const [compareAtPrice, setCompareAtPrice] = useState("");
    const [stock, setStock] = useState("");
    const [sku, setSku] = useState("");

    // Variants State
    const [hasVariants, setHasVariants] = useState(false);
    const [variantOptions, setVariantOptions] = useState<VariantOption[]>([{ name: "Size", values: "" }]);
    const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

    // Data from DB
    const [categories, setCategories] = useState<Category[]>([]);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isRichAiLoading, setIsRichAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isHintLoading, setIsHintLoading] = useState<number | null>(null);
    const [isImageGenLoading, setIsImageGenLoading] = useState(false);
    const [imageUrlForGen, setImageUrlForGen] = useState("");
    const [isGenDialogOpen, setIsGenDialogOpen] = useState(false);
    
    useEffect(() => {
        async function fetchCategories() {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        if (mode === 'edit' && initialData && categories.length > 0) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setSpecifications(initialData.specifications || "");
            setShowcase(initialData.showcase || "");
            setProductHighlights(initialData.productHighlights || "");
            setCategory(initialData.category || "");
            setImages(initialData.images?.length > 0 ? initialData.images : [{ url: "", hint: "" }]);
            setStatus(initialData.status || "Active");
            setTags(initialData.tags?.join(", ") || "");
            setVendor(initialData.vendor || "");
            setPrice(initialData.price?.toString() || "");
            setCompareAtPrice(initialData.compareAtPrice?.toString() || "");
            setStock(initialData.stock?.toString() || "");
            setSku(initialData.sku || "");
            setHasVariants(initialData.hasVariants || false);
            setVariantOptions(initialData.variantOptions?.length > 0 ? initialData.variantOptions : [{ name: "Size", values: "" }]);
            setGeneratedVariants(initialData.variants || []);
        }
    }, [mode, initialData, categories]);
    
    // Generate variant combinations
    const memoizedVariants = useMemo(() => {
        if (!hasVariants || variantOptions.every(opt => !opt.values.trim())) {
            return [];
        }
    
        const options = variantOptions
            .filter(opt => opt.name.trim() && opt.values.trim())
            .map(opt => ({
                name: opt.name.trim(),
                values: opt.values.split(',').map(v => v.trim()).filter(v => v),
            }));
    
        if (options.length === 0) return [];
    
        const combinations = options.reduce((acc, option) => {
            if (acc.length === 0) {
                return option.values.map(value => ({ id: value, [option.name]: value, price: '', stock: '' }));
            }
            const newAcc: GeneratedVariant[] = [];
            acc.forEach(existing => {
                option.values.forEach(value => {
                    newAcc.push({
                        ...existing,
                        id: `${existing.id} / ${value}`,
                        [option.name]: value,
                    });
                });
            });
            return newAcc;
        }, [] as GeneratedVariant[]);
    
        return combinations;
    }, [hasVariants, variantOptions]);

    useEffect(() => {
        // Only auto-generate if we are in 'add' mode, or if the variant options change in 'edit' mode.
        // Don't overwrite existing variant data on initial load of 'edit'.
        if (mode === 'add' || (mode === 'edit' && JSON.stringify(memoizedVariants) !== JSON.stringify(initialData?.variants))) {
           setGeneratedVariants(memoizedVariants);
        }
    }, [memoizedVariants, mode, initialData?.variants]);

    const handleImageChange = (index: number, field: keyof ImageField, value: string) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, { url: "", hint: "" }]);
    };

    const removeImageField = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };
    
    const handleVariantOptionChange = (index: number, field: keyof VariantOption, value: string) => {
        const newOptions = [...variantOptions];
        newOptions[index][field] = value;
        setVariantOptions(newOptions);
    };

    const addVariantOption = () => {
        if (variantOptions.length < 2) {
             setVariantOptions([...variantOptions, { name: "Color", values: "" }]);
        }
    };

    const removeVariantOption = (index: number) => {
        const newOptions = variantOptions.filter((_, i) => i !== index);
        setVariantOptions(newOptions);
    };

    const handleGeneratedVariantChange = (id: string, field: 'price' | 'stock', value: string) => {
        setGeneratedVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setSpecifications("");
        setShowcase("");
        setProductHighlights("");
        setPrice("");
        setCompareAtPrice("");
        setStock("");
        setSku("");
        setCategory("");
        setImages([{ url: "", hint: "" }]);
        setStatus("Active");
        setTags("");
        setVendor("");
        setHasVariants(false);
        setVariantOptions([{ name: "Size", values: "" }]);
        setGeneratedVariants([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const mainImage = images[0];

        if (!name || !description || !category || !mainImage?.url) {
            toast({
                title: "Missing fields",
                description: "Please fill out Name, Description, Category, and add at least one image.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        
        if (!hasVariants && (!price || !stock)) {
             toast({
                title: "Missing fields",
                description: "Please provide Price and Stock for the product.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (hasVariants && generatedVariants.some(v => !v.price || !v.stock)) {
            toast({
                title: "Missing Variant Details",
                description: "Please fill out Price and Stock for all generated variants.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const productData: Omit<Product, 'id'> = {
                name,
                description,
                specifications,
                showcase,
                productHighlights,
                category,
                status,
                vendor,
                tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
                images,
                price: parseFloat(price) || 0,
                compareAtPrice: parseFloat(compareAtPrice) || 0,
                stock: parseInt(stock, 10) || 0,
                sku,
                hasVariants,
                variantOptions: hasVariants ? variantOptions : [],
                variants: hasVariants ? generatedVariants.map(v => ({...v, price: parseFloat(v.price as string), stock: parseInt(v.stock as string, 10)})) : [],
            };
            
            if (mode === 'add') {
                await addProduct(productData);
                toast({
                    title: "Product added!",
                    description: `${name} has been added to the store.`,
                });
                resetForm();
            } else if (mode === 'edit' && initialData?.id) {
                await updateProduct(initialData.id, productData);
                 toast({
                    title: "Product updated!",
                    description: `${name} has been updated successfully.`,
                });
            }

            router.push('/admin/products');

        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "Could not save product. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
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
            const result = await generateProductDetails({ productName: name, categories: categories.map(c => c.name) });
            setDescription(result.description);
            const suggestedCategory = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
            setCategory(suggestedCategory ? suggestedCategory.name : categories[0]?.name || "");
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

    const handleGenerateRichDetails = async () => {
        if (!aiPrompt) {
            toast({
                title: "AI Prompt is missing",
                description: "Please enter a prompt to generate rich details.",
                variant: "destructive",
            });
            return;
        }
        setIsRichAiLoading(true);
        try {
            const result = await generateRichProductDetails({ prompt: aiPrompt });
            setDescription(result.description);
            setSpecifications(result.specifications);
            setShowcase(result.showcase);
            setProductHighlights(result.productHighlights);
            toast({
                title: "AI Content Generated!",
                description: "All content tabs have been filled with generated details.",
            });
        } catch (error) {
            console.error("Error generating rich product details:", error);
            toast({
                title: "AI Generation Failed",
                description: "Could not generate rich content. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsRichAiLoading(false);
        }
    };

    const handleGenerateImageHint = async (index: number) => {
        const imageUrl = images[index].url;
        if (!imageUrl) {
            toast({
                title: "Image URL is missing",
                description: "Please enter an image URL to generate a hint.",
                variant: "destructive",
            });
            return;
        }

        setIsHintLoading(index);
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                const result = await generateImageHint({ imageDataUri: base64data });
                handleImageChange(index, 'hint', result.hint);
                toast({
                    title: "AI Hint Generated!",
                    description: `Hint set to "${result.hint}".`,
                });
                setIsHintLoading(null);
            };
        } catch (error) {
             console.error("Error generating image hint:", error);
            toast({
                title: "AI Hint Generation Failed",
                description: "Could not analyze the image. Check the URL and try again.",
                variant: "destructive",
            });
            setIsHintLoading(null);
        }
    };
    
    const handleOpenGenDialog = () => {
        // Pre-fill the dialog with the first image URL if it exists
        if (images.length > 0 && images[0].url) {
            setImageUrlForGen(images[0].url);
        }
        setIsGenDialogOpen(true);
    };

    const handleGenerateFromImage = async () => {
        if (!imageUrlForGen) {
            toast({
                title: "Image URL is missing",
                description: "Please enter an image URL to generate details.",
                variant: "destructive",
            });
            return;
        }
        setIsImageGenLoading(true);
        try {
            const response = await fetch(imageUrlForGen);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                const result = await generateProductDetailsFromImage({ imageDataUri: base64data, categories: categories.map(c => c.name) });

                setName(result.name);
                setDescription(result.description);
                setSpecifications(result.specifications);
                setShowcase(result.showcase);
                setProductHighlights(result.productHighlights);
                const suggestedCategory = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
                setCategory(suggestedCategory ? suggestedCategory.name : categories[0]?.name || "");
                setTags(result.tags.join(", "));
                setImages([{ url: imageUrlForGen, hint: result.aiHint }]);

                toast({
                    title: "Product Details Generated!",
                    description: "All product details have been filled in from the image.",
                });
                setIsImageGenLoading(false);
                setIsGenDialogOpen(false);
            };
        } catch (error) {
            console.error("Error generating details from image:", error);
            toast({
                title: "AI Generation Failed",
                description: "Could not analyze the image. Check the URL and try again.",
                variant: "destructive",
            });
            setIsImageGenLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Product Details</CardTitle>
                                    <CardDescription>
                                        Fill in the details for your new product.
                                    </CardDescription>
                                </div>
                                 <Dialog open={isGenDialogOpen} onOpenChange={setIsGenDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" type="button" onClick={handleOpenGenDialog}>
                                            <ImageIconSparkles className="mr-2 h-4 w-4" />
                                            Generate from Image
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Generate Product Details from Image</DialogTitle>
                                            <DialogDescription>
                                                Enter an image URL, and AI will automatically generate a title, description, category, tags, and more.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <Label htmlFor="gen-image-url">Image URL</Label>
                                            <Input 
                                                id="gen-image-url" 
                                                placeholder="https://placehold.co/600x800.png" 
                                                value={imageUrlForGen}
                                                onChange={(e) => setImageUrlForGen(e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" onClick={handleGenerateFromImage} disabled={isImageGenLoading}>
                                                {isImageGenLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : "Generate Details"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
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
                            
                            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ai-prompt">Generate Rich Content with AI</Label>
                                    <Textarea 
                                        id="ai-prompt" 
                                        value={aiPrompt} 
                                        onChange={(e) => setAiPrompt(e.target.value)} 
                                        placeholder="Enter a prompt, e.g., 'blue floral summer dress' or 'heavy work bridal lehenga'"
                                        rows={2}
                                    />
                                </div>
                                <Button type="button" onClick={handleGenerateRichDetails} disabled={isRichAiLoading}>
                                    {isRichAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Content for Tabs
                                </Button>
                            </div>

                            <Tabs defaultValue="description">
                                <TabsList>
                                    <TabsTrigger value="description">Product Description</TabsTrigger>
                                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                    <TabsTrigger value="showcase">Showcase</TabsTrigger>
                                    <TabsTrigger value="highlights">Product Highlights</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-4">
                                     <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." rows={8} />
                                </TabsContent>
                                <TabsContent value="specifications" className="mt-4">
                                     <Textarea value={specifications} onChange={(e) => setSpecifications(e.target.value)} placeholder="e.g., Material: Cotton, Fit: Regular..." rows={8} />
                                </TabsContent>
                                <TabsContent value="showcase" className="mt-4">
                                     <Textarea value={showcase} onChange={(e) => setShowcase(e.target.value)} placeholder="Describe how to showcase this product..." rows={8} />
                                </TabsContent>
                                <TabsContent value="highlights" className="mt-4">
                                    <Textarea value={productHighlights} onChange={(e) => setProductHighlights(e.target.value)} placeholder="e.g., - Hand-stitched embroidery..." rows={8} />
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {images.map((image, index) => (
                                <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-end border p-4 rounded-md relative">
                                    <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center relative overflow-hidden">
                                        {image.url ? (
                                            <Image src={image.url} alt={`Preview ${index}`} fill className="object-cover" />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`imageUrl-${index}`}>Image URL</Label>
                                        <Input id={`imageUrl-${index}`} value={image.url} onChange={(e) => handleImageChange(index, 'url', e.target.value)} placeholder="https://placehold.co/600x800.png" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`aiHint-${index}`}>AI Image Hint</Label>
                                        <div className="flex gap-2">
                                            <Input id={`aiHint-${index}`} value={image.hint} onChange={(e) => handleImageChange(index, 'hint', e.target.value)} placeholder="e.g., floral dress" />
                                            <Button variant="outline" size="icon" type="button" onClick={() => handleGenerateImageHint(index)} disabled={isHintLoading === index}>
                                                {isHintLoading === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                                <span className="sr-only">Generate Hint</span>
                                            </Button>
                                        </div>
                                    </div>
                                    {images.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeImageField(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Remove Image</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addImageField}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                            </Button>
                        </CardContent>
                    </Card>
                    
                    {!hasVariants && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                        <Label htmlFor="price">Price (INR)</Label>
                                        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 2499" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="compareAtPrice">Compare-at price (INR)</Label>
                                        <Input id="compareAtPrice" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="e.g., 2999" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Inventory</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g., TSHIRT-B-S" />
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <Card>
                        <CardHeader>
                             <CardTitle>Variants</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex items-center space-x-2 mb-4">
                                <Checkbox id="hasVariants" checked={hasVariants} onCheckedChange={(checked) => setHasVariants(checked as boolean)} />
                                <label htmlFor="hasVariants" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    This product has multiple options, like different sizes or colors
                                </label>
                            </div>
                        
                            {hasVariants && (
                                <>
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Options</Label>
                                        {variantOptions.map((option, index) => (
                                            <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end p-4 border rounded-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`option-name-${index}`}>Option name</Label>
                                                    <Input id={`option-name-${index}`} value={option.name} onChange={(e) => handleVariantOptionChange(index, 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`option-values-${index}`}>Option values</Label>
                                                    <Input id={`option-values-${index}`} value={option.values} onChange={(e) => handleVariantOptionChange(index, 'values', e.target.value)} placeholder="e.g., S, M, L (comma-separated)" />
                                                </div>
                                                {variantOptions.length > 1 && (
                                                    <Button variant="ghost" size="icon" onClick={() => removeVariantOption(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {variantOptions.length < 2 && (
                                            <Button type="button" variant="outline" onClick={addVariantOption}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add another option
                                            </Button>
                                        )}
                                    </div>
                                    {generatedVariants.length > 0 && (
                                        <div className="space-y-2">
                                                <Label className="font-semibold">Variant Pricing & Stock</Label>
                                                <div className="border rounded-md">
                                                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-4 py-2 font-medium bg-muted">
                                                        <div>Variant</div>
                                                        <div>Price (INR)</div>
                                                        <div>Stock</div>
                                                    </div>
                                                    {generatedVariants.map(variant => (
                                                        <div key={variant.id} className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-4 py-2 items-center border-t">
                                                            <div>{variant.id}</div>
                                                            <div><Input type="number" placeholder="e.g., 2499" value={variant.price} onChange={(e) => handleGeneratedVariantChange(variant.id, 'price', e.target.value)} /></div>
                                                            <div><Input type="number" placeholder="e.g., 100" value={variant.stock} onChange={(e) => handleGeneratedVariantChange(variant.id, 'stock', e.target.value)} /></div>
                                                        </div>
                                                    ))}
                                                </div>
                                        </div>
                                    )}
                                </>
                            )}
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
                                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
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
                                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., summer, new (comma-separated)" />
                            </div>
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

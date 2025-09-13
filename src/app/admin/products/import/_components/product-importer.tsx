
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { Loader2, Upload, FileCheck2, List } from "lucide-react";
import type { Product, VariantOption, GeneratedVariant, ImageField } from "@/lib/mock-data";
import { batchAddProducts } from "@/lib/firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CsvRow {
    [key: string]: string;
}

export function ProductImporter() {
    const [csvData, setCsvData] = useState<CsvRow[]>([]);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(true);
            setFileName(file.name);
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvData(results.data as CsvRow[]);
                    setIsLoading(false);
                    toast({
                        title: "File Parsed",
                        description: `${results.data.length} rows found in ${file.name}.`
                    });
                },
                error: (error: any) => {
                    setIsLoading(false);
                    toast({
                        title: "Error Parsing CSV",
                        description: error.message,
                        variant: "destructive"
                    });
                }
            });
        }
    };
    
    const processProducts = (): Omit<Product, 'id'>[] => {
        const productsMap = new Map<string, Omit<Product, 'id'>>();
        let currentProductHandle: string | null = null;
        let currentProduct: Omit<Product, 'id'> | null = null;
    
        csvData.forEach(row => {
            const handle = row['Handle'];
            if (!handle) return;
    
            if (handle !== currentProductHandle) {
                // New product starts here
                if (currentProduct) {
                    productsMap.set(currentProductHandle!, { ...currentProduct });
                }
    
                currentProductHandle = handle;
                currentProduct = {
                    name: row['Title'],
                    description: row['Body (HTML)'],
                    category: row['Custom Product Type'],
                    price: parseFloat(row['Variant Price']) || 0,
                    compareAtPrice: parseFloat(row['Variant Compare At Price']) || 0,
                    stock: parseInt(row['Variant Inventory Qty'], 10) || 0,
                    sku: row['Variant SKU'],
                    images: row['Image Src'] ? [{ url: row['Image Src'], hint: row['Image Alt Text'] || '' }] : [],
                    status: (row['Status'] as any) || 'Draft',
                    vendor: row['Vendor'] || 'admin',
                    tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
                    hasVariants: false,
                    variantOptions: [],
                    variants: [],
                };
            }
    
            if (currentProduct) {
                const option1Name = row['Option1 Name'];
                const option1Value = row['Option1 Value'];
    
                if (option1Name && option1Value) {
                    currentProduct.hasVariants = true;
                    let option = currentProduct.variantOptions.find(opt => opt.name === option1Name);
                    if (!option) {
                        option = { name: option1Name, values: '' };
                        currentProduct.variantOptions.push(option);
                    }
                    if (!option.values.split(',').map(v => v.trim()).includes(option1Value)) {
                        option.values = (option.values ? `${option.values},` : '') + option1Value;
                    }
    
                    // This is a variant row
                    currentProduct.variants.push({
                        id: option1Value, // Simple ID for now
                        [option1Name]: option1Value,
                        price: parseFloat(row['Variant Price']) || 0,
                        stock: parseInt(row['Variant Inventory Qty'], 10) || 0,
                    });
                }
            }
        });
    
        // Add the last product
        if (currentProduct && currentProductHandle) {
            productsMap.set(currentProductHandle, { ...currentProduct });
        }
    
        return Array.from(productsMap.values());
    };
    
    const productsToUpload = processProducts();

    const handleImport = async () => {
        if (productsToUpload.length === 0) {
            toast({ title: "No products to import", variant: "destructive" });
            return;
        }
        setIsUploading(true);
        try {
            await batchAddProducts(productsToUpload);
            toast({
                title: "Import Successful!",
                description: `${productsToUpload.length} products have been added to the store.`
            });
            router.push('/admin/products');
        } catch (error) {
            console.error("Error batch adding products:", error);
            toast({ title: "Import Failed", description: "Could not save products to the database.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Upload CSV</CardTitle>
                    <CardDescription>
                        Select a CSV file to import your products. The file should match the Shopify CSV format.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="csv-upload" className="flex-grow">
                             <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isLoading || isUploading} />
                             <Button asChild variant="outline" className="w-full cursor-pointer">
                                <div>
                                    <Upload className="mr-2 h-4 w-4" /> {fileName || 'Choose a file...'}
                                </div>
                             </Button>
                        </Label>
                        <Button onClick={handleImport} disabled={productsToUpload.length === 0 || isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileCheck2 className="mr-2 h-4 w-4" />}
                             Import {productsToUpload.length > 0 ? productsToUpload.length : ''} Products
                        </Button>
                    </div>
                     {isLoading && <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span>Parsing file...</span></div>}
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><List className="h-5 w-5" /> Preview</CardTitle>
                    <CardDescription>
                        Showing a preview of the products that will be imported. Variants are grouped under the main product.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="border rounded-md">
                        <div className="grid grid-cols-[64px_3fr_1fr_1fr_1fr] p-2 bg-muted font-semibold text-sm">
                            <div/>
                            <div>Title</div>
                            <div>Status</div>
                            <div>Variants</div>
                            <div>Price</div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                        {productsToUpload.length > 0 ? productsToUpload.map((product, index) => (
                           <div key={index} className="grid grid-cols-[64px_3fr_1fr_1fr_1fr] p-2 border-t items-center">
                                <div>
                                    <Image
                                        src={product.images[0]?.url || 'https://placehold.co/64x64.png'}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                                <div>{product.name}</div>
                                <div>{product.status}</div>
                                <div>{product.hasVariants ? product.variants.length : 1}</div>
                                <div>₹{product.price.toFixed(2)}</div>
                           </div>
                        )) : (
                            <div className="text-center p-8 text-muted-foreground">Upload a CSV file to see a preview.</div>
                        )}
                        </div>
                    </div>
                 </CardContent>
             </Card>
        </div>
    )
}

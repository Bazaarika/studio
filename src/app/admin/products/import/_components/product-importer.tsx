
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { Loader2, Upload, FileCheck2, List, Eye } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { batchAddProducts } from "@/lib/firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CsvRow {
    [key: string]: string;
}

type ProductToUpload = Omit<Product, 'id'>;

export function ProductImporter() {
    const [csvData, setCsvData] = useState<CsvRow[]>([]);
    const [productsToUpload, setProductsToUpload] = useState<ProductToUpload[]>([]);
    const [selectedHandles, setSelectedHandles] = useState<string[]>([]);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // State for the details modal
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState<CsvRow | null>(null);

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
                    const parsedData = results.data as CsvRow[];
                    setCsvData(parsedData);
                    const processedProducts = processProducts(parsedData);
                    setProductsToUpload(processedProducts);
                    setSelectedHandles(processedProducts.map(p => p.name)); // Select all by default
                    setIsLoading(false);
                    toast({
                        title: "File Parsed",
                        description: `${processedProducts.length} products found in ${file.name}.`
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
    
    const processProducts = (data: CsvRow[]): ProductToUpload[] => {
        const productsMap = new Map<string, ProductToUpload>();

        data.forEach(row => {
            const handle = row['Handle'];
            if (!handle) return;

            if (!productsMap.has(handle)) {
                // This is a new product
                productsMap.set(handle, {
                    name: row['Title'],
                    description: row['Body (HTML)'] || '',
                    category: row['Custom Product Type'] || 'Uncategorized',
                    price: parseFloat(row['Variant Price']) || 0,
                    compareAtPrice: parseFloat(row['Variant Compare At Price']) || 0,
                    stock: 0, // Will be summed from variants
                    sku: row['Variant SKU'] || '',
                    images: row['Image Src'] ? [{ url: row['Image Src'], hint: row['Image Alt Text'] || '' }] : [],
                    status: (row['Status'] as any) || 'Draft',
                    vendor: row['Vendor'] || 'admin',
                    tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
                    hasVariants: false,
                    variantOptions: [],
                    variants: [],
                });
            }

            const product = productsMap.get(handle)!;

            // Handle variants
            const option1Name = row['Option1 Name'];
            const option1Value = row['Option1 Value'];

            if (option1Name && option1Value) {
                product.hasVariants = true;

                // Add variant option type if not present
                let option = product.variantOptions.find(opt => opt.name === option1Name);
                if (!option) {
                    option = { name: option1Name, values: '' };
                    product.variantOptions.push(option);
                }
                
                // Add variant option value if not present
                const values = option.values.split(',').map(v => v.trim()).filter(Boolean);
                if (!values.includes(option1Value)) {
                    values.push(option1Value);
                    option.values = values.join(', ');
                }

                // Add the variant details
                product.variants.push({
                    id: option1Value,
                    [option1Name]: option1Value,
                    price: parseFloat(row['Variant Price']) || 0,
                    stock: parseInt(row['Variant Inventory Qty'], 10) || 0,
                });

                // Sum variant stock for total stock
                product.stock += parseInt(row['Variant Inventory Qty'], 10) || 0;
            } else {
                 // If no variants, use the main product stock
                product.stock = parseInt(row['Variant Inventory Qty'], 10) || 0;
            }

        });

        return Array.from(productsMap.values());
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedHandles(productsToUpload.map(p => p.name));
        } else {
            setSelectedHandles([]);
        }
    };
    
    const handleSelectRow = (handle: string) => {
        setSelectedHandles(prev => 
            prev.includes(handle)
                ? prev.filter(h => h !== handle)
                : [...prev, handle]
        );
    };

    const handleViewDetails = (productName: string) => {
        const productRawData = csvData.find(row => row['Title'] === productName);
        if (productRawData) {
            setSelectedProductDetails(productRawData);
            setIsDetailsModalOpen(true);
        }
    };

    const handleImport = async () => {
        const selectedProducts = productsToUpload.filter(p => selectedHandles.includes(p.name));
        if (selectedProducts.length === 0) {
            toast({ title: "No products selected", description: "Please select at least one product to import.", variant: "destructive" });
            return;
        }
        setIsUploading(true);
        try {
            await batchAddProducts(selectedProducts);
            toast({
                title: "Import Successful!",
                description: `${selectedProducts.length} products have been added to the store.`
            });
            router.push('/admin/products');
        } catch (error) {
            console.error("Error batch adding products:", error);
            toast({ title: "Import Failed", description: "Could not save products to the database.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const isAllSelected = productsToUpload.length > 0 && selectedHandles.length === productsToUpload.length;

    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Upload CSV</CardTitle>
                    <CardDescription>
                        Select a Shopify-formatted CSV file to import your products.
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
                        <Button onClick={handleImport} disabled={selectedHandles.length === 0 || isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileCheck2 className="mr-2 h-4 w-4" />}
                             Import {selectedHandles.length > 0 ? `(${selectedHandles.length})` : ''} Products
                        </Button>
                    </div>
                     {isLoading && <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span>Parsing file...</span></div>}
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><List className="h-5 w-5" /> Preview</CardTitle>
                    <CardDescription>
                       Select the products you want to import from the CSV file.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox 
                                            checked={isAllSelected}
                                            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productsToUpload.length > 0 ? productsToUpload.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={selectedHandles.includes(product.name)}
                                            onCheckedChange={() => handleSelectRow(product.name)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Image
                                            src={product.images[0]?.url || 'https://placehold.co/64x64.png'}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(product.name)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Full Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            Upload a CSV file to see a preview.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                 </CardContent>
             </Card>

            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Full Product Details</DialogTitle>
                        <DialogDescription>
                           This is all the data for the selected product from the CSV file.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProductDetails && (
                        <ScrollArea className="h-96 w-full rounded-md border p-4">
                            <div className="space-y-2">
                                {Object.entries(selectedProductDetails).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-[1fr_2fr] gap-4 text-sm">
                                        <span className="font-semibold text-muted-foreground">{key}</span>
                                        <span className="break-words">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

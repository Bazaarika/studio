
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Image as ImageIcon, Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateImagePrompt } from "@/ai/flows/generate-image-prompt";

export default function ImagePrompterPage() {
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ productDescription: string; imagePrompt: string } | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!imageUrl) {
            toast({ title: "Image URL is required", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await generateImagePrompt({ imageUrl });
            setResult(response);
        } catch (error) {
            console.error("Failed to generate image prompt:", error);
            toast({
                title: "AI Generation Failed",
                description: "Could not generate prompt from the image. Please check the URL and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (result?.imagePrompt) {
            navigator.clipboard.writeText(result.imagePrompt);
            toast({ title: "Prompt Copied!", description: "The prompt has been copied to your clipboard." });
        }
    }

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Image Prompter</CardTitle>
                        <CardDescription>
                            Enter a product image URL to generate a creative prompt for AI image generation tools like Midjourney or DALL-E.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Product Image URL</Label>
                            <Input
                                id="image-url"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Image...</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Generate Prompt</>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {imageUrl && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Image Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                                <Image 
                                    src={imageUrl} 
                                    alt="Product Preview" 
                                    fill 
                                    className="object-contain" 
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                                <ImageIcon className="h-12 w-12 text-muted-foreground absolute" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Generated Prompt</CardTitle>
                        <CardDescription>
                            Copy this prompt and paste it into your favorite AI image generator.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading && (
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                                </div>
                                <div className="space-y-2">
                                     <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                                     <div className="h-20 bg-muted rounded animate-pulse w-full"></div>
                                </div>
                             </div>
                        )}
                        {result && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Product Description</Label>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                                        {result.productDescription}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image-prompt">Image Prompt</Label>
                                    <Textarea
                                        id="image-prompt"
                                        readOnly
                                        value={result.imagePrompt}
                                        className="h-48"
                                    />
                                </div>
                                <Button onClick={handleCopy} className="w-full">
                                    <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                                </Button>
                            </div>
                        )}
                         {!isLoading && !result && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                                <Sparkles className="h-10 w-10 mb-2" />
                                <p>Your generated prompt will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

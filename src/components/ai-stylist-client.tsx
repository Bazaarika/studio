
"use client";

import { useState } from "react";
import Image from "next/image";
import { getStyleSuggestions } from "@/ai/flows/style-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Upload } from "lucide-react";

export function AiStylistClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageDataUri(dataUri);
        setSuggestions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri) {
      toast({
        title: "No image selected",
        description: "Please upload an image of your outfit.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const result = await getStyleSuggestions({ outfitImageDataUri: imageDataUri });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error getting style suggestions:", error);
      toast({
        title: "An error occurred",
        description: "Failed to get style suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Upload className="h-6 w-6" /> Upload Your Outfit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-secondary/30 relative">
            {imagePreview ? (
              <Image src={imagePreview} alt="Outfit preview" fill className="object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Image preview will appear here</p>
              </div>
            )}
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
          <Button onClick={handleSubmit} disabled={isLoading || !imageDataUri} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Suggestions...
              </>
            ) : (
              "Get Styling Suggestions"
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" /> Styling Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
             <div className="space-y-3">
               <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
               <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
               <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
             </div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <ul className="list-disc list-inside space-y-3 text-foreground/80">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )}
          {!isLoading && suggestions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Your AI-powered style tips will appear here!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

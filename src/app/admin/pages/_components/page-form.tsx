"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, FileText } from "lucide-react";
import type { Page } from "@/lib/mock-data";
import { addPage, updatePage } from "@/lib/firebase/firestore";
import { generatePageContent } from "@/ai/flows/generate-page-content";

interface PageFormProps {
    mode: 'add' | 'edit';
    initialData?: Page | null;
}

export function PageForm({ mode, initialData }: PageFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setTitle(initialData.title || "");
            setSlug(initialData.slug || "");
            setContent(initialData.content || "");
        }
    }, [mode, initialData]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Auto-generate slug from title, only in 'add' mode
        if (mode === 'add') {
            const newSlug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s\/-]/g, '') // remove special chars but allow slashes
                .replace(/\s+/g, '-')         // replace spaces with hyphens
                .replace(/-+/g, '-');        // remove consecutive hyphens
            setSlug(newSlug);
        }
    };

    const handleGenerateContent = async () => {
        if (!aiPrompt) {
            toast({ title: "Prompt is empty", description: "Please enter a topic for the AI to write about.", variant: "destructive" });
            return;
        }
        setIsAiLoading(true);
        try {
            const result = await generatePageContent({ topic: aiPrompt });
            setContent(result.content);
            toast({ title: "Content Generated!", description: "AI has generated the content for your page." });
        } catch (error) {
            console.error("AI content generation failed:", error);
            toast({ title: "AI Error", description: "Could not generate content. Please try again.", variant: "destructive" });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!title || !slug || !content) {
            toast({ title: "Missing fields", description: "Please fill out Title, Slug, and Content.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const pageData = { title, slug, content };
            if (mode === 'add') {
                await addPage(pageData);
                toast({ title: "Page Created!", description: `The page "${title}" has been successfully created.` });
            } else if (mode === 'edit' && initialData?.id) {
                await updatePage(initialData.id, pageData);
                toast({ title: "Page Updated!", description: `The page "${title}" has been successfully updated.` });
            }
            router.push('/admin/pages');
        } catch (error) {
            console.error("Error saving page:", error);
            toast({ title: "Save Error", description: "Could not save the page. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Details</CardTitle>
                            <CardDescription>Fill in the details for your new page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Page Title</Label>
                                <Input id="title" value={title} onChange={handleTitleChange} placeholder="e.g., About Us" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g., about-us or info/contact" />
                                <p className="text-xs text-muted-foreground">This will be the URL of your page: yourstore.com/{slug}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Page Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-prompt">AI Content Generation</Label>
                                <div className="flex gap-2">
                                    <Input id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., Write a privacy policy" />
                                    <Button variant="outline" type="button" onClick={handleGenerateContent} disabled={isAiLoading}>
                                        {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        <span className="sr-only">Generate with AI</span>
                                    </Button>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="content">Content Body</Label>
                                <Textarea 
                                    id="content" 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    placeholder="Write your page content here..." 
                                    rows={15}
                                />
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
                            mode === 'add' ? "Create Page" : "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}

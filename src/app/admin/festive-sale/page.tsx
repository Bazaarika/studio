
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getFestiveSaleSettings, saveFestiveSaleSettings, type FestiveSaleSettings } from "@/lib/firebase/firestore";
import { Loader2, Sparkles, Save } from "lucide-react";

export default function FestiveSaleAdminPage() {
    const [settings, setSettings] = useState<FestiveSaleSettings>({
        aiMode: true,
        manualTitle: "",
        manualDescription: "",
        manualKeywords: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchSettings() {
            setIsLoading(true);
            try {
                const fetchedSettings = await getFestiveSaleSettings();
                if (fetchedSettings) {
                    setSettings(fetchedSettings);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast({
                    title: "Error",
                    description: "Could not load festive sale settings.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, [toast]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveFestiveSaleSettings(settings);
            toast({
                title: "Settings Saved!",
                description: "Your festive sale settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Save Failed",
                description: "Could not save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Festive Sale Settings</CardTitle>
                    <CardDescription>
                        Manage the Festive Sale section on your homepage. Use AI to automate it or set the details manually.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="ai-mode" className="text-base flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Enable AI Mode
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Let AI automatically detect the next festival and set the sale theme.
                            </p>
                        </div>
                        <Switch
                            id="ai-mode"
                            checked={settings.aiMode}
                            onCheckedChange={(checked) => setSettings(s => ({ ...s, aiMode: checked }))}
                        />
                    </div>

                    {!settings.aiMode && (
                        <div className="space-y-6">
                            <CardTitle>Manual Configuration</CardTitle>
                            <div className="space-y-2">
                                <Label htmlFor="manualTitle">Sale Title</Label>
                                <Input
                                    id="manualTitle"
                                    value={settings.manualTitle}
                                    onChange={(e) => setSettings(s => ({ ...s, manualTitle: e.target.value }))}
                                    placeholder="e.g., Dazzling Diwali Deals"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="manualDescription">Sale Description</Label>
                                <Textarea
                                    id="manualDescription"
                                    value={settings.manualDescription}
                                    onChange={(e) => setSettings(s => ({ ...s, manualDescription: e.target.value }))}
                                    placeholder="e.g., Light up your festive season with our exclusive collection."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="manualKeywords">Product Keywords</Label>
                                <Input
                                    id="manualKeywords"
                                    value={settings.manualKeywords}
                                    onChange={(e) => setSettings(s => ({ ...s, manualKeywords: e.target.value }))}
                                    placeholder="e.g., saree, kurta, ethnic, gifts (comma-separated)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Products matching these keywords will be shown in the sale section.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

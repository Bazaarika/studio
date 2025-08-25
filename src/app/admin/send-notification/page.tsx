
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { sendPushNotification } from "@/lib/firebase/actions";

export default function SendNotificationPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [topic, setTopic] = useState('all'); // New state for topic
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body || !topic) {
            toast({
                title: "Missing Fields",
                description: "Title, Message, and Topic are required.",
                variant: "destructive"
            });
            return;
        }
        setIsLoading(true);

        try {
            await sendPushNotification({ title, body, topic, icon: iconUrl, image: imageUrl });
            toast({
                title: "Notification Sent!",
                description: `Your notification has been sent to the "${topic}" topic.`
            });
            setTitle('');
            setBody('');
            setIconUrl('');
            setImageUrl('');
            // We keep the topic field as is, in case the admin wants to send another to the same topic.
        } catch (error) {
            console.error("Failed to send notification:", error);
            toast({
                title: "Failed to Send",
                description: "There was an error sending the notification. Check the server logs.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Send Push Notification</CardTitle>
                    <CardDescription>
                        Compose and send a notification to all subscribed users in a specific topic.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input 
                                id="topic" 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="e.g., all"
                                required
                            />
                             <p className="text-xs text-muted-foreground">The notification will be sent to users subscribed to this topic.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Notification Title</Label>
                            <Input 
                                id="title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="e.g., ✨ New Collection is Here!"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body">Notification Message</Label>
                            <Textarea 
                                id="body" 
                                value={body} 
                                onChange={(e) => setBody(e.target.value)} 
                                placeholder="e.g., Check out the latest summer styles."
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="iconUrl">Icon URL (Optional)</Label>
                            <Input 
                                id="iconUrl" 
                                value={iconUrl} 
                                onChange={(e) => setIconUrl(e.target.value)} 
                                placeholder="https://.../icon.png"
                            />
                             <p className="text-xs text-muted-foreground">A small icon for the notification.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <Input 
                                id="imageUrl" 
                                value={imageUrl} 
                                onChange={(e) => setImageUrl(e.target.value)} 
                                placeholder="https://.../image.png"
                            />
                            <p className="text-xs text-muted-foreground">A larger image to show when the notification is expanded.</p>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading} size="lg">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Send Notification
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

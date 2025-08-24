
import { AiStylistClient } from "@/components/ai-stylist-client";
import { Bot } from "lucide-react";

export default function AiStylistPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center space-y-4">
        <Bot className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold font-headline">AI Personal Stylist</h1>
        <p className="text-muted-foreground text-lg">
          Upload a photo of an outfit, and our AI will give you styling suggestions to enhance your look!
        </p>
      </header>

      <div className="mt-10">
        <AiStylistClient />
      </div>
    </div>
  );
}

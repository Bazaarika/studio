
import { getPageBySlug } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export default async function CustomPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    if (!slug) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    // An advanced parser to convert markdown-like text to proper HTML elements, handling blocks.
    const formatContent = (content: string) => {
        const blocks = content.split(/\n\s*\n/); // Split by one or more empty lines

        return blocks.map((block, blockIndex) => {
            const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
            if (lines.length === 0) {
                return null;
            }

            // Check for list items
            const isList = lines.every(line => line.startsWith('* '));
            if (isList) {
                return (
                    <ul key={blockIndex} className="list-disc pl-5 my-4 space-y-1">
                        {lines.map((line, lineIndex) => (
                            <li key={lineIndex}>{line.substring(2)}</li>
                        ))}
                    </ul>
                );
            }

            // Check for headings
            const firstLine = lines[0];
            if (firstLine.startsWith('### ')) {
                return <h3 key={blockIndex} className="text-xl font-semibold mt-4 mb-2">{firstLine.substring(4)}</h3>;
            }
            if (firstLine.startsWith('## ')) {
                return <h2 key={blockIndex} className="text-2xl font-bold mt-6 mb-3">{firstLine.substring(3)}</h2>;
            }
            if (firstLine.startsWith('# ')) {
                return <h1 key={blockIndex} className="text-3xl font-bold font-headline mb-4">{firstLine.substring(2)}</h1>;
            }

            // Default to paragraph
            return (
                <p key={blockIndex} className="leading-relaxed my-4">
                    {block}
                </p>
            );
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold font-headline">{page.title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none text-foreground">
                    {formatContent(page.content)}
                </CardContent>
            </Card>
        </div>
    );
}

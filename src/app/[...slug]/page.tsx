
import { getPageBySlug } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import Link from 'next/link';

// Helper function to parse inline markdown (bold, italics, links)
const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Regex for bold, italics, and links
    const combinedRegex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|\[(.*?)\]\((.*?)\)/g;
    
    const parts = text.split(combinedRegex);
    
    const nodes = [];
    let keyIndex = 0;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;

        // **Bold**
        if (i > 0 && parts[i-1] === `**${part}**`) {
            nodes.push(<strong key={`bold-${keyIndex++}`}>{part}</strong>);
        }
        // *Italic*
        else if (i > 0 && parts[i-1] === `*${part}*`) {
            nodes.push(<em key={`italic-${keyIndex++}`}>{part}</em>);
        }
        // [Link](url)
        else if (i > 0 && parts[i-1] && parts[i-1].startsWith('[') && parts[i-1].endsWith(')')) {
            const match = /\[(.*?)\]\((.*?)\)/.exec(parts[i-1]);
            if (match) {
                 nodes.push(<Link href={match[2]} key={`link-${keyIndex++}`} className="text-primary underline hover:text-primary/80">{match[1]}</Link>);
            }
        }
        // Check if the part is not part of a markdown sequence that has been processed
        else if (
            (i === 0 || !parts[i-1] || (!parts[i-1].startsWith('**') && !parts[i-1].startsWith('*') && !parts[i-1].startsWith('[')))
            && (i === parts.length-1 || !parts[i+1] || (!parts[i+1].startsWith('**') && !parts[i+1].startsWith('*') && !parts[i+1].startsWith('(')))
        ) {
             if (!/(\*\*)|(\*)|(\[.*?\]\(.*?\))/.test(part)) {
                nodes.push(part);
            }
        }
    }

    // A simpler fallback for when the complex regex fails to split correctly
    if (nodes.length === 0) return text;
    
    // Using React.createElement to avoid key warnings on simple string arrays
    return React.createElement(React.Fragment, {}, ...nodes.map((node, index) => 
        React.createElement(React.Fragment, { key: index }, node)
    ));
};


export default async function CustomPage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug.join('/');
    if (!slug) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    // An advanced parser to convert markdown text to proper HTML elements.
    const formatContent = (content: string) => {
        const blocks = content.split(/\n\s*\n/); // Split by one or more empty lines

        return blocks.map((block, blockIndex) => {
            const trimmedBlock = block.trim();
            if (!trimmedBlock) return null;

            // Check for list items first
            if (trimmedBlock.split('\n').every(line => line.trim().startsWith('* '))) {
                const listItems = trimmedBlock.split('\n').map(line => line.trim().substring(2));
                return (
                    <ul key={blockIndex} className="list-disc pl-5 my-4 space-y-1">
                        {listItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{parseInlineMarkdown(item)}</li>
                        ))}
                    </ul>
                );
            }

            // Check for headings
            if (trimmedBlock.startsWith('# ')) {
                return <h1 key={blockIndex} className="text-3xl font-bold font-headline mt-8 mb-4">{parseInlineMarkdown(trimmedBlock.substring(2))}</h1>;
            }
            if (trimmedBlock.startsWith('## ')) {
                return <h2 key={blockIndex} className="text-2xl font-bold mt-6 mb-3">{parseInlineMarkdown(trimmedBlock.substring(3))}</h2>;
            }
            if (trimmedBlock.startsWith('### ')) {
                return <h3 key={blockIndex} className="text-xl font-semibold mt-4 mb-2">{parseInlineMarkdown(trimmedBlock.substring(4))}</h3>;
            }

            // Default to paragraph
            return (
                <p key={blockIndex} className="leading-relaxed my-4">
                    {parseInlineMarkdown(trimmedBlock)}
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

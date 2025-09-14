
import { getPageBySlug } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This component is responsible for rendering custom pages created in the admin panel.
// It uses a dynamic route to handle any single-level slug like /about-us, /privacy-policy etc.

// Helper function to convert markdown to basic HTML
const MarkdownToHtml = ({ content }: { content: string }) => {
    const htmlContent = content
        .split('\n')
        .map((line, index) => {
            if (line.startsWith('# ')) {
                return `<h1 key=${index} class="text-3xl font-bold font-headline mt-6 mb-4">${line.substring(2)}</h1>`;
            }
            if (line.startsWith('## ')) {
                return `<h2 key=${index} class="text-2xl font-bold font-headline mt-4 mb-3">${line.substring(3)}</h2>`;
            }
            if (line.startsWith('### ')) {
                return `<h3 key=${index} class="text-xl font-bold font-headline mt-3 mb-2">${line.substring(4)}</h3>`;
            }
            if (line.startsWith('* ')) {
                return `<li key=${index} class="ml-5 list-disc">${line.substring(2)}</li>`;
            }
            if (line.trim() === '') {
                return '<br />';
            }
            return `<p key=${index} class="mb-4">${line}</p>`;
        })
        .join('');

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


export default async function CustomPage({ params }: { params: { slug: string } }) {
    if (!params.slug) {
        notFound();
    }
    
    const slug = params.slug;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold font-headline">{page.title}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                   <MarkdownToHtml content={page.content} />
                </CardContent>
            </Card>
        </div>
    );
}

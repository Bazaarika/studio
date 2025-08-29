
import { getPageBySlug } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CustomPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    if (!slug) {
        notFound();
    }

    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    // A simple parser to convert markdown-like text to basic HTML elements
    const formatContent = (content: string) => {
        return content.split('\n').map((line, index) => {
            line = line.trim();
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold font-headline mb-4">{line.substring(2)}</h1>;
            }
             if (line.startsWith('* ')) {
                return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
            }
            if (line === '') {
                return <br key={index} />;
            }
            if (line.trim().length > 0) {
              return <p key={index} className="leading-relaxed my-2">{line}</p>;
            }
            return null;
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

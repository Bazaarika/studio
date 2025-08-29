
'use server';
/**
 * @fileOverview An AI flow to generate content for a custom page based on a topic.
 *
 * - generatePageContent - A function that accepts a topic and returns formatted page content.
 * - GeneratePageContentInput - The input type for the function.
 * - GeneratePageContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePageContentInputSchema = z.object({
  topic: z.string().describe("The topic or title for the page content, e.g., 'About Us', 'Privacy Policy', 'Shipping Information'."),
});
export type GeneratePageContentInput = z.infer<typeof GeneratePageContentInputSchema>;

const GeneratePageContentOutputSchema = z.object({
  content: z.string().describe("The full page content formatted using Markdown. Use headings (e.g., '# Title', '## Subtitle'), paragraphs, and bulleted lists (e.g., '* Item 1'). Do not use HTML tags."),
});
export type GeneratePageContentOutput = z.infer<typeof GeneratePageContentOutputSchema>;

export async function generatePageContent(input: GeneratePageContentInput): Promise<GeneratePageContentOutput> {
  return generatePageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePageContentPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GeneratePageContentInputSchema},
  output: {schema: GeneratePageContentOutputSchema},
  prompt: `You are a professional content writer for an e-commerce website called "Bazaarika".

Your task is to generate the full content for a web page based on the given topic. The content should be well-structured, professional, and suitable for an online fashion store.

IMPORTANT: You MUST format your entire output using Markdown syntax.
- For headings, use '#', '##', or '###'.
- For lists, use '* ' for each item.
- Do NOT use any HTML tags like '<h1>' or '<ul>'.

- Start with a clear and relevant main heading (e.g., '# About Us').
- Use subheadings ('##') to organize the content into logical sections.
- Write clear and concise paragraphs.
- Use bullet points ('* ') if it makes the information easier to read.
- The tone should be helpful and customer-friendly.

Topic: "{{{topic}}}"
`,
});

const generatePageContentFlow = ai.defineFlow(
  {
    name: 'generatePageContentFlow',
    inputSchema: GeneratePageContentInputSchema,
    outputSchema: GeneratePageContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

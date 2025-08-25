
'use server';
/**
 * @fileOverview An AI flow to generate product details from a product name.
 *
 * - generateProductDetails - A function that accepts a product name and returns a description, category, and tags.
 * - GenerateProductDetailsInput - The input type for the generateProductDetails function.
 * - GenerateProductDetailsOutput - The return type for the generateProductDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { categories } from '@/lib/mock-data';

const GenerateProductDetailsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

const GenerateProductDetailsOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed product description (2-3 sentences).'),
  category: z.string().describe('The most relevant product category.'),
  tags: z.array(z.string()).describe('An array of 2-3 relevant tags for the product.'),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const validCategories = categories.map(c => c.name).join(', ');

const prompt = ai.definePrompt({
  name: 'generateProductDetailsPrompt',
  input: {schema: GenerateProductDetailsInputSchema},
  output: {schema: GenerateProductDetailsOutputSchema},
  prompt: `You are an expert e-commerce copywriter.
  
  Given the following product name, generate a compelling product description, suggest the most appropriate category, and provide a few relevant tags.

  Product Name: {{{productName}}}

  Valid Categories: ${validCategories}

  Instructions:
  - The description should be engaging and highlight key features, between 2 and 3 sentences.
  - The category must be one of the "Valid Categories" provided.
  - Provide 2 to 3 relevant tags as an array of strings.`,
});

const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
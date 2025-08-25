
'use server';
/**
 * @fileOverview An AI flow to generate product categories from a list of products.
 *
 * - generateCategories - A function that accepts product data and returns a list of categories.
 * - GenerateCategoriesInput - The input type for the function.
 * - GenerateCategoriesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define a schema for a single product's essential details for categorization
const ProductDetailSchema = z.object({
  name: z.string().describe('The name of the product.'),
  description: z.string().describe('The description of the product.'),
});

const GenerateCategoriesInputSchema = z.object({
  products: z.array(ProductDetailSchema).describe('An array of product details.'),
});
export type GenerateCategoriesInput = z.infer<typeof GenerateCategoriesInputSchema>;

const GenerateCategoriesOutputSchema = z.object({
  categories: z.array(z.string()).describe('An array of unique, relevant, and concise category names suggested for the provided products.'),
});
export type GenerateCategoriesOutput = z.infer<typeof GenerateCategoriesOutputSchema>;

export async function generateCategories(input: GenerateCategoriesInput): Promise<GenerateCategoriesOutput> {
  return generateCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCategoriesPrompt',
  input: {schema: GenerateCategoriesInputSchema},
  output: {schema: GenerateCategoriesOutputSchema},
  prompt: `You are an expert e-commerce merchandiser responsible for organizing products into categories.

Analyze the following list of products and generate a concise list of unique, relevant category names. The categories should be simple, intuitive for shoppers, and based on the most common themes in the product list.

Examples of good categories: "Dresses", "Footwear", "Tops", "Jewelry", "Formal Wear", "Accessories".

Do not include a generic "All" or "Everything" category.

Product List:
{{#each products}}
- Name: {{{name}}}, Description: {{{description}}}
{{/each}}
`,
});

const generateCategoriesFlow = ai.defineFlow(
  {
    name: 'generateCategoriesFlow',
    inputSchema: GenerateCategoriesInputSchema,
    outputSchema: GenerateCategoriesOutputSchema,
  },
  async input => {
    if (input.products.length === 0) {
      return { categories: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

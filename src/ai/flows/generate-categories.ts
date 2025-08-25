
'use server';
/**
 * @fileOverview An AI flow to generate product categories with associated keywords from a list of products.
 *
 * - generateCategories - A function that accepts product data and returns a list of categories with keywords.
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

const CategorySchema = z.object({
    name: z.string().describe('A concise and relevant category name.'),
    keywords: z.array(z.string()).describe('A list of 3-5 keywords or search terms that define this category. For example, for "Formal Wear", keywords could be ["gown", "suit", "tuxedo", "evening dress"]. For "Tops", keywords could be ["t-shirt", "blouse", "kurti", "tank top"].'),
});

const GenerateCategoriesOutputSchema = z.object({
  categories: z.array(CategorySchema).describe('An array of unique, relevant, and concise category objects suggested for the provided products.'),
});
export type GenerateCategoriesOutput = z.infer<typeof GenerateCategoriesOutputSchema>;
export type AiCategory = z.infer<typeof CategorySchema>;


export async function generateCategories(input: GenerateCategoriesInput): Promise<GenerateCategoriesOutput> {
  return generateCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCategoriesPrompt',
  input: {schema: GenerateCategoriesInputSchema},
  output: {schema: GenerateCategoriesOutputSchema},
  prompt: `You are an expert e-commerce merchandiser responsible for organizing products into categories.

Analyze the following list of products and generate a concise list of unique, relevant category names. The categories should be simple and intuitive for shoppers.

For each category, you MUST provide a list of 3-5 relevant keywords. These keywords should be common search terms or product types that fall under that category. This is crucial for filtering.

Examples of good categories and their keywords:
- Category: "Dresses", Keywords: ["dress", "gown", "frock", "maxi", "midi"]
- Category: "Footwear", Keywords: ["shoes", "boots", "sandals", "heels", "sneakers"]
- Category: "Tops", Keywords: ["t-shirt", "blouse", "kurti", "tank top", "crop top"]
- Category: "Jewelry", Keywords: ["necklace", "earrings", "ring", "bracelet", "pendant"]

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


'use server';
/**
 * @fileOverview An AI flow to generate a home page section based on a user's natural language prompt.
 *
 * - generatePromptBasedSection - A function that accepts a prompt and a list of products, and returns a section title, description, and a list of filtered product IDs.
 * - GeneratePromptBasedSectionInput - The input type for the function.
 * - GeneratePromptBasedSectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Product } from '@/lib/mock-data';

// Zod schema for a single product, used by the tool
const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    tags: z.array(z.string()),
});

// Zod schema for the filtering criteria, used by the tool
const ProductFilterSchema = z.object({
  categories: z.array(z.string()).optional().describe("An array of product categories to include (e.g., ['Kurtis', 'Sarees'])."),
  keywords: z.array(z.string()).optional().describe("Keywords to search for in product name, description, or tags (e.g., ['party wear', 'floral'])."),
  maxPrice: z.number().optional().describe("The maximum price of products to include."),
  minPrice: z.number().optional().describe("The minimum price of products to include."),
});

// Define the product filtering tool for the AI
const productFilterTool = ai.defineTool(
  {
    name: 'productFilterTool',
    description: 'Filters a list of products based on specified criteria like categories, keywords, and price range.',
    inputSchema: z.object({
        products: z.array(ProductSchema).describe("The full list of products to filter from."),
        filter: ProductFilterSchema.describe("The filtering criteria to apply.")
    }),
    outputSchema: z.object({
        productIds: z.array(z.string()).describe("An array of product IDs that match the filter criteria.")
    }),
  },
  async ({ products, filter }) => {
    let filteredProducts = products;

    // Apply category filter
    if (filter.categories && filter.categories.length > 0) {
        const lowerCaseCategories = filter.categories.map(c => c.toLowerCase());
        filteredProducts = filteredProducts.filter(p => lowerCaseCategories.includes(p.category.toLowerCase()));
    }

    // Apply keyword filter
    if (filter.keywords && filter.keywords.length > 0) {
        const lowerCaseKeywords = filter.keywords.map(k => k.toLowerCase());
        filteredProducts = filteredProducts.filter(p => {
            const productText = `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
            return lowerCaseKeywords.some(keyword => productText.includes(keyword));
        });
    }

    // Apply price filters
    if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filter.maxPrice!);
    }
    if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filter.minPrice!);
    }

    return {
        productIds: filteredProducts.map(p => p.id),
    };
  }
);


// Define the schemas for the main flow input and output
const GeneratePromptBasedSectionInputSchema = z.object({
  prompt: z.string().describe("The user's natural language prompt for creating the section."),
  products: z.array(ProductSchema).describe("A list of all available products in the store."),
});
export type GeneratePromptBasedSectionInput = z.infer<typeof GeneratePromptBasedSectionInputSchema>;

const GeneratePromptBasedSectionOutputSchema = z.object({
  title: z.string().describe("A catchy and relevant title for the new section based on the user's prompt."),
  description: z.string().optional().describe("A short, optional description for the section."),
  productIds: z.array(z.string()).describe("An array of product IDs that have been filtered according to the prompt."),
});
export type GeneratePromptBasedSectionOutput = z.infer<typeof GeneratePromptBasedSectionOutputSchema>;


// Export the main function that will be called from the frontend
export async function generatePromptBasedSection(input: GeneratePromptBasedSectionInput): Promise<GeneratePromptBasedSectionOutput> {
  return generatePromptBasedSectionFlow(input);
}

// Define the prompt for the AI
const prompt = ai.definePrompt({
  name: 'generatePromptBasedSectionPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  tools: [productFilterTool],
  input: { schema: GeneratePromptBasedSectionInputSchema },
  output: { schema: GeneratePromptBasedSectionOutputSchema },
  prompt: `You are an expert e-commerce merchandiser. Your task is to create a new home page section based on the user's request.

  User Prompt: "{{{prompt}}}"

  Instructions:
  1.  Generate a catchy and relevant title for this section.
  2.  (Optional) Generate a short, enticing description for the section if the prompt implies one.
  3.  Analyze the user's prompt to determine the filtering criteria for products. This could include categories (like "sarees", "kurtis"), price constraints (like "under 500", "above 1000"), and keywords (like "party wear", "summer collection").
  4.  Use the 'productFilterTool' with the extracted criteria to get a list of matching product IDs from the provided product list.
  5.  Return the title, description, and the final list of product IDs.

  Here is the list of all available products:
  {{#each products}}
  - ID: {{id}}, Name: {{name}}, Category: {{category}}, Price: {{price}}, Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}, Description: {{description}}
  {{/each}}
  `,
});


// Define the main Genkit flow
const generatePromptBasedSectionFlow = ai.defineFlow(
  {
    name: 'generatePromptBasedSectionFlow',
    inputSchema: GeneratePromptBasedSectionInputSchema,
    outputSchema: GeneratePromptBasedSectionOutputSchema,
  },
  async (input) => {
     if (input.products.length === 0) {
      return { title: "New Section", productIds: [] };
    }
    const { output } = await prompt(input);
    return output!;
  }
);

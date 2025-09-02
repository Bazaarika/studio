
'use server';
/**
 * @fileOverview An AI flow to generate comprehensive product details from an image.
 *
 * - generateProductDetailsFromImage - A function that accepts an image data URI and returns a full set of product details.
 * - GenerateProductDetailsFromImageInput - The input type for the function.
 * - GenerateProductDetailsFromImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateProductDetailsFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  categories: z.array(z.string()).describe('An array of valid category names.'),
});
export type GenerateProductDetailsFromImageInput = z.infer<typeof GenerateProductDetailsFromImageInputSchema>;

const GenerateProductDetailsFromImageOutputSchema = z.object({
  name: z.string().describe('A concise, appealing, and SEO-friendly product name.'),
  description: z.string().describe('A compelling and detailed product description (2-3 sentences).'),
  category: z.string().describe('The most relevant product category.'),
  tags: z.array(z.string()).describe('An array of 3-4 relevant and specific tags for the product to improve searchability.'),
  aiHint: z.string().describe('A two-word descriptive hint for the image, suitable for an image search. E.g., "floral dress" or "leather boots".'),
  specifications: z.string().describe("A bulleted list of key specifications based on the image. Use markdown format (e.g., '- Material: Cotton'). Include details like fabric, fit, occasion, and care instructions."),
  showcase: z.string().describe("A short paragraph describing how to style or showcase the product in the image. Provide fashion tips or pairing suggestions."),
  productHighlights: z.string().describe("A bulleted list of 3-5 key highlights or selling points from the image. Use markdown format (e.g., '- Lightweight and breathable fabric')."),
});
export type GenerateProductDetailsFromImageOutput = z.infer<typeof GenerateProductDetailsFromImageOutputSchema>;

export async function generateProductDetailsFromImage(input: GenerateProductDetailsFromImageInput): Promise<GenerateProductDetailsFromImageOutput> {
  return generateProductDetailsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDetailsFromImagePrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateProductDetailsFromImageInputSchema},
  output: {schema: GenerateProductDetailsFromImageOutputSchema},
  prompt: `You are an expert e-commerce merchandiser and copywriter for a fashion brand "Bazaarika".
  
  Analyze the following product image and generate all the necessary details for an e-commerce listing.

  Product Image: {{media url=imageDataUri}}

  Valid Categories: {{#each categories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Instructions:
  - Generate a concise, appealing, and SEO-friendly product name.
  - Write an engaging product description (2-3 sentences).
  - Select the most appropriate category from the "Valid Categories" list.
  - Provide 3 to 4 specific and relevant tags as an array of strings.
  - Provide a concise, two-word descriptive hint for the image itself (e.g., "floral dress").
  - **Specifications**: Create a bulleted list (using markdown '-') of technical details visible or inferred from the image. Include Material, Fit, Occasion, and Wash Care.
  - **Showcase**: Write a short paragraph with styling tips based on the item in the image.
  - **Product Highlights**: Create a bulleted list (using markdown '-') of 3-5 key selling points based on the image. Focus on benefits.
  `,
});

const generateProductDetailsFromImageFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFromImageFlow',
    inputSchema: GenerateProductDetailsFromImageInputSchema,
    outputSchema: GenerateProductDetailsFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

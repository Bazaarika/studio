
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
import { categories } from '@/lib/mock-data';

const GenerateProductDetailsFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductDetailsFromImageInput = z.infer<typeof GenerateProductDetailsFromImageInputSchema>;

const GenerateProductDetailsFromImageOutputSchema = z.object({
  name: z.string().describe('A concise, appealing, and SEO-friendly product name.'),
  description: z.string().describe('A compelling and detailed product description (2-3 sentences).'),
  category: z.string().describe('The most relevant product category.'),
  tags: z.array(z.string()).describe('An array of 3-4 relevant and specific tags for the product to improve searchability.'),
  aiHint: z.string().describe('A two-word descriptive hint for the image, suitable for an image search. E.g., "floral dress" or "leather boots".'),
});
export type GenerateProductDetailsFromImageOutput = z.infer<typeof GenerateProductDetailsFromImageOutputSchema>;

export async function generateProductDetailsFromImage(input: GenerateProductDetailsFromImageInput): Promise<GenerateProductDetailsFromImageOutput> {
  return generateProductDetailsFromImageFlow(input);
}

const validCategories = categories.map(c => c.name).join(', ');

const prompt = ai.definePrompt({
  name: 'generateProductDetailsFromImagePrompt',
  input: {schema: GenerateProductDetailsFromImageInputSchema},
  output: {schema: GenerateProductDetailsFromImageOutputSchema},
  prompt: `You are an expert e-commerce merchandiser and copywriter.
  
  Analyze the following product image and generate all the necessary details for an e-commerce listing.

  Product Image: {{media url=imageDataUri}}

  Valid Categories: ${validCategories}

  Instructions:
  - Generate a concise, appealing, and SEO-friendly product name.
  - Write an engaging product description that highlights key features, between 2 and 3 sentences.
  - Select the most appropriate category from the "Valid Categories" list provided.
  - Provide 3 to 4 specific and relevant tags as an array of strings to improve searchability. For clothing, include the specific item type (e.g., 't-shirt', 'kurti'), style ('casual', 'formal'), occasion ('party wear', 'summer'), and material if identifiable.
  - Provide a concise, two-word descriptive hint for the image itself (e.g., "floral dress", "leather boots").
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

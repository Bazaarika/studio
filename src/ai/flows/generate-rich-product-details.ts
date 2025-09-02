
'use server';
/**
 * @fileOverview An AI flow to generate rich product content including description, specifications, showcase, and highlights.
 *
 * - generateRichProductDetails - A function that accepts a prompt and returns a full set of product content.
 * - GenerateRichProductDetailsInput - The input type for the function.
 * - GenerateRichProductDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRichProductDetailsInputSchema = z.object({
  prompt: z.string().describe('A short prompt describing the product, e.g., "blue floral summer dress".'),
});
export type GenerateRichProductDetailsInput = z.infer<typeof GenerateRichProductDetailsInputSchema>;

const GenerateRichProductDetailsOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed product description (2-4 sentences). Use engaging language suitable for an e-commerce store.'),
  specifications: z.string().describe("A bulleted list of key specifications. Use markdown format (e.g., '- Material: Cotton'). Include details like fabric, fit, occasion, and care instructions."),
  showcase: z.string().describe("A short paragraph describing how to style or showcase the product. Provide fashion tips or pairing suggestions."),
  productHighlights: z.string().describe("A bulleted list of 3-5 key highlights or selling points. Use markdown format (e.g., '- Lightweight and breathable fabric')."),
});
export type GenerateRichProductDetailsOutput = z.infer<typeof GenerateRichProductDetailsOutputSchema>;

export async function generateRichProductDetails(input: GenerateRichProductDetailsInput): Promise<GenerateRichProductDetailsOutput> {
  return generateRichProductDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRichProductDetailsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateRichProductDetailsInputSchema},
  output: {schema: GenerateRichProductDetailsOutputSchema},
  prompt: `You are an expert e-commerce copywriter for a fashion brand called "Bazaarika".

Your task is to generate comprehensive and engaging content for a product based on the user's prompt.

Product Prompt: "{{{prompt}}}"

Instructions:
1.  **Product Description**: Write an appealing 2-4 sentence description.
2.  **Specifications**: Create a bulleted list (using markdown '-') of technical details. Include things like Material, Fit, Occasion, and Wash Care. Be specific.
3.  **Showcase**: Write a short paragraph with styling tips. Suggest what to pair the item with.
4.  **Product Highlights**: Create a bulleted list (using markdown '-') of 3-5 key selling points. Focus on benefits for the customer.

Generate the content for all four fields.
`,
});

const generateRichProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateRichProductDetailsFlow',
    inputSchema: GenerateRichProductDetailsInputSchema,
    outputSchema: GenerateRichProductDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

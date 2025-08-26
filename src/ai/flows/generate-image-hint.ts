
'use server';
/**
 * @fileOverview An AI flow to generate a concise hint for an image.
 *
 * - generateImageHint - A function that accepts an image data URI and returns a 2-word hint.
 * - GenerateImageHintInput - The input type for the generateImageHint function.
 * - GenerateImageHintOutput - The return type for the generateImageHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateImageHintInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageHintInput = z.infer<typeof GenerateImageHintInputSchema>;

const GenerateImageHintOutputSchema = z.object({
  hint: z.string().describe('A two-word descriptive hint for the image, suitable for an image search. E.g., "floral dress" or "leather boots".'),
});
export type GenerateImageHintOutput = z.infer<typeof GenerateImageHintOutputSchema>;

export async function generateImageHint(input: GenerateImageHintInput): Promise<GenerateImageHintOutput> {
  return generateImageHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageHintPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateImageHintInputSchema},
  output: {schema: GenerateImageHintOutputSchema},
  prompt: `You are an expert in product tagging and image analysis.

  Analyze the following product image and provide a concise, two-word descriptive hint. This hint will be used for AI-powered image searches, so it should be descriptive and simple.

  For example:
  - If the image is a floral dress, the hint should be "floral dress".
  - If the image is of leather boots, the hint should be "leather boots".

  Image: {{media url=imageDataUri}}`,
});

const generateImageHintFlow = ai.defineFlow(
  {
    name: 'generateImageHintFlow',
    inputSchema: GenerateImageHintInputSchema,
    outputSchema: GenerateImageHintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

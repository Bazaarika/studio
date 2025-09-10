
'use server';
/**
 * @fileOverview An AI flow to generate a detailed image prompt from a product photo.
 *
 * - generateImagePrompt - A function that accepts an image URL and returns a descriptive prompt and product description.
 * - GenerateImagePromptInput - The input type for the function.
 * - GenerateImagePromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagePromptInputSchema = z.object({
  imageUrl: z.string().url().describe("The public URL of the product image."),
});
export type GenerateImagePromptInput = z.infer<typeof GenerateImagePromptInputSchema>;

const GenerateImagePromptOutputSchema = z.object({
  productDescription: z.string().describe("A concise, one-sentence description of the product in the image."),
  imagePrompt: z.string().describe("A detailed, creative, and descriptive prompt for a text-to-image AI model (like Midjourney or DALL-E) to generate a high-quality lifestyle or fashion photoshoot image featuring the described product."),
});
export type GenerateImagePromptOutput = z.infer<typeof GenerateImagePromptOutputSchema>;

export async function generateImagePrompt(input: GenerateImagePromptInput): Promise<GenerateImagePromptOutput> {
  return generateImagePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePromptFlowPrompt',
  model: 'googleai/gemini-pro-vision',
  input: {schema: GenerateImagePromptInputSchema},
  output: {schema: GenerateImagePromptOutputSchema},
  prompt: `You are an expert fashion photographer and creative director.

  Analyze the provided product image. Your task is to do two things:
  1.  Write a very concise, one-sentence description of the main product in the image.
  2.  Create a detailed, creative, and highly descriptive prompt for a text-to-image AI model (like Midjourney or DALL-E). This prompt should describe a professional, photorealistic fashion photoshoot scene that features the product.

  **Prompt Guidelines:**
  - The prompt should be a single, continuous paragraph.
  - Include details about the model (e.g., "South Asian model," "model with a joyful expression").
  - Describe the setting or background (e.g., "in a sun-drenched cafe in Jaipur," "against a minimalist grey studio background").
  - Specify the lighting (e.g., "soft natural light," "dramatic studio lighting").
  - Describe the overall mood and style (e.g., "cinematic, candid shot," "high-fashion, editorial style").
  - Mention camera and film details for a photorealistic look (e.g., "shot on a Canon EOS R5 with a 50mm f/1.2 lens," "hyper-detailed, 8K").
  - The main subject of the prompt MUST be the product from the image.

  **Example Output for an image of a blue floral dress:**
  - **Product Description:** A blue floral print summer dress with short sleeves.
  - **Image Prompt:** A beautiful South Asian model with long, flowing hair laughing joyfully in a sun-drenched, rustic cafe in Jaipur. She is wearing a blue floral print summer dress with short sleeves. The scene is filled with soft, natural light filtering through a window, creating a warm and inviting atmosphere. Cinematic, candid shot, captured with a Canon EOS R5 and a 50mm f/1.2 lens, resulting in a shallow depth of field. The image is hyper-detailed, photorealistic, and in 8K resolution.

  Here is the image you need to analyze: {{media url=imageUrl}}
`,
});

const generateImagePromptFlow = ai.defineFlow(
  {
    name: 'generateImagePromptFlow',
    inputSchema: GenerateImagePromptInputSchema,
    outputSchema: GenerateImagePromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

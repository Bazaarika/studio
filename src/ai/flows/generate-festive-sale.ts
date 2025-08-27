
'use server';
/**
 * @fileOverview An AI flow to generate details for a festive sale based on the upcoming festival.
 *
 * - generateFestiveSale - A function that returns a festive sale theme with relevant product keywords.
 * - GenerateFestiveSaleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateFestiveSaleOutputSchema = z.object({
  festivalName: z.string().describe('The name of the upcoming festival (e.g., Diwali, Holi, Eid, Christmas).'),
  saleTitle: z.string().describe('A catchy and festive title for the sale (e.g., "Dazzling Diwali Deals", "Colors of Joy: Holi Sale").'),
  saleDescription: z.string().describe('A short, enticing description for the sale banner (1-2 sentences).'),
  suggestedProductKeywords: z.array(z.string()).describe('An array of 3-5 specific keywords for products relevant to this festival. E.g., for Diwali: ["saree", "kurta", "ethnic wear", "gifts", "lamps"]. For Eid: ["sharara", "anarkali", "festive wear", "jewelry"].'),
});
export type GenerateFestiveSaleOutput = z.infer<typeof GenerateFestiveSaleOutputSchema>;

export async function generateFestiveSale(): Promise<GenerateFestiveSaleOutput> {
  return generateFestiveSaleFlow();
}

const prompt = ai.definePrompt({
  name: 'generateFestiveSalePrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  output: {schema: GenerateFestiveSaleOutputSchema},
  prompt: `You are an expert e-commerce merchandiser for an Indian online fashion store.

  Your task is to create a theme for a festive sale.

  1.  Identify the next major Indian festival based on the current date. Today's date is {{currentDate}}.
  2.  Generate a catchy title and a short, enticing description for the sale.
  3.  Provide a list of 3-5 specific product keywords that are highly relevant to that festival for filtering products. For example:
      - For Diwali: ["saree", "kurta", "ethnic wear", "gifts", "lamps"]
      - For Holi: ["white kurta", "colorful apparel", "casual wear", "t-shirts"]
      - For Eid: ["sharara", "anarkali", "festive wear", "jewelry", "kurta set"]
      - For Christmas: ["dresses", "party wear", "gifts", "winter wear"]

  Do not mention the current date in your output. Focus only on the festive sale details.`,
});

const generateFestiveSaleFlow = ai.defineFlow(
  {
    name: 'generateFestiveSaleFlow',
    outputSchema: GenerateFestiveSaleOutputSchema,
  },
  async () => {
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const {output} = await prompt({currentDate});
    return output!;
  }
);

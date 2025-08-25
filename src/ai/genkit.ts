import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "AIzaSyANsShM-l8tDqprEUHW0e-860HbfsXO-b0"})],
  model: 'googleai/gemini-2.0-flash',
});

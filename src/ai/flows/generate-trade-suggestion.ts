'use server';

/**
 * @fileOverview Provides a buy/sell/hold suggestion based on chart patterns.
 *
 * - generateTradeSuggestion - A function that generates a trade suggestion.
 * - GenerateTradeSuggestionInput - The input type for the generateTradeSuggestion function.
 * - GenerateTradeSuggestionOutput - The return type for the generateTradeSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradeSuggestionInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A trading chart image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  chartType: z.string().describe('The type of chart (e.g., candlestick, line, bar).'),
  identifiedPattern: z.string().describe('The identified chart pattern (e.g., uptrend, downtrend, consolidation).'),
  explanation: z.string().describe('Explanation of the chart and technical indicators.'),
});
export type GenerateTradeSuggestionInput = z.infer<typeof GenerateTradeSuggestionInputSchema>;

const GenerateTradeSuggestionOutputSchema = z.object({
  suggestion: z.enum(['buy', 'sell', 'hold']).describe('The trade suggestion.'),
  confidence: z.number().describe('The confidence level (0-1) for the suggestion.'),
  reason: z.string().describe('The reasoning behind the trade suggestion.'),
});
export type GenerateTradeSuggestionOutput = z.infer<typeof GenerateTradeSuggestionOutputSchema>;

export async function generateTradeSuggestion(input: GenerateTradeSuggestionInput): Promise<GenerateTradeSuggestionOutput> {
  return generateTradeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradeSuggestionPrompt',
  input: {schema: GenerateTradeSuggestionInputSchema},
  output: {schema: GenerateTradeSuggestionOutputSchema},
  prompt: `You are an expert trading analyst providing trade suggestions based on chart analysis.

  Given the following chart information, provide a buy/sell/hold suggestion, a confidence level, and the reasoning behind the suggestion.

  Chart Type: {{{chartType}}}
  Identified Pattern: {{{identifiedPattern}}}
  Explanation: {{{explanation}}}
  Chart Image: {{media url=chartDataUri}}

  Please provide the suggestion in the following JSON format:
  {
    "suggestion": "buy" | "sell" | "hold",
    "confidence": number (0-1), /* Confidence level for the suggestion */
    "reason": string /* Reasoning behind the suggestion */
  }`,
});

const generateTradeSuggestionFlow = ai.defineFlow(
  {
    name: 'generateTradeSuggestionFlow',
    inputSchema: GenerateTradeSuggestionInputSchema,
    outputSchema: GenerateTradeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

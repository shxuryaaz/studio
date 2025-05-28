'use server';
/**
 * @fileOverview Explains the chart type and technical indicators in plain language.
 *
 * - explainChart - A function that handles the chart explanation process.
 * - ExplainChartInput - The input type for the explainChart function.
 * - ExplainChartOutput - The return type for the explainChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainChartInputSchema = z.object({
  chartType: z.string().describe('The type of chart, e.g., candlestick, line, bar.'),
  technicalIndicators: z
    .string()
    .describe('The technical indicators present in the chart, e.g., moving averages, RSI, MACD.'),
});
export type ExplainChartInput = z.infer<typeof ExplainChartInputSchema>;

const ExplainChartOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A beginner-friendly explanation of the chart type and technical indicators, including definitions.'
    ),
});
export type ExplainChartOutput = z.infer<typeof ExplainChartOutputSchema>;

export async function explainChart(input: ExplainChartInput): Promise<ExplainChartOutput> {
  return explainChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainChartPrompt',
  input: {schema: ExplainChartInputSchema},
  output: {schema: ExplainChartOutputSchema},
  prompt: `You are an expert trading educator. Explain the following chart type and technical indicators in plain language, using beginner-friendly terms and definitions. 

Chart Type: {{{chartType}}}
Technical Indicators: {{{technicalIndicators}}}
`,
});

const explainChartFlow = ai.defineFlow(
  {
    name: 'explainChartFlow',
    inputSchema: ExplainChartInputSchema,
    outputSchema: ExplainChartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

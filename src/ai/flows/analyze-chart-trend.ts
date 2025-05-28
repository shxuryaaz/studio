'use server';

/**
 * @fileOverview Analyzes a trading chart image to detect the trend (uptrend, downtrend, consolidation).
 *
 * - analyzeChartTrend - A function that handles the chart trend analysis process.
 * - AnalyzeChartTrendInput - The input type for the analyzeChartTrend function.
 * - AnalyzeChartTrendOutput - The return type for the analyzeChartTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChartTrendInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A trading chart image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeChartTrendInput = z.infer<typeof AnalyzeChartTrendInputSchema>;

const AnalyzeChartTrendOutputSchema = z.object({
  trend: z
    .string()
    .describe(
      'The detected trend in the trading chart (uptrend, downtrend, or consolidation).'
    ),
  confidence: z
    .number()
    .describe('A confidence score (0-1) indicating the certainty of the trend detection.'),
});
export type AnalyzeChartTrendOutput = z.infer<typeof AnalyzeChartTrendOutputSchema>;

export async function analyzeChartTrend(
  input: AnalyzeChartTrendInput
): Promise<AnalyzeChartTrendOutput> {
  return analyzeChartTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChartTrendPrompt',
  input: {schema: AnalyzeChartTrendInputSchema},
  output: {schema: AnalyzeChartTrendOutputSchema},
  prompt: `You are an expert financial analyst specializing in trading chart pattern recognition.

You will analyze the provided trading chart image and determine the trend.

Possible trends are:
- Uptrend: Characterized by higher highs and higher lows.
- Downtrend: Characterized by lower highs and lower lows.
- Consolidation: Characterized by a sideways movement with no clear upward or downward direction.

Analyze the chart and provide the trend and a confidence score (0-1) indicating the certainty of the trend detection.

Chart Image: {{media url=chartDataUri}}

Output in JSON format.
`,
});

const analyzeChartTrendFlow = ai.defineFlow(
  {
    name: 'analyzeChartTrendFlow',
    inputSchema: AnalyzeChartTrendInputSchema,
    outputSchema: AnalyzeChartTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

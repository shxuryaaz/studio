import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-chart-trend.ts';
import '@/ai/flows/generate-trade-suggestion.ts';
import '@/ai/flows/explain-chart.ts';
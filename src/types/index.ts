import type { User as FirebaseUser } from 'firebase/auth';

export type AppUser = Pick<FirebaseUser, 'uid' | 'email' | 'displayName' | 'photoURL'> | null;

export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  imageUrl: string;
  imageStoragePath: string; 
  analysisType: 'trend' | 'explanation' | 'suggestion';
  result: any; // This will vary based on analysisType
  timestamp: Date;
  thumbnailUrl?: string; 
}

export interface UsageData {
  analysisCountToday: number;
  lastAnalysisDate: string; // Store as ISO string e.g. "2024-07-28"
}

// Add more types as needed
// export type ChartTrendResult = { trend: string; confidence: number };
// export type ChartExplanationResult = { explanation: string };
// export type TradeSuggestionResult = { suggestion: 'buy' | 'sell' | 'hold'; confidence: number; reason: string };

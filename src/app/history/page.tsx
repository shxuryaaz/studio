'use client';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Eye, Trash2, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Placeholder for actual history data
const mockHistoryItems = [
  { id: '1', imageUrl: 'https://placehold.co/300x180.png?a=1', dataAiHint: "chart finance", analysisType: 'Trend Analysis', resultSummary: 'Uptrend detected', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '2', imageUrl: 'https://placehold.co/300x180.png?a=2', dataAiHint: "graph stock", analysisType: 'Chart Explanation', resultSummary: 'Candlestick chart, RSI, MACD', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '3', imageUrl: 'https://placehold.co/300x180.png?a=3', dataAiHint: "data visualization", analysisType: 'Trade Suggestion', resultSummary: 'Suggestion: Buy, Confidence: 75%', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: '4', imageUrl: 'https://placehold.co/300x180.png?a=4', dataAiHint: "finance graph", analysisType: 'Trend Analysis', resultSummary: 'Consolidation phase', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
];


export default function HistoryPage() {
  // In a real app, you would fetch history data using useQuery and Firestore
  // const { data: historyItems, isLoading, error } = useQuery(...)

  return (
    <AppShell>
      <PageHeader
        title="My Analysis History"
        description="Review your past chart analyses and insights."
      />
      {mockHistoryItems.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <Image src="https://placehold.co/300x200.png" alt="No history" width={300} height={200} className="mx-auto mb-6 rounded-md opacity-70" data-ai-hint="empty folder" />
            <h3 className="text-xl font-semibold text-foreground">No History Yet</h3>
            <p className="mt-2 text-muted-foreground">
              Your analyzed charts will appear here once you perform an analysis.
            </p>
            <Button className="mt-6" onClick={() => window.location.href = '/dashboard'}>
              Analyze First Chart
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockHistoryItems.map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-primary/20 hover:scale-[1.02]">
                <CardHeader className="p-0">
                  <Image 
                    src={item.imageUrl} 
                    alt={`Chart analysis from ${item.timestamp.toLocaleDateString()}`} 
                    width={300} 
                    height={180} 
                    className="aspect-[16/9] w-full object-cover"
                    data-ai-hint={item.dataAiHint} 
                  />
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-lg">{item.analysisType}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {item.resultSummary}
                  </CardDescription>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Analyzed on: {item.timestamp.toLocaleString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-3">
                  <Button variant="ghost" size="sm" title="View Details" className="text-primary hover:text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Download" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </AppShell>
  );
}

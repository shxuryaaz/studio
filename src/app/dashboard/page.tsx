
'use client';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Camera, Copy, Download, FileUp, HelpCircle, Loader2, Share2, TrendingUp, Lightbulb, DollarSign } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { analyzeChartTrend } from '@/ai/flows/analyze-chart-trend';
import { explainChart } from '@/ai/flows/explain-chart';
import { generateTradeSuggestion } from '@/ai/flows/generate-trade-suggestion';

// Helper function to read file as data URI
const readFileAsDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<{ title: string; content: string; icon: JSX.Element } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chartTypeForAnalysis, setChartTypeForAnalysis] = useState('');
  const [indicatorsForAnalysis, setIndicatorsForAnalysis] = useState('');


  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setAnalysisResult(null); // Clear previous results
    }
  };
  
  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({ title: "No File Selected", description: "Please upload or capture a chart image.", variant: "destructive" });
      return;
    }
    if (!analysisType) {
      toast({ title: "No Analysis Type Selected", description: "Please select an analysis type.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const chartDataUri = await readFileAsDataURI(selectedFile);
      let resultData = null;

      if (analysisType === 'trend') {
        const apiResponse = await analyzeChartTrend({ chartDataUri });
        resultData = {
          title: "Trend Analysis",
          content: `Trend: ${apiResponse.trend}\nConfidence: ${(apiResponse.confidence * 100).toFixed(0)}%`,
          icon: <TrendingUp className="h-5 w-5 text-green-500" />
        };
      } else if (analysisType === 'explanation') {
        if (!chartTypeForAnalysis.trim()) {
          toast({ title: "Input Missing", description: "Please enter the chart type.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const apiResponse = await explainChart({ chartType: chartTypeForAnalysis, technicalIndicators: indicatorsForAnalysis });
        resultData = {
          title: "Chart Explanation",
          content: apiResponse.explanation,
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />
        };
      } else if (analysisType === 'suggestion') {
         if (!chartTypeForAnalysis.trim()) {
          toast({ title: "Input Missing", description: "Please enter the chart type for context.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const explanationForSuggestion = `User-provided chart type: ${chartTypeForAnalysis}. User-provided indicators: ${indicatorsForAnalysis || 'not specified'}.`;
        const apiResponse = await generateTradeSuggestion({ 
          chartDataUri, 
          chartType: chartTypeForAnalysis, 
          identifiedPattern: "User-provided context for direct suggestion", 
          explanation: explanationForSuggestion
        });
        resultData = {
          title: "Trade Suggestion",
          content: `Suggestion: ${apiResponse.suggestion}\nConfidence: ${(apiResponse.confidence * 100).toFixed(0)}%\nReason: ${apiResponse.reason}`,
          icon: <DollarSign className="h-5 w-5 text-blue-500" />
        };
      }
      
      setAnalysisResult(resultData);
      toast({ title: "Analysis Complete", description: `Showing results for ${analysisType} analysis.` });
    } catch (error: any) {
      console.error("Error during AI analysis:", error);
      toast({ 
        title: "Analysis Failed", 
        description: error.message || "An unexpected error occurred with the AI analysis.", 
        variant: "destructive" 
      });
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setAnalysisType('');
    setChartTypeForAnalysis('');
    setIndicatorsForAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };


  if (authLoading) {
    return (
      <AppShell>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  const showContextualInputs = analysisType === 'explanation' || analysisType === 'suggestion';

  return (
    <AppShell>
      <PageHeader 
        title="AI Chart Analysis" 
        description="Upload your trading chart and let AI provide insights."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Upload and Instructions */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upload Chart Image</CardTitle>
              <CardDescription>Capture or upload a trading chart for analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                  <FileUp className="mr-2 h-4 w-4" /> Upload from Device
                </Button>
                <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
              <Button className="w-full" variant="outline" disabled> {/* Camera functionality to be implemented */}
                <Camera className="mr-2 h-4 w-4" /> Use Camera (Coming Soon)
              </Button>
              {previewUrl && (
                <div className="mt-4 rounded-md border border-border p-2">
                  <Image src={previewUrl} alt="Chart preview" width={300} height={200} className="mx-auto h-auto max-h-60 w-full rounded-md object-contain" data-ai-hint="chart finance" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary" />Capture Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Ensure good, even lighting.</li>
                <li>Keep the chart flat and centered.</li>
                <li>Make sure text and lines are legible.</li>
                <li>Avoid glare, blur, or cropped areas.</li>
                <li>Clear, high-resolution images work best.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analysis Options and Results */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
              <CardDescription>Select the type of analysis you want to perform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="analysisType">Select Analysis Type</Label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger id="analysisType" className="w-full">
                    <SelectValue placeholder="Choose an analysis..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend">Detect Trend</SelectItem>
                    <SelectItem value="explanation">Explain Chart</SelectItem>
                    <SelectItem value="suggestion">Generate Trade Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {showContextualInputs && (
                 <>
                    <div>
                        <Label htmlFor="chartTypeInput">Chart Type (e.g., Candlestick)</Label>
                        <Input 
                            id="chartTypeInput" 
                            placeholder="Enter chart type" 
                            value={chartTypeForAnalysis}
                            onChange={(e) => setChartTypeForAnalysis(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="indicatorsInput">Technical Indicators (comma-separated)</Label>
                        <Input 
                            id="indicatorsInput" 
                            placeholder="e.g., RSI, MACD (optional)"
                            value={indicatorsForAnalysis}
                            onChange={(e) => setIndicatorsForAnalysis(e.target.value)} 
                        />
                    </div>
                 </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyze} 
                disabled={
                    isLoading || 
                    !selectedFile || 
                    !analysisType ||
                    ( (analysisType === 'explanation' || analysisType === 'suggestion') && !chartTypeForAnalysis.trim() )
                } 
                className="w-full"
               >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Chart
              </Button>
            </CardFooter>
          </Card>

          {isLoading && (
            <Card className="shadow-lg">
              <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">AI is analyzing your chart...</p>
                <p className="text-sm text-muted-foreground">This might take a few moments.</p>
              </CardContent>
            </Card>
          )}

          {analysisResult && !isLoading && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                    {analysisResult.icon}
                    <span className="ml-2">{analysisResult.title}</span>
                </CardTitle>
                <CardDescription>AI Analysis - {new Date().toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {previewUrl && (
                     <Image src={previewUrl} alt="Analyzed chart" width={200} height={120} className="mb-4 h-auto max-h-40 w-full rounded-md object-contain" data-ai-hint="chart analysis" />
                )}
                <p className="text-foreground whitespace-pre-wrap">{analysisResult.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(analysisResult.content); toast({title: "Copied to clipboard!"})}}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" disabled> {/* Share functionality to be implemented */}
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm" disabled> {/* Download functionality to be implemented */}
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </div>
                <Button onClick={handleTryAnother} className="mt-4 sm:mt-0">
                  Try Another Chart
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!isLoading && !analysisResult && selectedFile && (
            <Card className="border-dashed border-2 shadow-none">
              <CardContent className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
                <FileUp className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">Image Ready for Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Select an analysis type and click "Analyze Chart" to get insights.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !analysisResult && !selectedFile && (
             <Card className="border-dashed border-2 shadow-none">
              <CardContent className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
                <Image src="https://placehold.co/400x250.png" alt="Placeholder for analysis results" width={400} height={250} className="rounded-md opacity-50" data-ai-hint="abstract data" />
                <p className="text-lg font-medium text-foreground">Upload a Chart to Get Started</p>
                <p className="text-sm text-muted-foreground">
                  Your AI-powered analysis results will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}


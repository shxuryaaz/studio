import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import type { UsageData } from '@/types';
import { USAGE_LIMIT_FREE } from '@/lib/constants';
import { useToast } from './use-toast';

export function useUsageLimiter() {
  const { user, isProUser } = useAuth();
  const { toast } = useToast();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [canAnalyze, setCanAnalyze] = useState(false);

  const getTodaysDateString = () => new Date().toISOString().split('T')[0];

  const fetchUsageData = useCallback(async () => {
    if (!user) {
      setLoadingUsage(false);
      setUsageData(null);
      return;
    }

    setLoadingUsage(true);
    const userUsageRef = doc(db, 'userUsage', user.uid);
    try {
      const docSnap = await getDoc(userUsageRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UsageData;
        // Reset count if it's a new day
        if (data.lastAnalysisDate !== getTodaysDateString()) {
          const newUsageData = { analysisCountToday: 0, lastAnalysisDate: getTodaysDateString() };
          await updateDoc(userUsageRef, newUsageData);
          setUsageData(newUsageData);
        } else {
          setUsageData(data);
        }
      } else {
        // Create new usage document for the user
        const newUsageData: UsageData = { analysisCountToday: 0, lastAnalysisDate: getTodaysDateString() };
        await setDoc(userUsageRef, { ...newUsageData, firstUsed: serverTimestamp() });
        setUsageData(newUsageData);
      }
    } catch (error) {
      console.error("Error fetching/setting usage data:", error);
      toast({ title: "Error", description: "Could not fetch usage data.", variant: "destructive" });
      setUsageData(null); // Fallback to no data on error
    } finally {
      setLoadingUsage(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  useEffect(() => {
    if (isProUser) {
      setCanAnalyze(true); // Pro users have unlimited analyses
      return;
    }
    if (usageData) {
      setCanAnalyze(usageData.analysisCountToday < USAGE_LIMIT_FREE);
    } else {
      // If usageData is null (e.g. error or still loading), default to can't analyze for non-pro
      setCanAnalyze(false); 
    }
  }, [usageData, isProUser]);

  const incrementUsage = async (): Promise<boolean> => {
    if (!user) {
      toast({ title: "Not Authenticated", description: "Please sign in to analyze charts.", variant: "destructive" });
      return false;
    }
    if (isProUser) return true; // Pro users don't have their usage incremented against limits

    if (!usageData || !canAnalyze) {
      toast({ title: "Usage Limit Reached", description: `You have reached your daily limit of ${USAGE_LIMIT_FREE} analyses. Upgrade to Pro for unlimited access.`, variant: "destructive" });
      return false;
    }

    const newCount = usageData.analysisCountToday + 1;
    const updatedUsageData: UsageData = { ...usageData, analysisCountToday: newCount };
    
    try {
      const userUsageRef = doc(db, 'userUsage', user.uid);
      await updateDoc(userUsageRef, { 
        analysisCountToday: newCount,
        lastAnalysisDate: getTodaysDateString(), // Ensure date is current
        lastAnalysisTimestamp: serverTimestamp() 
      });
      setUsageData(updatedUsageData); // Update local state immediately
      toast({ title: "Usage Updated", description: `You have ${USAGE_LIMIT_FREE - newCount} analyses remaining today.`});
      return true;
    } catch (error) {
      console.error("Error incrementing usage:", error);
      toast({ title: "Error", description: "Could not update usage count.", variant: "destructive" });
      return false;
    }
  };
  
  const analysesRemaining = usageData ? USAGE_LIMIT_FREE - usageData.analysisCountToday : 0;

  return { 
    usageData, 
    loadingUsage, 
    canAnalyze, 
    incrementUsage,
    analysesToday: usageData?.analysisCountToday ?? 0,
    analysesRemaining: isProUser ? Infinity : (analysesRemaining < 0 ? 0 : analysesRemaining), // Ensure remaining is not negative
    limit: isProUser ? Infinity : USAGE_LIMIT_FREE,
    fetchUsageData // Expose refetch if needed
  };
}

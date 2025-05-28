'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// A simple SVG Logo component
const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <rect width="100" height="100" rx="20" fill="currentColor" fillOpacity="0.1"/>
        <path d="M20 75L40 45L60 65L80 35" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M65 35H80V50" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function AuthPageClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(APP_ROUTES.DASHBOARD);
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Auth state change will trigger redirect via useEffect
      toast({ title: "Successfully signed in!", description: "Redirecting to dashboard..." });
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      toast({
        title: "Sign-In Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSigningIn(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <Logo />
          <h1 className="text-3xl font-bold text-center text-foreground">Welcome to ChartVisionAI</h1>
          <p className="text-center text-muted-foreground">
            Unlock AI-powered trading chart analysis. Sign in to continue.
          </p>
        </div>
        
        <Button 
          onClick={handleGoogleSignIn} 
          disabled={isSigningIn}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
          variant="default"
          size="lg"
        >
          {isSigningIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            // Simple inline SVG for Google icon
            <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512 110.3 512 0 401.7 0 265.2 0 128.5 110.3 19.2 244 19.2c71.2 0 126.9 27.8 172.1 69.2l-63.1 61.7c-28.9-27.2-69.2-49.6-109-49.6-87.3 0-157.3 70.3-157.3 156.4s70 156.4 157.3 156.4c93.8 0 136.5-65.3 142.8-99.9H244v-76.5h239.1c4.7 24.4 7.9 50.7 7.9 77.9z"></path>
            </svg>
          )}
          Sign In with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our (non-existent) Terms of Service and Privacy Policy.
        </p>
      </div>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ChartVisionAI. All rights reserved.
      </footer>
    </div>
  );
}

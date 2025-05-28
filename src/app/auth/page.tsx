import AuthPageClient from '@/components/auth/AuthPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - ChartVisionAI',
  description: 'Sign in to access ChartVisionAI features.',
};

export default function AuthPage() {
  return <AuthPageClient />;
}

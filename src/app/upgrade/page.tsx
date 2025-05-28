'use client';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const pricingPlans = [
  {
    name: 'Free Tier',
    price: '$0',
    frequency: '/ month',
    features: [
      '5 AI analyses per day',
      'Basic chart pattern detection',
      'Limited history access',
      'Community support',
    ],
    cta: 'Currently Active',
    isCurrent: true,
    icon: <Zap className="h-6 w-6 text-primary" />,
    bgColor: 'bg-card',
  },
  {
    name: 'Pro Monthly',
    price: '$19',
    frequency: '/ month',
    features: [
      'Unlimited AI analyses',
      'Advanced chart pattern detection',
      'Full analysis history',
      'Priority email support',
      'Early access to new features',
    ],
    cta: 'Upgrade to Pro',
    isCurrent: false,
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    bgColor: 'bg-primary/5 border-primary', // Highlight color
    textColor: 'text-primary-foreground',
    buttonVariant: 'default',
  },
  {
    name: 'Pro Annually',
    price: '$199',
    frequency: '/ year',
    features: [
      'All Pro Monthly features',
      'Save 15% with annual plan',
      'Dedicated account manager (mock)',
    ],
    cta: 'Go Annual Pro',
    isCurrent: false,
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    bgColor: 'bg-card',
    buttonVariant: 'outline',
  },
];

export default function UpgradePage() {
  // This state would typically come from useAuth or a subscription context
  const currentPlanName = 'Free Tier'; 
  const analysesRemaining = 3; // Example, fetch from user's usage data

  return (
    <AppShell>
      <PageHeader
        title="Upgrade Your Plan"
        description="Unlock powerful AI features and unlimited analyses with ChartVisionAI Pro."
      />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">You are currently on the <span className="font-semibold text-primary">{currentPlanName}</span>.</p>
          <p className="text-muted-foreground">You have <span className="font-semibold text-primary">{analysesRemaining} / 5</span> free analyses remaining today.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col shadow-xl transition-all hover:shadow-primary/30 ${plan.bgColor} ${plan.isCurrent ? 'border-2 border-primary' : ''}`}>
            <CardHeader className="items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3 inline-block">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-bold text-foreground">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">{plan.frequency}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 mt-1 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            className={`w-full text-lg py-6 ${plan.textColor ? plan.textColor : ''}`} 
                            variant={plan.buttonVariant as any || 'default'}
                            disabled={plan.isCurrent}
                        >
                            {plan.cta}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Confirm Upgrade to {plan.name}</DialogTitle>
                        <DialogDescription>
                            You are about to upgrade to the {plan.name} for {plan.price}{plan.frequency}.
                            This is a demo and no actual payment will be processed.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">Stripe integration for actual payments would be implemented here.</p>
                        </div>
                        <Button onClick={() => alert(`Simulating upgrade to ${plan.name}. Thank you!`)} className="w-full">
                            Proceed to Checkout (Mock)
                        </Button>
                    </DialogContent>
                </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center text-muted-foreground">
        <p>Need a custom solution or have questions? <a href="mailto:support@chartvision.ai" className="text-primary underline">Contact Us</a>.</p>
      </div>
    </AppShell>
  );
}

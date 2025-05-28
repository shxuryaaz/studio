export const APP_NAME = 'ChartVisionAI';

export const APP_ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  UPGRADE: '/upgrade',
  // Add other routes here
};

export const NAVIGATION_LINKS = [
  { href: APP_ROUTES.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' }, // Lucide icon name
  { href: APP_ROUTES.HISTORY, label: 'My History', icon: 'History' },
  { href: APP_ROUTES.UPGRADE, label: 'Upgrade Plan', icon: 'Zap' },
];

export const USAGE_LIMIT_FREE = 5; // 5 free analyses per day

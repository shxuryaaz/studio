'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react'; // Import all icons

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { APP_NAME, NAVIGATION_LINKS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

// A simple SVG Logo component
const Logo = ({ collapsed }: { collapsed?: boolean }) => (
  <Link href="/dashboard" className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary shrink-0">
        <rect width="100" height="100" rx="20" fill="currentColor" fillOpacity="0.1"/>
        <path d="M20 75L40 45L60 65L80 35" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M65 35H80V50" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {!collapsed && <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">{APP_NAME}</span>}
  </Link>
);


interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="h-16 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
           <Logo collapsed={false} /> {/* Pass a prop to conditionally hide text if needed based on sidebar state */}
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent>
            <SidebarMenu>
              {NAVIGATION_LINKS.map((link) => {
                const IconComponent = (LucideIcons as any)[link.icon] || LucideIcons.HelpCircle;
                return (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))}
                        tooltip={{children: link.label, className: "bg-popover text-popover-foreground"}}
                      >
                        <IconComponent />
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" /> {/* Only show trigger on mobile */}
             <div className="hidden md:block text-2xl font-semibold">
                {NAVIGATION_LINKS.find(link => pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href)))?.label || "Dashboard"}
             </div>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

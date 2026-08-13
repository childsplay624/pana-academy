import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header with trigger - Fixed height, stays at top */}
          <header className="h-14 flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="flex items-center h-full px-4">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <a
                  href="/"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-600 transition-colors bg-secondary/50 px-3 py-1.5 rounded-full border border-border group"
                  title="Return to Public Website"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-medium text-xs">Back to Homepage</span>
                </a>
              </div>
            </div>
          </header>

          {/* Main content - Only this part should scroll */}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="min-h-full w-full p-3 sm:p-5">
              <div className="w-full space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
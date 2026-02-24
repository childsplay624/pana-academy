import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

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
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
            </div>
          </header>

          {/* Main content - Only this part should scroll */}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="min-h-full w-full p-6 md:p-8">
              <div className="max-w-5xl mx-auto space-y-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
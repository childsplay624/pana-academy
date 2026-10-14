import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Home, BookMarked, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

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
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                  <span className="text-xs text-muted-foreground hidden md:inline">|</span>
                  <span className="text-xs text-muted-foreground hidden md:inline font-medium">Administration & Control Hub</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Documentation Navbar Pill Button */}
                  <NavLink
                    to="/dashboard/documentation"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        isActive
                          ? "bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30"
                          : "bg-background text-foreground hover:bg-secondary/70 border-border text-muted-foreground hover:text-foreground"
                      }`
                    }
                    title="System Documentation & Architecture"
                  >
                    <BookMarked className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>Documentation</span>
                    <span className="hidden lg:inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      v1.0
                    </span>
                  </NavLink>

                  <a
                    href="/"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-red-600 transition-colors bg-secondary/50 px-3 py-1.5 rounded-full border border-border group"
                    title="Return to Public Website"
                  >
                    <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline font-medium">Website</span>
                  </a>
                </div>
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
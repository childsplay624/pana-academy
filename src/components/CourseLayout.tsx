import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface CourseLayoutProps {
  children: ReactNode;
}

export function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        <AppSidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b bg-background flex items-center px-4 lg:px-6 shrink-0 z-10">
            <SidebarTrigger className="ml-2" />
          </header>

          {/* Main Content - Only this part should scroll */}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
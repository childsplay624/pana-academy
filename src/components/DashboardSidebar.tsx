import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Award,
  TrendingUp,
  User,
  Calendar,
  MapPin,
  FileText,
  HelpCircle,
  LogOut,
  CreditCard,
  ImageIcon,
  MessageSquareText,
  MessageSquare,
  Mail,
  Globe,
  Tag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const { profile, signOut } = useAuth();
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = !open;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ];

    if (profile?.role === 'admin') {
      return [
        ...baseItems,
        { title: "User Management", url: "/dashboard/users", icon: Users },
        { title: "Course Management", url: "/dashboard/courses", icon: BookOpen },
        { title: "Course Category", url: "/dashboard/course-categories", icon: Tag },
        { title: "Image Management", url: "/dashboard/images", icon: ImageIcon },
        { title: "Team Management", url: "/dashboard/team", icon: Users },
        { title: "Payment Management", url: "/dashboard/payments", icon: CreditCard },
        { title: "Invoice", url: "/dashboard/invoices", icon: FileText },
        { title: "Venue Management", url: "/dashboard/venues", icon: MapPin },
        { title: "Message Management", url: "/dashboard/messages", icon: Mail },
        { title: "Support Tickets", url: "/dashboard/support-tickets", icon: MessageSquare },
        { title: "Page Builder", url: "/dashboard/pages", icon: Globe },
        { title: "Blog & News", url: "/dashboard/blog", icon: FileText },
        { title: "Analytics", url: "/dashboard/analytics", icon: TrendingUp },
        { title: "Testimonial", url: "/dashboard/testimonials", icon: MessageSquareText },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ];
    }

    if (profile?.role === 'instructor') {
      return [
        ...baseItems,
        { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
        { title: "Profile", url: "/student/profile", icon: User },
      ];
    }

    // Student items
    return [
      ...baseItems,
      { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
      { title: "Certificates", url: "/dashboard/certificates", icon: Award },
      { title: "Progress", url: "/dashboard/progress", icon: Calendar },
      { title: "Profile", url: "/student/profile", icon: User },
      { title: "Assignments", url: "/dashboard/assignments", icon: FileText },
      { title: "Help", url: "/dashboard/help", icon: HelpCircle },
    ];
  };

  const navigationItems = getNavigationItems();
  const hasActiveItem = navigationItems.some((item) => isActive(item.url));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-sidebar-border">
        {/* Header */}
        <div className={cn("p-4 border-b border-sidebar-border transition-all duration-200", collapsed && "p-2")}>
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sidebar-foreground truncate">PANA Institute</h2>
                <Badge variant="outline" className="text-[10px] h-4 px-1 leading-none border-primary/30 text-primary">
                  {profile?.role}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-background">
                <span className="text-primary-foreground font-extrabold text-base">P</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="transition-all duration-200"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile & Sign Out */}
        <div className={cn("p-4 border-t border-sidebar-border mt-auto transition-all duration-200", collapsed && "p-2")}>
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-1 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-background border rounded-full flex items-center justify-center ring-2 ring-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-sidebar-foreground truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
                    Personal Account
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="w-full justify-start h-9 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                <span className="text-xs font-medium">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center ring-2 ring-primary/5 hover:ring-primary/20 transition-all cursor-pointer">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={signOut}
                className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
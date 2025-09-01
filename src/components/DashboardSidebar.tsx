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
  FileText,
  HelpCircle,
  LogOut,
  CreditCard,
  MessageSquareText
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
        { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
        { title: "Analytics", url: "/dashboard/analytics", icon: TrendingUp },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ];
    }

    if (profile?.role === 'instructor') {
      return [
        ...baseItems,
        { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
        { title: "Students", url: "/dashboard/students", icon: Users },
        { title: "Analytics", url: "/dashboard/analytics", icon: TrendingUp },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ];
    }

    // Student items
    return [
      ...baseItems,
      { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
      { title: "Certificates", url: "/dashboard/certificates", icon: Award },
      { title: "Progress", url: "/dashboard/progress", icon: Calendar },
      { title: "Assignments", url: "/dashboard/assignments", icon: FileText },
      { title: "Help", url: "/dashboard/help", icon: HelpCircle },
    ];
  };

  const navigationItems = getNavigationItems();
  const hasActiveItem = navigationItems.some((item) => isActive(item.url));

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-sidebar border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-sidebar-foreground">PANA Academy</h2>
                <Badge variant="outline" className="text-xs">
                  {profile?.role}
                </Badge>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
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
                  <NavLink 
                    to={item.url} 
                    end={item.url === "/dashboard"}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                      }
                      ${collapsed ? 'justify-center px-2' : ''}
                    `}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          {!collapsed && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    Welcome back!
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
          
          {collapsed && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
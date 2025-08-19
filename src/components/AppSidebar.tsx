import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  BookOpen,
  Plus,
  Users,
  BarChart3,
  Settings,
  Home,
  FileText,
  Award,
  HelpCircle,
  LogOut
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const adminItems = [
  { title: "Dashboard", url: "/dashboard/admin", icon: Home },
  { title: "Course Management", url: "/dashboard/courses", icon: BookOpen },
  { title: "Add Course", url: "/dashboard/courses/new", icon: Plus },
  { title: "User Management", url: "/dashboard/users", icon: Users },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const instructorItems = [
  { title: "Dashboard", url: "/dashboard/instructor", icon: Home },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Add Course", url: "/dashboard/courses/new", icon: Plus },
];

const studentItems = [
  { title: "Dashboard", url: "/dashboard/student", icon: Home },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Assignments", url: "/dashboard/assignments", icon: FileText },
  { title: "Progress", url: "/dashboard/progress", icon: BarChart3 },
  { title: "Certificates", url: "/dashboard/certificates", icon: Award },
  { title: "Help", url: "/dashboard/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const currentPath = location.pathname;

  const getItems = () => {
    switch (profile?.role) {
      case 'admin':
        return adminItems;
      case 'instructor':
        return instructorItems;
      case 'student':
        return studentItems;
      default:
        return [];
    }
  };

  const items = getItems();
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  const isExpanded = items.some((i) => isActive(i.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      variant="sidebar"
    >
      <SidebarContent>
        {/* User Profile Section */}
        {state !== "collapsed" && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard/courses"} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && <span className="ml-2">{item.title}</span>}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            size={state === "collapsed" ? "icon" : "default"}
            onClick={signOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {state !== "collapsed" && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
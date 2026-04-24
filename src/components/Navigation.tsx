import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Settings, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from './Logo';
import { NotificationBell } from '@/components/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [customPages, setCustomPages] = useState<{name: string, href: string}[]>([]);

  // Fetch dynamic pages for navbar
  useEffect(() => {
    const fetchNavPages = async () => {
      const { data } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('status', 'published')
        .eq('show_in_navbar', true);
      
      if (data) {
        setCustomPages(data.map(p => ({
          name: p.title,
          href: `/p/${p.slug}`
        })));
      }
    };
    fetchNavPages();
  }, []);

  // Memoize navigation items
  const navItems = useMemo(() => {
    const items = [
      { name: "Home", href: "/" },
      {
        name: "About",
        href: "/about",
        dropdown: [
          { name: "About Us", href: "/about" },
          { name: "Our Team", href: "/team" },
          { name: "Our Journey", href: "/our-journey" },
          { name: "Testimonials", href: "/testimonials" }
        ]
      },
      {
        name: "Solutions",
        href: "#services",
        dropdown: [
          { name: "Consulting Services", href: "/consulting-services" },
          { name: "Research & Development", href: "/research-development" },
          { name: "Training Delivery", href: "/training-delivery" }
        ]
      },
      { name: "Courses", href: "/courses" },
      { name: "Contact Us", href: "/contact" }
    ];

    // If we have custom pages, add a dropdown for them
    if (customPages.length > 0) {
      items.push({
        name: "Resources",
        href: "#",
        dropdown: customPages
      });
    }

    return items;
  }, [customPages]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState({}, '', href);
        }
      }
    } else {
      navigate(href);
    }

    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, navigate]);

  const handleDropdownEnter = useCallback((dropdownName: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveDropdown(dropdownName.toLowerCase());
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  }, []);

  const handleDropdownClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, dropdownName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newDropdown = activeDropdown === dropdownName.toLowerCase() ? null : dropdownName.toLowerCase();
    setActiveDropdown(newDropdown);
  }, [activeDropdown]);

  const isLinkActive = useCallback((href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href === '#') return false;
    if (href.startsWith('#')) return location.pathname === '/' && location.hash === href;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }, [location]);

  const renderDesktopNav = () => (
    <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
      <div className="flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive = isLinkActive(item.href);

          return (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={item.dropdown ? () => handleDropdownEnter(item.name) : undefined}
              onMouseLeave={item.dropdown ? handleDropdownLeave : undefined}
            >
              <a
                href={item.href}
                className={`relative uppercase px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${isActive
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                onClick={(e) => {
                  if (item.dropdown) {
                    handleDropdownClick(e, item.name);
                  } else {
                    handleNavigation(e, item.href);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name.toLowerCase() ? 'rotate-180' : ''}`} />
                )}
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                )}
              </a>

              <AnimatePresence>
                {item.dropdown && activeDropdown === item.name.toLowerCase() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 z-50 overflow-hidden"
                    onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem) => {
                        const isSubActive = isLinkActive(subItem.href);
                        return (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className={`block uppercase px-4 py-3 text-sm transition-colors ${isSubActive ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation(e, subItem.href); }}
                          >
                            <div className="flex items-center gap-2">
                              {isSubActive && <div className="w-1 h-4 bg-red-600 rounded-full" />}
                              {subItem.name}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-white/80 dark:bg-gray-900/80'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Logo />
            {renderDesktopNav()}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-1">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-red-50 text-red-600">
                            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-bold">{profile?.full_name || 'My Account'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/student/profile')}><User className="mr-2 h-4 w-4" /> My Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/auth"><Button size="sm" className="bg-red-600 text-white">Sign In</Button></Link>
              )}
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-20 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-40 md:hidden overflow-y-auto"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className={`flex uppercase items-center justify-between px-4 py-3 rounded-lg text-base font-medium ${isLinkActive(item.href) ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}
                      onClick={(e) => {
                        if (item.dropdown) {
                          e.preventDefault();
                          setActiveDropdown(activeDropdown === item.name.toLowerCase() ? null : item.name.toLowerCase());
                        } else {
                          handleNavigation(e, item.href);
                        }
                      }}
                    >
                      {item.name}
                      {item.dropdown && <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === item.name.toLowerCase() ? 'rotate-180' : ''}`} />}
                    </a>
                    {item.dropdown && activeDropdown === item.name.toLowerCase() && (
                      <div className="mt-2 ml-4 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name} href={subItem.href}
                            className={`block uppercase px-4 py-2.5 rounded-lg text-sm ${isLinkActive(subItem.href) ? 'bg-red-50 text-red-600' : 'text-gray-600'}`}
                            onClick={(e) => handleNavigation(e, subItem.href)}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
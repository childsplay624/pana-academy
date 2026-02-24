import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Search, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
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

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(() => [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About PANA",
      href: "/about",
      dropdown: [
        {
          name: "About Us",
          href: "/about",
        },
        {
          name: "Our Team",
          href: "/team",
        },
        {
          name: "Our Journey",
          href: "/our-journey",
        }
      ]
    },
    {
      name: "Solutions and Services",
      href: "#services",
      dropdown: [
        {
          name: "Consulting Services",
          href: "/consulting-services",
        },
        {
          name: "Research & Development",
          href: "/research-development",
        },
        {
          name: "Training Delivery",
          href: "/training-delivery",
        }
      ]
    },
    {
      name: "Courses",
      href: "/courses",
    },
    {
      name: "Testimonials",
      href: "#testimonials",
    },
    {
      name: "Contact Us",
      href: "/contact",
    }
  ], []);

  // Handle scroll effect with passive listener
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle scroll after navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Memoized navigation handler
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          window.history.pushState({}, '', href);
        }
      }
    } else {
      navigate(href);
    }

    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, navigate]);

  // Memoized dropdown handlers
  const handleDropdownEnter = useCallback((dropdownName: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setActiveDropdown(dropdownName.toLowerCase());
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Reduced from 500ms for better UX
  }, []);

  const handleDropdownClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, dropdownName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newDropdown = activeDropdown === dropdownName.toLowerCase() ? null : dropdownName.toLowerCase();
    setActiveDropdown(newDropdown);
  }, [activeDropdown]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, item: any) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item.dropdown) {
        setActiveDropdown(activeDropdown === item.name.toLowerCase() ? null : item.name.toLowerCase());
      }
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  }, [activeDropdown]);

  // Check if link is active
  const isLinkActive = useCallback((href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    if (href.startsWith('#')) {
      return location.pathname === '/' && location.hash === href;
    }
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
                className={`relative px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${isActive
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
                onKeyDown={(e) => handleKeyDown(e, item)}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={item.dropdown ? activeDropdown === item.name.toLowerCase() : undefined}
                aria-haspopup={item.dropdown ? 'true' : undefined}
                tabIndex={0}
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name.toLowerCase() ? 'rotate-180' : ''
                      }`}
                    aria-hidden="true"
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>

              <AnimatePresence>
                {item.dropdown && activeDropdown === item.name.toLowerCase() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden"
                    onMouseEnter={() => {
                      if (closeTimerRef.current) {
                        clearTimeout(closeTimerRef.current);
                      }
                    }}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="py-2" role="menu" aria-orientation="vertical">
                      {item.dropdown.map((subItem) => {
                        const isSubActive = isLinkActive(subItem.href);

                        return (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-4 py-3 text-sm transition-colors duration-150 ${isSubActive
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(e, subItem.href);
                            }}
                            role="menuitem"
                            aria-current={isSubActive ? 'page' : undefined}
                          >
                            <div className="flex items-center gap-2">
                              {isSubActive && (
                                <div className="w-1 h-4 bg-red-600 rounded-full" />
                              )}
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300 ${scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
          }`}
        role="banner"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            {renderDesktopNav()}

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-1">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all">
                        <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors">
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                          <AvatarFallback className="bg-red-50 text-red-600 font-bold">
                            {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-bold leading-none text-gray-900 dark:text-gray-100">{profile?.full_name || 'My Account'}</p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/student/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-40 md:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = isLinkActive(item.href);

                  return (
                    <div key={item.name}>
                      <a
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors duration-150 ${isActive
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        onClick={(e) => {
                          if (item.dropdown) {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === item.name.toLowerCase() ? null : item.name.toLowerCase());
                          } else {
                            handleNavigation(e, item.href);
                          }
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        aria-expanded={item.dropdown ? activeDropdown === item.name.toLowerCase() : undefined}
                      >
                        {item.name}
                        {item.dropdown && (
                          <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${activeDropdown === item.name.toLowerCase() ? 'rotate-180' : ''
                              }`}
                          />
                        )}
                      </a>

                      <AnimatePresence>
                        {item.dropdown && activeDropdown === item.name.toLowerCase() && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 ml-4 space-y-1">
                              {item.dropdown.map((subItem) => {
                                const isSubActive = isLinkActive(subItem.href);

                                return (
                                  <a
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={`block px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 ${isSubActive
                                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                      }`}
                                    onClick={(e) => handleNavigation(e, subItem.href)}
                                    aria-current={isSubActive ? 'page' : undefined}
                                  >
                                    {subItem.name}
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

                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                          <AvatarFallback className="bg-red-50 text-red-600 font-bold">
                            {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{profile?.full_name || 'My Account'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start font-medium px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <LayoutDashboard className="h-4 w-4 mr-3 text-gray-500" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link to="/student/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start font-medium px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <User className="h-4 w-4 mr-3 text-gray-500" />
                            My Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-medium px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  let closeTimer: NodeJS.Timeout;

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
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

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('#')) {
      // If we're not on the home page, navigate to home with hash
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        // If we're already on home, just scroll
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Update URL without page reload
          window.history.pushState({}, '', href);
        }
      }
    } else {
      // For regular routes
      navigate(href);
    }
    
    // Close mobile menu if open
    setIsOpen(false);
  };

  const handleDropdownEnter = (dropdownName: string) => {
    clearTimeout(closeTimer);
    setActiveDropdown(dropdownName.toLowerCase());
    setIsHovering(true);
  };

  const handleDropdownLeave = () => {
    // Don't close the dropdown if the mouse is still over the dropdown content
    if (isHovering) return;
    
    closeTimer = setTimeout(() => {
      // Only close if we're not hovering over any dropdown
      if (!isHovering) {
        setActiveDropdown(null);
      }
    }, 500); // Increased delay to 500ms for better user experience
  };
  
  // Handle mouse enter/leave on the dropdown content
  const handleDropdownContentEnter = () => {
    clearTimeout(closeTimer);
    setIsHovering(true);
  };
  
  const handleDropdownContentLeave = () => {
    setIsHovering(false);
    closeTimer = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLAnchorElement>, dropdownName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newDropdown = activeDropdown === dropdownName.toLowerCase() ? null : dropdownName.toLowerCase();
    setActiveDropdown(newDropdown);
    return false;
  };

  const navItems = [
    { 
      name: "Home", 
      href: "/",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/")
    },    
    { 
      name: "About PANA",
      href: "#about",
      onMouseEnter: () => handleDropdownEnter('about'),
      onMouseLeave: handleDropdownLeave,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleDropdownClick(e, 'about'),
      dropdown: [
        { 
          name: "About Us", 
          href: "#about",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#about")
        },
        { 
          name: "Our Team", 
          href: "/team",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/team")
        },
        { 
          name: "Our Journey", 
          href: "/our-journey",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/our-journey")
        }
      ]
    },
    { 
      name: "Services", 
      href: "#services",
      onMouseEnter: () => handleDropdownEnter('services'),
      onMouseLeave: handleDropdownLeave,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleDropdownClick(e, 'services'),
      dropdown: [
        { 
          name: "Consulting Services", 
          href: "/consulting-services",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            navigate('/consulting-services');
          }
        },
        { 
          name: "Research & Development", 
          href: "/research-development",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            navigate('/research-development');
          }
        },
        { 
          name: "Training Delivery", 
          href: "/training-delivery",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/training-delivery")
        }
        
      ]
    },
    { 
      name: "Courses", 
      href: "/courses",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/courses")
    },
    { 
      name: "Testimonials", 
      href: "#testimonials",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#testimonials")
    },
    { 
      name: "Contact Us", 
      href: "#contact",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#contact")
    }
  ];

  const renderDesktopNav = () => (
    <nav className="hidden md:flex items-center">
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <div key={item.name} className="relative group">
            <a
              href={item.href}
              className={`px-4 py-2.5 rounded-md text-xs font-medium tracking-wider uppercase transition-colors ${
                location.pathname === item.href ||
                (item.href.startsWith('#') && location.pathname === '/' && location.hash === item.href)
                  ? 'bg-gray-100 dark:bg-gray-800 text-foreground'
                  : 'text-foreground/70 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground/90'
              }`}
              onClick={(e) => {
                if (item.dropdown) {
                  e.preventDefault();
                  handleDropdownClick(e, item.name);
                } else {
                  item.onClick?.(e as any);
                }
              }}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                {item.name}
                {item.dropdown && (
                  <ChevronDown 
                    className={`h-3.5 w-3.5 transition-transform ${
                      activeDropdown === item.name.toLowerCase() ? 'transform rotate-180' : ''
                    }`}
                  />
                )}
              </div>
            </a>
            {item.dropdown && activeDropdown === item.name.toLowerCase() && (
              <div 
                className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 z-50"
                onMouseEnter={handleDropdownContentEnter}
                onMouseLeave={handleDropdownContentLeave}
              >
                <div className="py-1">
                  {item.dropdown.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.preventDefault();
                        subItem.onClick?.(e);
                        setActiveDropdown(null);
                      }}
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-24 flex items-center transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md' 
        : 'bg-white/10 backdrop-blur-sm before:absolute before:inset-0 before:bg-white/30 before:backdrop-blur-sm before:z-[-1]'
    } relative`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4 h-full">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
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
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-pana-blue hover:bg-pana-light-gray transition-colors duration-200"
                    onClick={(e) => {
                      item.onClick(e);
                      setIsOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                  {item.dropdown && activeDropdown === item.name.toLowerCase() && (
                    <div className="mt-1 pl-4 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                          onClick={(e) => {
                            subItem.onClick?.(e as any);
                            setActiveDropdown(null);
                            setIsOpen(false);
                          }}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="premium" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
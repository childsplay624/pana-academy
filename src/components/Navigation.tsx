import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  const navItems = [
    { 
      name: "Home", 
      href: "/",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "/")
    },    
    { 
      name: "About Us", 
      href: "#about",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#about")
    },
    { 
      name: "Services", 
      href: "#services",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#services"),
      dropdown: [
        { 
          name: "Training Programs", 
          href: "#training",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#training")
        },
        { 
          name: "Consulting Services", 
          href: "#consulting",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#consulting")
        },
        { 
          name: "Research & Development", 
          href: "#research",
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#research")
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
      name: "Contact", 
      href: "#contact",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavigation(e, "#contact")
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-foreground hover:text-pana-blue transition-colors duration-200 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </a>
                
                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2">
                    {item.dropdown.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        onClick={(e) => {
                          dropdownItem.onClick(e);
                          setActiveDropdown(null);
                        }}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-pana-light-gray hover:text-pana-blue transition-colors duration-200 cursor-pointer"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="premium" size="sm">
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
                  {item.dropdown && (
                    <div className="pl-6 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          onClick={(e) => {
                            dropdownItem.onClick(e);
                            setIsOpen(false);
                          }}
                          className="block px-4 py-2 text-foreground hover:bg-pana-light-gray hover:text-pana-blue rounded-md transition-colors duration-200 cursor-pointer"
                        >
                          {dropdownItem.name}
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
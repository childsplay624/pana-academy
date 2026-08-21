import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Settings, 
  FileText, Sparkles, BookOpen, Users, Compass, Award,
  Layers, ArrowRight, Zap, ChevronRight, ShieldCheck
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

// ─── Styles injected via CSS-in-JS for the shimmer effect ───
export const shimmerKeyframes = `
@keyframes nav-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

const ICON_MAP: Record<string, any> = {
  Compass, ShieldCheck, Users, Award, Sparkles, BookOpen, Zap, Layers, FileText
};

export const getIconComponent = (icon: any) => {
  if (typeof icon === 'string' && ICON_MAP[icon]) return ICON_MAP[icon];
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) return icon;
  return FileText;
};

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [navItems, setNavItems] = useState<any[]>([]);

  // ─── Fetch dynamic pages and navbar structure ───
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        // Fetch custom pages for the "More" dropdown fallback
        const { data: pageData } = await supabase
          .from('pages')
          .select('title, slug')
          .eq('status', 'published')
          .eq('show_in_navbar', true);
          
        let customPagesDropdown: any[] = [];
        if (pageData && pageData.length > 0) {
          customPagesDropdown = pageData.map(p => ({ name: p.title, href: `/p/${p.slug}`, icon: FileText }));
        }

        // Fetch dynamic navbar
        const { data: settingData } = await supabase
          .from('platform_settings')
          .select('value')
          .eq('key', 'navbar_layout')
          .maybeSingle();

        if (settingData && settingData.value) {
          let parsed = settingData.value;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          const hasNewInstituteNav = Array.isArray(parsed) && parsed.some((item: any) => item.href === '/our-institute' || item.href === '/competency');
          if (hasNewInstituteNav) {
            setNavItems(parsed);
            return;
          }
        }

        // Fallback default navigation if no custom layout exists
        const defaultItems = [
          { name: "Home", href: "/" },
          {
            name: "Our Institute",
            href: "/our-institute",
            megaMenu: true,
            columns: [
              {
                heading: "Overview & Leadership",
                links: [
                  { name: "About PANA Institute", href: "/about", desc: "Our mandate & heritage", icon: Compass },
                  { name: "Leadership & Faculty", href: "/team", desc: "Council & domain experts", icon: Users },
                  { name: "Our Journey", href: "/our-institute#our-journey", desc: "From Academy to Institute", icon: Layers },
                  { name: "Governing Council", href: "/our-institute#gov-council", desc: "Supreme oversight", icon: ShieldCheck },
                ]
              },
              {
                heading: "Culture & Trust",
                links: [
                  { name: "Client Testimonials", href: "/testimonials", desc: "Industry endorsements", icon: Award },
                  { name: "Safety at PANA Institute", href: "/our-institute#safety", desc: "ISO 14001 & ISO 45001", icon: ShieldCheck },
                  { name: "Careers", href: "/careers", desc: "Build the Institute with us", icon: Sparkles },
                  { name: "People & Culture", href: "/our-institute#culture", desc: "The five operating Ps", icon: Users },
                ]
              }
            ],
            callout: {
              title: "PANA Institute",
              desc: "Building the standard against which competence is measured.",
              cta: "Learn More",
              href: "/our-institute",
            }
          },
          {
            name: "Competency",
            href: "/competency",
            megaMenu: true,
            columns: [
              {
                heading: "Assessment & Development",
                links: [
                  { name: "Course Catalogue", href: "/courses", desc: "Full list of active courses", icon: BookOpen },
                  { name: "Training Calendar", href: "/training-calendar", desc: "Schedules & key dates", icon: Zap },
                  { name: "Programmes", href: "/competency#programmes", desc: "13 categories of training", icon: BookOpen },
                  { name: "Faculty & Assessors", href: "/team", desc: "Certified instructors", icon: Users },
                ]
              }
            ],
            callout: {
              title: "Competency Vertical",
              desc: "Assess, then cultivate practical competencies.",
              cta: "Explore Programmes",
              href: "/competency",
            }
          },
          {
            name: "Research & R&D",
            href: "/research",
            megaMenu: true,
            columns: [
              {
                heading: "Centres of Excellence",
                links: [
                  { name: "Oil & Gas Technology", href: "/research#coe-oilgas", desc: "Upstream & process safety", icon: Layers },
                  { name: "Sustainability & Environment", href: "/research#coe-sustainability", desc: "Emissions & ESG reporting", icon: Sparkles },
                  { name: "Energy & Power", href: "/research#coe-energy", desc: "Grid modernisation & renewables", icon: Zap },
                  { name: "Digital Innovation & AI", href: "/research#coe-digital", desc: "Industrial data & OT security", icon: Layers },
                  { name: "Publications & Blog", href: "/blog", desc: "Think tank research articles", icon: FileText },
                ]
              }
            ],
            callout: {
              title: "5 Centres of Excellence",
              desc: "Supplying subject authority and driving applied research.",
              cta: "Discover R&D",
              href: "/research",
            }
          },
          { name: "Consultancy", href: "/consultancy" },
          { name: "Sustainability", href: "/sustainability" },
          { name: "Global Engagements", href: "/global" },
          { name: "Courses", href: "/courses" },
          { name: "Calendar", href: "/training-calendar" },
          { name: "Blog", href: "/blog" },
          { name: "Contact", href: "/contact" },
        ];

        if (customPagesDropdown.length > 0) {
          defaultItems.push({
            name: "More",
            href: "#",
            dropdown: customPagesDropdown,
            megaMenu: false,
          } as any);
        }

        setNavItems(defaultItems);
      } catch (err) {
        console.error("Error fetching navbar data:", err);
      }
    };
    fetchNavData();
  }, []);

  // ─── Scroll handler ───
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Close on route change ───
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // ─── Navigation helpers ───
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href || href === '#') {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (href.includes('#')) {
      const parts = href.split('#');
      const targetPath = parts[0] || '/';
      const targetHash = parts[1];

      const currentPath = location.pathname;
      const isSamePage = currentPath === targetPath ||
        (targetPath === '/our-institute' && (currentPath === '/' || currentPath === '/our-institute'));

      if (isSamePage) {
        const el = document.getElementById(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState({}, '', `#${targetHash}`);
        } else {
          navigate(href);
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }

    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, navigate]);

  const handleDropdownEnter = useCallback((name: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveDropdown(name);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 200);
  }, []);

  const isActive = useCallback((href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href === '#') return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }, [location]);

  // ─── Desktop: Render mega-menu panel ───
  const renderMegaPanel = (item: any) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
      onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
      onMouseLeave={handleDropdownLeave}
    >
      <div className="w-[760px] max-w-[90vw] bg-paper rounded-sm shadow-2xl border border-line overflow-hidden p-6">
        <div className="grid grid-cols-5 gap-6">
          {/* Links columns */}
          <div className="col-span-3 space-y-6">
            {item.columns?.map((col: any, ci: number) => (
              <div key={ci}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-oxblood mb-3">{col.heading}</p>
                <div className="space-y-1">
                  {col.links.map((link: any) => {
                    const Icon = getIconComponent(link.icon);
                    const active = isActive(link.href);
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleNavigation(e, link.href); }}
                        className={`group flex items-start gap-3 p-2.5 rounded-xs transition-colors ${
                          active 
                            ? 'bg-paper-soft text-oxblood font-medium' 
                            : 'hover:bg-paper-soft text-ink-soft hover:text-oxblood'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-xs flex items-center justify-center bg-paper-soft text-oxblood group-hover:bg-oxblood group-hover:text-white transition-colors shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13.5px] leading-tight ${active ? 'font-semibold text-oxblood' : 'font-medium text-ink'}`}>
                            {link.name}
                          </p>
                          {link.desc && (
                            <p className="text-xs text-muted-foreground leading-snug mt-0.5">{link.desc}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Callout Card */}
          {item.callout && (
            <div className="col-span-2 bg-paper-soft p-5 border border-line rounded-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass font-semibold block mb-2">Featured</span>
                <h4 className="font-serif text-lg font-medium text-ink mb-2 leading-tight">{item.callout.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.callout.desc}</p>
              </div>
              <a
                href={item.callout.href}
                onClick={(e) => handleNavigation(e, item.callout.href)}
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-oxblood hover:text-oxblood-deep font-semibold transition-colors group/cta"
              >
                {item.callout.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // ─── Desktop: Render simple dropdown ───
  const renderSimpleDropdown = (item: any) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-0 pt-2 z-50"
      onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
      onMouseLeave={handleDropdownLeave}
    >
      <div className="w-56 bg-paper rounded-xs shadow-xl border border-line p-2 space-y-0.5">
        {item.dropdown.map((link: any) => {
          const active = isActive(link.href);
          const Icon = getIconComponent(link.icon);
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavigation(e, link.href); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xs text-[13px] font-medium transition-colors ${
                active ? 'bg-paper-soft text-oxblood font-semibold' : 'text-ink-soft hover:bg-paper-soft hover:text-oxblood'
              }`}
            >
              <Icon className="w-4 h-4 text-oxblood" />
              {link.name}
            </a>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{shimmerKeyframes}</style>

      {/* ─── Header (Full-width PANA Institute Header) ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-line shadow-sm'
            : 'bg-paper/90 backdrop-blur-md border-b border-line'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[70px]">

            {/* Logo / Brand */}
            <Link to="/" className="shrink-0 relative z-10 flex items-center gap-2">
              <Logo />
            </Link>

            {/* ─── Header Actions (Contact Us CTA + User Profile + Hamburger Button for Desktop & Mobile) ─── */}
            <div className="flex items-center gap-4">
              {/* Contact Us CTA (HTML Prototype signature button) */}
              <Link to="/contact" className="hidden sm:inline-block bg-oxblood hover:bg-oxblood-deep text-white font-mono text-[11px] font-medium tracking-widest uppercase px-4 py-2 rounded-xs transition-colors">
                Contact us
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative h-9 w-9 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 transition-shadow hover:shadow-md">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-oxblood text-white text-xs font-bold font-serif">
                            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xs p-1.5 shadow-xl bg-paper border border-line" align="end" sideOffset={8}>
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-semibold truncate text-ink">{profile?.full_name || 'My Account'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {profile?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xs cursor-pointer gap-2 font-medium">
                          <LayoutDashboard className="h-4 w-4 text-oxblood" /> Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => navigate('/student/profile')} className="rounded-xs cursor-pointer gap-2 font-medium">
                        <User className="h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="rounded-xs cursor-pointer gap-2 font-medium">
                        <Settings className="h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="rounded-xs cursor-pointer gap-2 font-medium text-oxblood focus:text-oxblood">
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/auth?mode=login" className="hidden sm:inline-block text-xs font-mono font-medium text-ink-soft hover:text-oxblood px-2 py-1 transition-colors">
                  Sign In
                </Link>
              )}

              {/* ─── PANA Institute 3-Bar Hamburger Trigger (Active for Desktop & Mobile) ─── */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative h-10 w-10 flex flex-col justify-center items-center gap-[5px] bg-paper-soft hover:bg-line/40 border border-line rounded-xs transition-colors p-2.5"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <span 
                  className={`w-5 h-[2px] bg-ink transition-transform duration-300 origin-center ${
                    isOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`} 
                />
                <span 
                  className={`w-5 h-[2px] bg-ink transition-opacity duration-200 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`} 
                />
                <span 
                  className={`w-5 h-[2px] bg-ink transition-transform duration-300 origin-center ${
                    isOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Executive Right-Side Navigation Sidebar Drawer ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Translucent Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-Over Right Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 w-full sm:w-[480px] md:w-[520px] h-full z-50 bg-paper border-l border-line shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="bg-paper-soft border-b border-line px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Logo />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xs bg-paper border border-line flex items-center justify-center text-ink hover:text-oxblood hover:border-oxblood/40 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Subheader Badge */}
              <div className="bg-ink text-paper px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-zinc-800">
                <span className="text-brass uppercase tracking-[0.2em] font-semibold">PANA INSTITUTE DIRECTORY</span>
                <span className="text-zinc-400">SELECT SECTION</span>
              </div>

              {/* Scrollable Navigation Sections */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {navItems.map((item: any, idx: number) => {
                  const active = isActive(item.href);
                  const hasChildren = item.columns || item.dropdown;
                  const allLinks = item.columns
                    ? item.columns.flatMap((c: any) => c.links)
                    : item.dropdown || [];

                  return (
                    <div key={item.name} className="bg-paper-soft border border-line rounded-xs p-5 hover:border-oxblood/30 transition-colors">
                      <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
                        <span className="font-mono text-[10px] text-oxblood uppercase tracking-widest font-semibold">
                          0{idx + 1} · {item.name}
                        </span>
                        {hasChildren && (
                          <span className="font-mono text-[10px] text-brass uppercase font-semibold">
                            {allLinks.length} SECTIONS
                          </span>
                        )}
                      </div>

                      <a
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item.href)}
                        className={`flex items-center justify-between text-xl font-serif font-medium transition-colors ${
                          active ? 'text-oxblood font-semibold' : 'text-ink hover:text-oxblood'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-4 h-4 text-oxblood opacity-80" />
                      </a>

                      {/* Sub-navigation Links */}
                      {hasChildren && allLinks.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-line/60 space-y-2">
                          {allLinks.map((link: any) => {
                            const Icon = getIconComponent(link.icon);
                            const linkActive = isActive(link.href);
                            return (
                              <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavigation(e, link.href)}
                                className={`flex items-start gap-3 p-2 rounded-xs transition-colors group ${
                                  linkActive
                                    ? 'bg-paper text-oxblood font-semibold'
                                    : 'hover:bg-paper text-ink-soft hover:text-oxblood'
                                }`}
                              >
                                <div className="w-6 h-6 rounded-xs bg-paper border border-line flex items-center justify-center text-oxblood shrink-0 mt-0.5 group-hover:border-oxblood/40">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-ink group-hover:text-oxblood">
                                    {link.name}
                                  </div>
                                  {link.desc && (
                                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                      {link.desc}
                                    </div>
                                  )}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Footer Actions */}
              <div className="p-6 bg-paper-soft border-t border-line space-y-3 shrink-0">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest py-3.5 rounded-xs font-semibold text-center block shadow-md border border-oxblood-light"
                >
                  Contact Us / Executive Advisory
                </Link>

                {!user ? (
                  <Link
                    to="/auth?mode=login"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-paper hover:bg-paper-soft text-ink border border-line font-mono text-xs uppercase tracking-widest py-3 rounded-xs font-semibold text-center block"
                  >
                    Sign In to Portal
                  </Link>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-oxblood text-white text-xs font-serif font-bold">
                          {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-ink truncate max-w-[180px]">
                        {profile?.full_name || user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="font-mono text-xs text-oxblood hover:underline flex items-center gap-1 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
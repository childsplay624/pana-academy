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
const shimmerKeyframes = `
@keyframes nav-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

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
          setNavItems(parsed);
          return;
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
                  { name: "Our Journey", href: "/our-institute#our-journey", desc: "From Academy to Institute", icon: Compass },
                  { name: "Governing Council", href: "/our-institute#gov-council", desc: "Supreme oversight", icon: ShieldCheck },
                  { name: "Executive Management", href: "/our-institute#exec-team", desc: "Operations & strategy leads", icon: Users },
                  { name: "Inaugural Faculties", href: "/our-institute#faculties", desc: "Technical domain experts", icon: Award },
                ]
              },
              {
                heading: "Culture & Safety",
                links: [
                  { name: "Safety at PANA Institute", href: "/our-institute#safety", desc: "ISO 14001 & ISO 45001", icon: ShieldCheck },
                  { name: "Careers", href: "/our-institute#careers", desc: "Build the Institute with us", icon: Sparkles },
                  { name: "Our People & Culture", href: "/our-institute#culture", desc: "The five operating Ps", icon: Users },
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
                  { name: "Programmes", href: "/competency#programmes", desc: "13 categories of training", icon: BookOpen },
                  { name: "Faculty", href: "/competency#faculty", desc: "Industry-leading instructors", icon: Users },
                  { name: "Labs", href: "/competency#labs", desc: "Experiential facilities", icon: Zap },
                  { name: "Roar Club", href: "/competency#roar-club", desc: "Alumni network & fellowship", icon: Award },
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
                  { name: "Smart Agriculture", href: "/research#coe-agric", desc: "Agri processing & climate risk", icon: Compass },
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
    if (href === '#') { e.preventDefault(); return; }
    e.preventDefault();
    if (href.startsWith('#')) {
      if (location.pathname !== '/') { navigate(`/${href}`); }
      else {
        const el = document.querySelector(href);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.pushState({}, '', href); }
      }
    } else { navigate(href); }
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
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
      onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
      onMouseLeave={handleDropdownLeave}
    >
      <div className="w-[520px] bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-zinc-200/80 dark:border-zinc-700/60 overflow-hidden">
        <div className="grid grid-cols-5">
          {/* Links column */}
          <div className="col-span-3 p-5">
            {item.columns?.map((col: any, ci: number) => (
              <div key={ci}>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-3 px-1">{col.heading}</p>
                <div className="space-y-0.5">
                  {col.links.map((link: any) => {
                    const Icon = link.icon || FileText;
                    const active = isActive(link.href);
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleNavigation(e, link.href); }}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                          active 
                            ? 'bg-red-50 dark:bg-red-950/40' 
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          active
                            ? 'bg-red-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-red-600 group-hover:text-white'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-semibold leading-tight ${active ? 'text-red-700 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                            {link.name}
                          </p>
                          {link.desc && (
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug mt-0.5 truncate">{link.desc}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Callout side panel */}
          {item.callout && (
            <div className="col-span-2 bg-zinc-50 dark:bg-zinc-800/50 p-5 flex flex-col justify-between border-l border-zinc-100 dark:border-zinc-700/50">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">{item.callout.title}</h4>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">{item.callout.desc}</p>
              </div>
              <a
                href={item.callout.href}
                onClick={(e) => { e.preventDefault(); handleNavigation(e, item.callout.href); }}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors group/cta"
              >
                {item.callout.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
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
      className="absolute top-full left-0 pt-3 z-50"
      onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
      onMouseLeave={handleDropdownLeave}
    >
      <div className="w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200/80 dark:border-zinc-700/60 p-2 space-y-0.5">
        {item.dropdown.map((link: any) => {
          const active = isActive(link.href);
          const Icon = link.icon || FileText;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavigation(e, link.href); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                active ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 text-zinc-400" />
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

      {/* ─── Header ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-white dark:bg-zinc-950 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-md'
            : 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-200/40 dark:border-zinc-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="shrink-0 relative z-10">
              <Logo />
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <nav className="hidden lg:flex items-center gap-1" ref={navRef} role="navigation" aria-label="Main">
              {navItems.map((item: any) => {
                const active = isActive(item.href);
                const hasPanel = item.megaMenu || item.dropdown;
                const isDropdownOpen = activeDropdown === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={hasPanel ? () => handleDropdownEnter(item.name) : undefined}
                    onMouseLeave={hasPanel ? handleDropdownLeave : undefined}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (hasPanel && item.href === '#') { e.preventDefault(); return; }
                        handleNavigation(e, item.href);
                      }}
                      className={`
                        relative flex items-center gap-1 px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200 rounded-lg
                        ${active
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                        }
                      `}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.name}
                      {hasPanel && (
                        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      )}

                      {/* Active underline */}
                      {active && (
                        <motion.span
                          layoutId="nav-active-line"
                          className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-red-600 dark:bg-red-500 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>

                    {/* Dropdown / Mega Panel */}
                    <AnimatePresence>
                      {isDropdownOpen && item.megaMenu && renderMegaPanel(item)}
                      {isDropdownOpen && item.dropdown && !item.megaMenu && renderSimpleDropdown(item)}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* ─── Right Actions ─── */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative h-9 w-9 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-shadow hover:shadow-md">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-red-600 text-white text-xs font-bold">
                            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl p-1.5 shadow-xl" align="end" sideOffset={8}>
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-semibold truncate">{profile?.full_name || 'My Account'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {profile?.role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg cursor-pointer gap-2 font-medium">
                          <LayoutDashboard className="h-4 w-4 text-red-600" /> Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => navigate('/student/profile')} className="rounded-lg cursor-pointer gap-2 font-medium">
                        <User className="h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="rounded-lg cursor-pointer gap-2 font-medium">
                        <Settings className="h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="rounded-lg cursor-pointer gap-2 font-medium text-red-600 focus:text-red-600">
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth?mode=login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-lg px-4"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ─── Mobile Trigger ─── */}
            <div className="lg:hidden flex items-center gap-2">
              {user && <NotificationBell />}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Overlay & Drawer ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl z-50 lg:hidden flex flex-col"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile links */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="space-y-1">
                  {navItems.map((item: any) => {
                    const active = isActive(item.href);
                    const hasChildren = item.columns || item.dropdown;
                    const isExpanded = activeDropdown === item.name;
                    const allLinks = item.columns
                      ? item.columns.flatMap((c: any) => c.links)
                      : item.dropdown || [];

                    return (
                      <div key={item.name}>
                        <a
                          href={item.href}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                            active
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                              : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                          onClick={(e) => {
                            if (hasChildren) {
                              e.preventDefault();
                              setActiveDropdown(isExpanded ? null : item.name);
                            } else {
                              handleNavigation(e, item.href);
                            }
                          }}
                        >
                          {item.name}
                          {hasChildren && (
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          )}
                        </a>

                        {/* Expandable sub-links */}
                        <AnimatePresence>
                          {hasChildren && isExpanded && allLinks.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 py-1 space-y-0.5">
                                {allLinks.map((link: any) => (
                                  <a
                                    key={link.name}
                                    href={link.href}
                                    className={`block px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                                      isActive(link.href)
                                        ? 'text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                    }`}
                                    onClick={(e) => handleNavigation(e, link.href)}
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile footer */}
              <div className="px-5 py-5 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                {!user ? (
                  <div className="space-y-2">
                    <Link to="/courses" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl h-11">
                        Explore Courses
                      </Button>
                    </Link>
                    <Link to="/auth?mode=login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full font-semibold rounded-xl h-11 mt-2">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-1 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-red-600 text-white text-sm font-bold">
                          {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{profile?.full_name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 font-semibold rounded-xl h-11"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
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
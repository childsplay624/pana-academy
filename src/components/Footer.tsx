import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FontAwesomeIcon } from "@/components/ui/FontAwesomeIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerColumns, setFooterColumns] = useState<any[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      // 1. Fetch custom dynamic pages marked for footer (excluding static pages)
      const { data: pageData } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('status', 'published')
        .eq('show_in_footer', true);
      
      const EXCLUDED_SLUGS = new Set([
        'contact', 'careers', 'consulting-services', 'rnd-services',
        'training-delivery', 'sustainability-solutions', 'global-engagements',
        'safety', 'our-journey', 'training-calendar', 'testimonials',
        'our-institute', 'about', 'home'
      ]);

      const EXCLUDED_NAMES = new Set([
        'contact us', 'contact', 'careers', 'consulting services',
        'research & development', 'research and development',
        'training delivery', 'sustainability solutions',
        'global engagements', 'safety standards & hse', 'safety standards',
        'our journey & milestones', 'our journey', 'training calendar',
        'client testimonials', 'our institute', 'about us', 'home'
      ]);

      let customLinksList: { name: string, href: string }[] = [];
      if (pageData) {
        customLinksList = pageData
          .filter(p => !EXCLUDED_SLUGS.has(p.slug))
          .map(p => ({
            name: p.title,
            href: `/p/${p.slug}`
          }));
      }

      // 2. Fetch footer layout settings
      const { data: settingData } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'footer_layout')
        .maybeSingle();

      let layout = [];
      
      if (settingData && settingData.value) {
        let parsed = settingData.value;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        layout = parsed;
      } else {
        // Fallback default layout according to official PANA Institute structure
        layout = [
          {
            id: 'col-1',
            title: 'Institute',
            links: [
              { name: "Our Journey", href: "/our-journey" },
              { name: "Leadership", href: "/team" },
              { name: "Safety", href: "/safety" },
              { name: "Careers", href: "/careers" }
            ]
          },
          {
            id: 'col-2',
            title: 'Verticals',
            links: [
              { name: "Competency Assessment and Development", href: "/training-delivery" },
              { name: "Research and Development", href: "/research-development" },
              { name: "Consulting and Advisory Services", href: "/consulting-services" },
              { name: "Sustainability Solutions and Climate Services", href: "/sustainability-solutions" },
              { name: "Global Engagements and Initiatives", href: "/global-engagements" }
            ]
          },
          {
            id: 'col-3',
            title: 'Media and Resources',
            links: [
              { name: "Media", href: "/media" },
              { name: "News", href: "/news" },
              { name: "Resources", href: "/resources" }
            ]
          }
        ];
      }

      // Ensure Media and Resources never contains the excluded static pages
      layout = layout.map((col: any) => {
        if (col.title?.toLowerCase().includes('media') || col.id === 'col-3') {
          return {
            ...col,
            links: (col.links || []).filter((l: any) => !EXCLUDED_NAMES.has(l.name?.trim().toLowerCase()))
          };
        }
        return col;
      });

      // Append any truly custom pages (non-static) to the last column if applicable
      if (customLinksList.length > 0 && layout.length > 0) {
        const lastCol = layout[layout.length - 1];
        if (lastCol) {
          lastCol.links = [
            ...lastCol.links,
            ...customLinksList
          ];
        }
      }

      setFooterColumns(layout);
    };
    
    fetchFooterData();
  }, []);

  // Mailchimp setup script
  useEffect(() => {
    const mcScript = document.createElement('script');
    mcScript.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    mcScript.type = 'text/javascript';
    mcScript.async = true;
    document.body.appendChild(mcScript);

    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.text = `(function($) { window.fnames = new Array(); window.ftypes = new Array(); fnames[0]='EMAIL';ftypes[0]='email'; }(jQuery)); var $mcj = jQuery.noConflict(true);`;
    
    setTimeout(() => { document.body.appendChild(initScript); }, 1000);

    return () => {
      if (document.body.contains(mcScript)) document.body.removeChild(mcScript);
      if (document.body.contains(initScript)) document.body.removeChild(initScript);
    };
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <div className="text-2xl font-bold mb-4">PANA <span className="text-red-600">Institute</span></div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Building the standard against which competence is measured. For the Oil and Gas, Energy and Power, and Digital Industries.
              </p>
              <div className="space-y-3">
                <a href="mailto:info@pana-institute.com" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors">
                  <FontAwesomeIcon name="fa-solid fa-envelope" className="text-red-600 text-sm flex-shrink-0" />
                  <span>info@pana-institute.com</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:col-span-3">
              {footerColumns.map((col, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-6 underline decoration-red-600 underline-offset-8">
                    {col.title}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((link: any, i: number) => (
                      <li key={i}>
                        <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
                <p className="text-gray-400">Subscribe to our newsletter for the latest insights and industry news.</p>
              </div>
              <form action="https://pana-academy.us5.list-manage.com/subscribe/post?u=c3b793e3a53abf91535915fb2&id=6cd696a57a&f_id=00e532e0f0" method="post" className="flex gap-2">
                <input type="email" name="EMAIL" className="flex-grow px-3 py-2 bg-gray-900 border border-gray-800 rounded focus:border-red-600 outline-none" placeholder="Email address" required />
                <button type="submit" className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">© {currentYear} PANA Institute. All rights reserved.</div>
          <div className="flex space-x-4">
            {[
              { name: "fa-brands fa-linkedin-in", href: "https://www.linkedin.com/company/pana-academy/" },
              { name: "fa-brands fa-facebook-f", href: "https://www.facebook.com/profile.php?id=61555861660075" },
              { name: "fa-brands fa-instagram", href: "https://www.instagram.com/pana_academy/" }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-white text-xs">
                <FontAwesomeIcon name={social.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
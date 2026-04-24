import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [customLinks, setCustomLinks] = useState<{ name: string, href: string }[]>([]);

  useEffect(() => {
    const fetchFooterPages = async () => {
      const { data } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('status', 'published')
        .eq('show_in_footer', true);
      
      if (data) {
        setCustomLinks(data.map(p => ({
          name: p.title,
          href: `/p/${p.slug}`
        })));
      }
    };
    fetchFooterPages();
  }, []);

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Leadership Team", href: "/team" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Certificate Verification", href: "/verify-certificate" },
      { name: "Careers", href: "/careers" }
    ],
    services: [
      { name: "Training Programs", href: "/training-delivery" },
      { name: "Consulting", href: "/consulting-services" },
      { name: "Research & Development", href: "/research-development" }
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Support Center", href: "/support" },
      ...customLinks
    ]
  };

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
              <div className="text-2xl font-bold mb-4">PANA <span className="text-red-600">Academy</span></div>
              <p className="text-gray-400 mb-6 leading-relaxed">Empowering talent across sectors through world-class training, consulting, and research excellence.</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm"><Phone className="w-4 h-4 text-red-600" /><span>+234 702 600 0119</span></div>
                <div className="flex items-center space-x-3 text-sm"><Mail className="w-4 h-4 text-red-600" /><span>info@pana-academy.com</span></div>
                <div className="flex items-center space-x-3 text-sm"><MapPin className="w-4 h-4 text-red-600" /><span>Abuja & Port Harcourt</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:col-span-3">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 underline decoration-red-600 underline-offset-8">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, i) => (
                    <li key={i}><a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 underline decoration-red-600 underline-offset-8">Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link, i) => (
                    <li key={i}><a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 underline decoration-red-600 underline-offset-8">Quick Links</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, i) => (
                    <li key={i}><a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</a></li>
                  ))}
                </ul>
              </div>
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
          <div className="text-xs text-gray-500">© {currentYear} PANA Academy. All rights reserved.</div>
          <div className="flex space-x-4">
            {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"><Icon className="w-4 h-4" /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/#about" },
      { name: "Our Mission", href: "/#mission" },
      { name: "Leadership Team", href: "/team" },
      { name: "Careers", href: "/careers" }
    ],
    services: [
      { name: "Training Programs", href: "/training-delivery" },
      { name: "Consulting", href: "/consulting-services" },
      { name: "Research & Development", href: "/research-development" },
      { name: "Corporate Solutions", href: "/corporate-solutions" }
    ],
    programs: [
      { name: "Energy Sector", href: "/courses?category=energy" },
      { name: "Digital Transformation", href: "/courses?category=digital-transformation" },
      { name: "Leadership Development", href: "/courses?category=leadership" },
      { name: "Technical Excellence", href: "/courses?category=technical" }
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Support Center", href: "/support" },
      { name: "Privacy Policy", href: "/privacy-policy" }
    ]
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="text-2xl font-bold mb-4">
                PANA <span className="text-pana-gold">Academy</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering talent across sectors through world-class training, consulting, and research excellence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-pana-gold" />
                  <span className="text-sm">+234 809 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-pana-gold" />
                  <span className="text-sm">info@panaacademy.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-pana-gold" />
                  <span className="text-sm">Abuja & Port Harcourt</span>
                </div>
                <div className="pt-4">
                  <div className="flex space-x-4">
                    <a href="https://www.instagram.com/pana_academy/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pana-gold transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://www.linkedin.com/company/pana-academy/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pana-gold transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61555861660075" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pana-gold transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:col-span-3">
              <div>
                <h4 className="font-semibold text-lg mb-4 text-pana-gold">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4 text-pana-gold">Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4 text-pana-gold">Programs</h4>
                <ul className="space-y-3">
                  {footerLinks.programs.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-pana-gold">Stay Updated</h4>
                <p className="text-gray-300">
                  Subscribe to our newsletter for the latest insights, training updates, and industry news.
                </p>
              </div>
              <div className="flex space-x-3">
                <Input 
                  placeholder="Enter your email address" 
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button variant="default" className="bg-red-600 hover:bg-red-700">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} PANA Academy. Designed by WCC Studios. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold hover:bg-pana-gold hover:text-pana-navy transition-colors duration-200"
                >
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
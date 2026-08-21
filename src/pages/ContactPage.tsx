import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const ContactPage = () => {
  const { toast } = useToast();
  const { get } = usePageContent('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // UNIFIED PROCESS: One call handles both DB saving and Email sending
      const { data, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        headers: {
          'x-pana-signature': import.meta.env.VITE_PANA_SIGNATURE || '',
        },
        body: formData
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Message sent successfully!",
        description: "We've received your inquiry and will get back to you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error Sending Message",
        description: error.message || "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | PANA Institute - Get in Touch</title>
        <meta name="description" content="Contact PANA Institute for inquiries, support, or partnership opportunities. We're here to help you with your learning and development needs." />
        <meta name="keywords" content="contact PANA Institute, support, inquiries, partnership, get in touch" />
      </Helmet>

      <div className="min-h-screen bg-paper text-ink">
        <Navigation />

        <main>
          {/* Hero Section with Frontpage Editorial Styling */}
          <section className="relative pt-36 pb-24 bg-ink text-paper border-b border-line overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-7 relative z-10">
              <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
                GET IN TOUCH · PANA INSTITUTE ADVISORY
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-paper mb-6">
                {get('hero_title', 'Contact Us')}
              </h1>
              <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
                {get('hero_subtitle', "Connect with our principal officers, competency assessors, or admissions directors across our Port Harcourt and Abuja hubs.")}
              </p>
            </div>
          </section>

          {/* Contact Information & Office Locations */}
          <section className="py-24 bg-paper">
            <div className="max-w-[1320px] mx-auto px-7">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                    INSTITUTIONAL BASE & CENTRES
                  </span>
                  <h2 className="font-serif text-4xl font-medium text-ink mb-10">Our Campus Offices</h2>

                  <div className="space-y-6">
                    {/* Port Harcourt - Center of Excellence */}
                    <div className="bg-paper-soft p-7 border border-line rounded-xs flex items-start gap-5 hover:border-oxblood/40 transition-colors">
                      <div className="p-3 bg-oxblood text-white rounded-xs flex-shrink-0 mt-1">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-1">R&D & LIVE SIMULATORS</span>
                        <h3 className="font-serif text-xl font-medium text-ink mb-2">Port Harcourt - Center of Excellence</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-serif">{get('address_ph_coe', 'Plot 94 Rivoc Road, Trans Amadi Industrial Layout')}</p>
                        <p className="text-xs text-muted-foreground font-serif">Port Harcourt, Rivers State, Nigeria</p>
                      </div>
                    </div>

                    {/* Port Harcourt - D-Line Office */}
                    <div className="bg-paper-soft p-7 border border-line rounded-xs flex items-start gap-5 hover:border-oxblood/40 transition-colors">
                      <div className="p-3 bg-oxblood text-white rounded-xs flex-shrink-0 mt-1">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-1">ADMINISTRATION & ASSESSMENT</span>
                        <h3 className="font-serif text-xl font-medium text-ink mb-2">Port Harcourt - D-Line Office</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-serif">{get('address_ph_dline', 'No 54 Emekuku Street, D-Line')}</p>
                        <p className="text-xs text-muted-foreground font-serif">Port Harcourt, Rivers State, Nigeria</p>
                      </div>
                    </div>

                    {/* Abuja Office */}
                    <div className="bg-paper-soft p-7 border border-line rounded-xs flex items-start gap-5 hover:border-oxblood/40 transition-colors">
                      <div className="p-3 bg-oxblood text-white rounded-xs flex-shrink-0 mt-1">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-1">EXECUTIVE & GLOBAL POLICY HUB</span>
                        <h3 className="font-serif text-xl font-medium text-ink mb-2">Abuja Executive Hub</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-serif">{get('address_abuja', 'No. 5 Vattern Street, off Amazon Street')}</p>
                        <p className="text-xs text-muted-foreground font-serif">Maitama, Abuja, FCT, Nigeria</p>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="pt-6 border-t border-line space-y-4">
                      <div className="bg-paper-soft p-7 border border-line rounded-xs flex items-start gap-5">
                        <div className="p-3 bg-oxblood text-white rounded-xs flex-shrink-0 mt-1">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-1">DIRECT TELEPHONE LINES</span>
                          <h3 className="font-serif text-xl font-medium text-ink mb-1">Phone Enquiries</h3>
                          <p className="text-xs text-muted-foreground font-mono">{get('phone', 'Port Harcourt: +234 702 600 0116 | Abuja: +234 702 600 0119')}</p>
                        </div>
                      </div>

                      <div className="bg-paper-soft p-7 border border-line rounded-xs flex items-start gap-5">
                        <div className="p-3 bg-oxblood text-white rounded-xs flex-shrink-0 mt-1">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-1">ELECTRONIC CORRESPONDENCE</span>
                          <h3 className="font-serif text-xl font-medium text-ink mb-1">Official Email</h3>
                          <p className="text-xs text-muted-foreground font-mono">{get('email', 'info@pana-institute.com')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollReveal direction="up" delay={0.2} className="w-full">
                  <div className="bg-paper-soft p-8 md:p-10 rounded-none border border-line shadow-xs">
                    <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-2">
                      CORRESPONDENCE FORM
                    </span>
                    <h2 className="font-serif text-3xl font-medium text-ink mb-6">Send Us an Official Inquiry</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-2">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-paper border border-line rounded-none focus:outline-none focus:border-oxblood font-serif text-sm"
                            placeholder="Your full name"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-2">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-paper border border-line rounded-none focus:outline-none focus:border-oxblood font-serif text-sm"
                            placeholder="your.email@organization.com"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-2">Subject / Mandate Category</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-paper border border-line rounded-none focus:outline-none focus:border-oxblood font-serif text-sm"
                          placeholder="e.g. Executive Assessment, Training Program, Consultancy"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink mb-2">Inquiry Details</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-paper border border-line rounded-none focus:outline-none focus:border-oxblood font-serif text-sm"
                          placeholder="Type your official inquiry details here..."
                          required
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <div>
                        <Button
                          type="submit"
                          className="w-full bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest py-4 rounded-none font-semibold border border-oxblood-light shadow-md"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Transmitting Inquiry...' : 'Submit Official Inquiry'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="h-96 bg-gray-100">
            <div className="h-full w-full">
              <iframe
                src="https://maps.google.com/maps?q=4.815760,7.035122&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="PANA Institute Location - Port Harcourt"
              ></iframe>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;

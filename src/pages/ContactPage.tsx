import { useState } from "react";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";

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
      <SEO
        title="Contact Us | PANA Institute - Port Harcourt & Abuja"
        description="Contact PANA Institute for admissions, corporate technical training partnerships, consulting, and workforce development inquiries in Port Harcourt and Abuja."
        canonical="/contact"
      />

      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <span className="text-red-500 font-bold text-xs uppercase tracking-wider block mb-3">{get('hero_badge', 'PANA Institute Contact')}</span>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{get('hero_title', 'Contact Us')}</h1>
              <p className="text-2xl md:text-3xl font-semibold text-red-500 mb-6">
                {get('hero_subtitle', 'Let us build the standard together.')}
              </p>
              <p className="text-lg md:text-xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
                {get('hero_description', 'For programmes, assessment, research, advisory or partnership, reach the Institute at info@pana-institute.com or through the offices below.')}
              </p>
            </div>
          </section>

          {/* Contact Information & Office Locations */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <div className="mb-8">
                    <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">{get('offices_badge', 'Global Operations')}</span>
                    <h2 className="text-3xl font-bold text-pana-navy">{get('offices_heading', 'Our Offices & Hubs')}</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    {/* Port Harcourt */}
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-red-600 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rivers State</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Port Harcourt · Centre of Excellence</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {get('address_ph', 'Plot 94 Rivoc Road, Trans Amadi Industrial Layout, Port Harcourt.')}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 pt-2 border-t border-gray-200">
                        Tel: <a href={`tel:${get('phone_ph', '+234 702 600 0116')}`} className="text-red-600 hover:underline">{get('phone_ph', '+234 702 600 0116')}</a>
                      </div>
                    </div>

                    {/* Abuja */}
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-blue-600 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Federal Capital Territory</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Abuja</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {get('address_abuja', 'No. 5 Vattern Street, off Amazon Street, Maitama, Abuja.')}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 pt-2 border-t border-gray-200">
                        Tel: <a href={`tel:${get('phone_abuja', '+234 702 600 0119')}`} className="text-red-600 hover:underline">{get('phone_abuja', '+234 702 600 0119')}</a>
                      </div>
                    </div>

                    {/* Kampala */}
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-emerald-600 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Uganda</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Kampala</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {get('address_kampala', 'C/O Cristal Advocates, 4th Floor, Padre Pio House, Plot 32 Lumumba Avenue, Kampala.')}
                        </p>
                      </div>
                    </div>

                    {/* Dubai */}
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-amber-500 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">United Arab Emirates</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Dubai</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {get('address_dubai', 'Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* General Enquiries Banner */}
                  <div className="p-6 bg-red-50 rounded-2xl border-l-4 border-red-600">
                    <h4 className="text-base font-bold text-red-950 mb-1">Central Direct Contact</h4>
                    <p className="text-sm text-red-900">
                      Email: <a href={`mailto:${get('email', 'info@pana-institute.com')}`} className="font-bold underline">{get('email', 'info@pana-institute.com')}</a>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-pana-navy mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Your name"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="your.email@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="How can we help you?"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Type your message here..."
                        required
                        disabled={isSubmitting}
                      ></textarea>
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </div>
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

          {/* Dynamic Page Builder Sections */}
          <DynamicPageSections slug="contact" />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;

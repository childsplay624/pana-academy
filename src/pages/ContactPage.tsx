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

      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-pana-navy text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{get('hero_title', 'Contact Us')}</h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                {get('hero_subtitle', "We'd love to hear from you. Reach out to us with any questions or inquiries.")}
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-pana-navy mb-8">Our Offices</h2>

                  <div className="space-y-8">
                    {/* Port Harcourt - Center of Excellence */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                        <MapPin className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Port Harcourt - Center of Excellence</h3>
                        <p className="text-gray-600">{get('address_ph_coe', 'Plot 94 Rivoc Road, Trans Amadi Industrial Layout')}</p>
                        <p className="text-gray-600">Port Harcourt, Rivers State, Nigeria</p>
                      </div>
                    </div>

                    {/* Port Harcourt - D-Line Office */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                        <MapPin className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Port Harcourt - D-Line Office</h3>
                        <p className="text-gray-600">{get('address_ph_dline', 'No 54 Emekuku Street, D-Line')}</p>
                        <p className="text-gray-600">Port Harcourt, Rivers State, Nigeria</p>
                      </div>
                    </div>

                    {/* Abuja Office */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                        <MapPin className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Abuja Office</h3>
                        <p className="text-gray-600">{get('address_abuja', 'No. 5 Vattern Street, off Amazon Street')}</p>
                        <p className="text-gray-600">Maitama, Abuja, FCT, Nigeria</p>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                            <Phone className="h-6 w-6 text-pana-navy" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                            <p className="text-gray-600">{get('phone', 'Port Harcourt: +234 702 600 0116 | Abuja: +234 702 600 0119 | Mobile: 08032790852')}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                            <Mail className="h-6 w-6 text-pana-navy" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-600">{get('email', 'Info@pana-academy.com')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ContactPage = () => {
  const { toast } = useToast();
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
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        headers: {
          'x-pana-signature': import.meta.env.VITE_PANA_SIGNATURE,
        },
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | PANA Academy - Get in Touch</title>
        <meta name="description" content="Contact PANA Academy for inquiries, support, or partnership opportunities. We're here to help you with your learning and development needs." />
        <meta name="keywords" content="contact PANA Academy, support, inquiries, partnership, get in touch" />
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-pana-navy text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                We'd love to hear from you. Reach out to us with any questions or inquiries.
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
                        <p className="text-gray-600">Plot 94 Rivoc Road, Trans Amadi Industrial Layout</p>
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
                        <p className="text-gray-600">No 54 Emekuku Street, D-Line</p>
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
                        <p className="text-gray-600">No. 5 Vattern Street, off Amazon Street</p>
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
                            <p className="text-gray-600">Port Harcourt: +234 702 600 0116</p>
                            <p className="text-gray-600">Abuja: +234 702 600 0119</p>
                            <p className="text-gray-600">Mobile: 08032790852</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-pana-gold/10 rounded-full flex-shrink-0">
                            <Mail className="h-6 w-6 text-pana-navy" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-600">Info@pana-academy.com</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5827738087896!2d7.0098!3d4.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d2b7e1e1e1e1%3A0x1e1e1e1e1e1e1e1e!2sPort%20Harcourt%2C%20Rivers%20State%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="PANA Academy Location - Port Harcourt"
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

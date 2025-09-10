import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContactPage = () => {
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
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
                  <h2 className="text-3xl font-bold text-pana-navy mb-8">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full">
                        <Mail className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                        <p className="text-gray-600">info@panaacademy.com</p>
                        <p className="text-gray-600">support@panaacademy.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full">
                        <Phone className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                        <p className="text-gray-600">Mon - Fri, 9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pana-gold/10 rounded-full">
                        <MapPin className="h-6 w-6 text-pana-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Visit Us</h3>
                        <p className="text-gray-600">123 Learning Street</p>
                        <p className="text-gray-600">Lagos, Nigeria</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-pana-navy mb-6">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pana-gold focus:border-pana-gold"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pana-gold focus:border-pana-gold"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pana-gold focus:border-pana-gold"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pana-gold focus:border-pana-gold"
                        placeholder="Type your message here..."
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <Button type="submit" className="w-full bg-pana-gold hover:bg-pana-gold/90 text-pana-navy py-6 text-lg font-semibold">
                        Send Message
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.521260322283!2d3.3792954147708746!3d6.52463132402512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e4a4c0f3a4e3d!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="PANA Academy Location"
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

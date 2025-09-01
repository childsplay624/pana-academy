import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const ContactSection = () => {
  const offices = [
    {
      city: "Abuja (Headquarters)",
      address: "Plot 123, Central Business District, Abuja, Nigeria",
      phone: "+234 809 123 4567",
      email: "abuja@panaacademy.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM"
    },
    {
      city: "Port Harcourt",
      address: "15 Trans Amadi Industrial Layout, Port Harcourt, Nigeria", 
      phone: "+234 808 765 4321",
      email: "phc@panaacademy.com",
      hours: "Mon - Fri: 8:00 AM - 6:00 PM"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3.6xl md:text-4.8xl font-bold text-pana-navy mb-4">Get in Touch</h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your career or organization? Contact us to discuss your training and development needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2.4xl text-pana-navy">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-base font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <Input id="firstName" placeholder="Enter your first name" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-base font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <Input id="lastName" placeholder="Enter your last name" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-base font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-base font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-base font-medium text-foreground mb-2">
                    Company/Organization
                  </label>
                  <Input id="company" placeholder="Enter your company name" />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-base font-medium text-foreground mb-2">
                    Area of Interest
                  </label>
                  <select 
                    id="interest" 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select an area of interest</option>
                    <option value="training">Training Programs</option>
                    <option value="consulting">Consulting Services</option>
                    <option value="research">Research & Development</option>
                    <option value="custom">Custom Solutions</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-base font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your requirements, questions, or how we can help you..."
                    rows={6}
                    required 
                  />
                </div>

                <Button 
                  className="w-full bg-black text-white hover:bg-red-600 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Locations */}
            {offices.map((office, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl text-pana-navy flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-pana-gold" />
                    {office.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <p className="text-base text-foreground">{office.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-base text-foreground">{office.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-base text-foreground">{office.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="text-base text-foreground">{office.hours}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Contact */}
            <Card className="shadow-lg border-0 bg-black text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-pana-gold" />
                    <p className="text-base">+234 809 123 4567</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-pana-gold" />
                    <p className="text-base">info@panaacademy.com</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-red-600 text-white hover:bg-white hover:text-red-600 transition-colors">
                  Schedule Call
                </Button>
              </CardContent>
            </Card>

            {/* Social Media */}
           
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12">
          <Card className="shadow-lg border-0">
            <CardContent className="p-0">
              <div className="h-64 bg-black/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-pana-gold mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Interactive map will be integrated here</p>
                  <p className="text-base text-muted-foreground">Showing our office locations in Abuja and Port Harcourt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, CheckCircle, Users, Globe, BookOpen, ChevronRight } from "lucide-react";
import trainingImage from "@/assets/pana.jpg";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const highlights = [
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Industry veterans and academic leaders"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Training professionals across Africa and beyond"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Programs",
      description: "From technical skills to leadership development"
    }
  ];

  return (
    <section id="about" className="py-20 bg-pana-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">About PANA Academy</h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Dedicated to empowering talent across sectors through world-class training, consulting, and research excellence.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Image */}
          <div className="relative">
            <img 
              src={trainingImage} 
              alt="Professional Training at PANA Academy" 
              className="rounded-2xl shadow-lg w-full h-[40rem] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pana-navy/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-pana-navy mb-4">Our Mission</h3>
              <p className="text-foreground leading-relaxed">
                To empower individuals and organizations with the knowledge, skills, and capabilities needed to excel in today's dynamic business environment. We bridge the gap between theoretical knowledge and practical application through innovative training methodologies.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pana-navy mb-4">Our Vision</h3>
              <p className="text-foreground leading-relaxed">
                To be the leading academy for professional development across Africa, recognized globally for excellence in training, consulting, and research that transforms careers and organizations.
              </p>
              
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pana-gold/10 rounded-lg flex items-center justify-center">
                    <highlight.icon className="w-6 h-6 text-pana-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-pana-navy">{highlight.title}</h4>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              ))}
              <div className="mt-8">
                <Link to="/courses">
                  <Button 
                    variant="default"
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white"
                  >
                    Learn more about our programs
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>               
      </div>
    </section>
  );
};

export default AboutSection;
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, CheckCircle, Users, Globe, BookOpen, ChevronRight } from "lucide-react";
import panaBuilding from "@/assets/pana-building.jpg";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const coreValues = [
    {
      category: "3Ts of Excellence",
      values: [
        { name: "Trust", description: "Building lasting relationships through integrity" },
        { name: "Time", description: "Delivering value on schedule, every time" },
        { name: "Transparency", description: "Clear communication and honest practices" }
      ]
    },
    {
      category: "3Cs of Excellence", 
      values: [
        { name: "Character", description: "Ethical leadership and moral excellence" },
        { name: "Capacity", description: "Continuous learning and skill development" },
        { name: "Commitment", description: "Dedication to excellence and results" }
      ]
    }
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-pana-navy mb-4">About PANA Academy</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to empowering talent across sectors through world-class training, consulting, and research excellence.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Image */}
          <div className="relative">
            <img 
              src={panaBuilding} 
              alt="PANA Academy Building" 
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
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
                <Button 
                  variant="default"
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white"
                >
                  Learn more about our programs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-pana-navy mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold text-pana-navy mb-6 text-center">{category.category}</h4>
                  <div className="space-y-4">
                    {category.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-pana-gold mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-pana-navy">{value.name}</h5>
                          <p className="text-muted-foreground text-sm">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default AboutSection;
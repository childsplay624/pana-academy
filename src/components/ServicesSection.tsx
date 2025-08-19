import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Users, 
  Search, 
  Zap, 
  Settings, 
  TrendingUp, 
  ArrowRight,
  BookOpen,
  Target,
  Lightbulb
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Training Programs",
      description: "Comprehensive training across multiple sectors designed to elevate professional capabilities.",
      categories: [
        { name: "Energy Sector", programs: "Oil & Gas, Renewable Energy, Technical Operations" },
        { name: "Digital Transformation", programs: "Digital Leadership, Tech Innovation, Data Analytics" },
        { name: "Technical Excellence", programs: "Engineering, Project Management, Quality Assurance" },
        { name: "Leadership Development", programs: "Executive Leadership, Team Management, Strategic Planning" },
        { name: "Specialized Programs", programs: "Industry-specific certifications and skills" }
      ],
      gradient: "from-pana-navy to-pana-blue"
    },
    {
      icon: Users,
      title: "Consulting Services",
      description: "Strategic consulting to transform organizations and optimize performance.",
      categories: [
        { name: "Organizational Development", programs: "Change Management, Culture Transformation" },
        { name: "Process Optimization", programs: "Workflow Analysis, Efficiency Improvement" },
        { name: "Digital Strategy", programs: "Technology Roadmaps, Digital Adoption" },
        { name: "Leadership Coaching", programs: "Executive Coaching, Mentorship Programs" },
        { name: "Custom Solutions", programs: "Tailored consulting for specific needs" }
      ],
      gradient: "from-pana-blue to-pana-gold"
    },
    {
      icon: Search,
      title: "Research & Development",
      description: "Cutting-edge research to drive innovation and industry advancement.",
      categories: [
        { name: "Industry Research", programs: "Market Analysis, Trend Forecasting" },
        { name: "Training Methodology", programs: "Learning Innovation, Pedagogy Research" },
        { name: "Technology Integration", programs: "EdTech Solutions, AI in Learning" },
        { name: "Sector Studies", programs: "Energy, Digital, Leadership Research" },
        { name: "Publications", programs: "White Papers, Case Studies, Reports" }
      ],
      gradient: "from-pana-gold to-accent"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Accelerated Learning",
      description: "Fast-track programs designed for busy professionals"
    },
    {
      icon: Target,
      title: "Targeted Solutions", 
      description: "Customized training for specific industry needs"
    },
    {
      icon: BookOpen,
      title: "Blended Approach",
      description: "Online, offline, and hybrid learning options"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Latest methodologies and cutting-edge content"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-pana-navy mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive solutions designed to transform careers and organizations through excellence in training, consulting, and research.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex w-16 h-16 items-center justify-center rounded-full bg-gradient-to-r ${service.gradient} text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl text-pana-navy">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{service.description}</p>
                
                <div className="space-y-3">
                  {service.categories.map((category, catIndex) => (
                    <div key={catIndex} className="border-l-2 border-pana-gold/30 pl-4">
                      <h4 className="font-semibold text-pana-navy text-sm">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">{category.programs}</p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full group">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Features */}
        <div className="bg-pana-light-gray rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center text-pana-navy mb-12">Why Choose Our Services</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex w-12 h-12 items-center justify-center rounded-lg bg-pana-gold/10 text-pana-gold mb-4 group-hover:bg-pana-gold group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-pana-navy mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-pana-navy mb-4">Ready to Transform Your Organization?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get in touch with our experts to discuss how PANA Academy can help you achieve your training and development goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg">
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@/components/ui/FontAwesomeIcon";

const ServicesSection = () => {
  const verticals = [
    {
      title: "Competency Assessment & Development",
      description: "Capability development hub delivering training, leadership development and practical skills on live equipment, judging competence on evidence alone.",
      href: "/training-delivery",
      icon: "fa-solid fa-book-open",
      topBorder: "border-t-red-600",
      highlights: [
        { name: "Capability Development", text: "Tailored, product-specific & NCDMB stipulated HCD programmes." },
        { name: "Port Harcourt Workshop & Labs", text: "Hands-on instruction across power, valves, flow measurement & SCADA." },
        { name: "Evidence-Based Assessment", text: "Independent competence judgment built strictly on operational proof." }
      ]
    },
    {
      title: "Research & Development",
      description: "Five Centres of Excellence supplying subject authority, driving revenue in partnership-led mode, and keeping training current.",
      href: "/research-development",
      icon: "fa-solid fa-bolt",
      topBorder: "border-t-amber-500",
      highlights: [
        { name: "5 Centres of Excellence", text: "Oil & Gas Tech, Sustainability, Energy & Power, Digital & AI, Smart Agriculture." },
        { name: "Operating Charter", text: "Standing advisory panel, 3-year research agenda & testbed labs." },
        { name: "Flagship Publications", text: "Competence frameworks & annual industry research publications." }
      ]
    },
    {
      title: "Consultancy & Advisory",
      description: "Technical advisory and consulting for industry and government clients, built on the same evidence and frameworks used to assess people.",
      href: "/consulting-services",
      icon: "fa-solid fa-layer-group",
      topBorder: "border-t-blue-600",
      highlights: [
        { name: "Workforce & Capability", text: "Long-term workforce planning & operational self-sufficiency." },
        { name: "Operating Model Design", text: "Operating model transformation for enterprises & institutions." },
        { name: "Technology Adoption", text: "Choosing and embedding technology with training strategy." }
      ]
    },
    {
      title: "Sustainability & Climate Services",
      description: "Driving value through decarbonisation, ESG and green innovation. A move from compliance to execution, delivering measurable value.",
      href: "/sustainability-solutions",
      icon: "fa-solid fa-globe",
      topBorder: "border-t-emerald-600",
      highlights: [
        { name: "Decarbonisation Solutions", text: "Scope 1, 2, 3 carbon footprint, Net Zero roadmaps & CCUS." },
        { name: "ESG Advisory", text: "ISSB, GRI & TCFD disclosure frameworks & investor readiness." },
        { name: "SustainaCore Platform", text: "Unified digital OS for carbon accounting & emissions data." }
      ]
    },
    {
      title: "Global Engagements & Initiatives",
      description: "Connecting African industrial talent, technical labs, and energy assets with international consortia and global accreditation bodies.",
      href: "/global-engagements",
      icon: "fa-solid fa-earth-americas",
      topBorder: "border-t-purple-600",
      highlights: [
        { name: "International Consortia", text: "Joint capacity building & tech transfer across Africa & Middle East." },
        { name: "Competency Alignment", text: "Harmonizing regional skills with international standards." },
        { name: "Global Hubs Network", text: "Operating bases across Port Harcourt, Abuja, Kampala & Dubai." }
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-600 font-bold text-xs tracking-wider block mb-2">PANA institute Architecture</span>
          <h2 className="text-4xl font-bold text-pana-navy mb-4">Our Five Operating Verticals</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Comprehensive solutions and services designed to transform careers, enterprises, and institutions through evidence-based training, 5 R&D centres of excellence, strategic advisory, climate technology, and global engagements.
          </p>
        </div>

        {/* 5 Verticals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {verticals.map((vertical, index) => {
            return (
              <Card key={index} className={`border border-gray-200 ${vertical.topBorder} border-t-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white rounded-2xl`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-end mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center border border-gray-100 text-lg">
                      <FontAwesomeIcon name={vertical.icon} className="text-red-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 leading-snug">{vertical.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed">{vertical.description}</p>

                  <div className="space-y-3 pt-2">
                    {vertical.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="border-l-2 border-red-600/40 pl-3">
                        <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-auto">
                    <a href={vertical.href} className="w-full block no-underline">
                      <Button className="w-full bg-zinc-900 hover:bg-red-600 text-white font-semibold group transition-colors flex items-center justify-center gap-2">
                        <span>Read More</span>
                        <FontAwesomeIcon name="fa-solid fa-arrow-right" className="text-xs group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-950 text-white rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Partner With PANA Institute?</h3>
          <p className="text-zinc-300 max-w-2xl mx-auto text-base mb-8 leading-relaxed">
            Get in touch to discuss custom workforce training, R&D partnership, operating model advisory, or decarbonisation roadmap deployment.
          </p>
          <div className="flex justify-center">
            <a href="/contact" className="no-underline">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6">
                Schedule Consultation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
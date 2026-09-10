import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, Lightbulb, BarChart2, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { Card3D } from "@/components/ui/Card3D";

const ConsultingServicesPage = () => {
  // Fetch header image from centralized system
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_consultancy');
  const { get } = usePageContent('consulting-services');
  const headerImage = get('header_image') || defaultHeaderImage;

  return (
    <>
      <Helmet>
        <title>Consulting Services | PANA Institute</title>
        <meta name="description" content="Professional consulting services for oil & gas, power, and technology industries. Expert guidance from seasoned industry professionals." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-grow">
          {/* Page Header */}
          <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="Consulting Services"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-red"></div>
              )}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Subtle animated elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pana-gold/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  <span>Consultancy and Advisory</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                  Consultancy <span className="text-red-600">& Advisory</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  Technical advisory and consulting for industry and government clients, built on the same competence frameworks and evidence the Institute uses to assess people.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <a href="#what-we-deliver" className="no-underline">
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                      What We Deliver
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                  <a href="#how-we-work" className="no-underline">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                      How We Work
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section: What We Deliver */}
          <section id="what-we-deliver" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Consultancy & Advisory</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Deliver</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Tailored technical advisory solutions built on evidence-based competence frameworks:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 01 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-red-600 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 translate-z-10">Service Area 01</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 translate-z-10">Workforce and capability development</h3>
                    <p className="text-gray-600 text-base leading-relaxed translate-z-10">
                      Long term workforce planning and building the operational capability a client needs to run its own assets and facilities independently.
                    </p>
                  </div>
                </Card3D>

                {/* 02 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(37, 99, 235, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-blue-600 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 translate-z-10">Service Area 02</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 translate-z-10">Organisational and operating model design</h3>
                    <p className="text-gray-600 text-base leading-relaxed translate-z-10">
                      Operating model transformation for capital projects, public sector institutions, and major industrial enterprises.
                    </p>
                  </div>
                </Card3D>

                {/* 03 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(147, 51, 234, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-purple-600 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 translate-z-10">Service Area 03</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 translate-z-10">Technology adoption and training strategy</h3>
                    <p className="text-gray-600 text-base leading-relaxed translate-z-10">
                      Choosing, adopting and embedding advanced technology solutions, alongside the structured training strategy required to make adoption stick.
                    </p>
                  </div>
                </Card3D>

                {/* 04 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(16, 185, 129, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-emerald-600 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 translate-z-10">Service Area 04</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 translate-z-10">Tailored advisory</h3>
                    <p className="text-gray-600 text-base leading-relaxed translate-z-10">
                      Custom technical advisory shaped specifically around client operational challenges rather than forced into a fixed off-the-shelf template.
                    </p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Section: How We Work & 5 Pillars */}
          <section id="how-we-work" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Our Operating Model</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
                <p className="text-lg text-gray-700 leading-relaxed font-medium bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                  "Evidence from advisory work and research returns to the competence frameworks and the assessment instruments, so the advice and the standards stay in step."
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card3D intensity={12} depth={15}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-3d-glass hover:border-red-500 transition-colors h-full preserve-3d">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold translate-z-10">01</div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 translate-z-10">Personalised approach</h4>
                    <p className="text-xs text-gray-500 translate-z-10">Shaped to exact client operational context.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-3d-glass hover:border-blue-500 transition-colors h-full preserve-3d">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold translate-z-10">02</div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 translate-z-10">Product expertise</h4>
                    <p className="text-xs text-gray-500 translate-z-10">Deep domain & OEM technical mastery.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-3d-glass hover:border-amber-500 transition-colors h-full preserve-3d">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold translate-z-10">03</div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 translate-z-10">Experienced professionals</h4>
                    <p className="text-xs text-gray-500 translate-z-10">Led by practitioners who run the jobs.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-3d-glass hover:border-emerald-500 transition-colors h-full preserve-3d">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold translate-z-10">04</div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 translate-z-10">Preventive options</h4>
                    <p className="text-xs text-gray-500 translate-z-10">De-risking operational failures ahead of time.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-3d-glass hover:border-purple-500 transition-colors h-full preserve-3d">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold translate-z-10">05</div>
                    <h4 className="font-bold text-gray-900 text-base mb-1 translate-z-10">Proactive advice</h4>
                    <p className="text-xs text-gray-500 translate-z-10">Forward-looking strategic insights.</p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Section: Institutional Credentials & Certifications Grid */}
          <section className="py-20 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-2">Accreditation & Standing</span>
                <h2 className="text-4xl font-bold mb-4">Certified & Audited Excellence</h2>
                <p className="text-zinc-300 text-lg">
                  Backed by recognized industry certifications and independent financial audit:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 22 Major Categories */}
                <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 text-center">
                  <div className="text-5xl font-black text-red-500 mb-2">22</div>
                  <h3 className="text-lg font-bold mb-2">Major Category Certifications</h3>
                  <p className="text-zinc-400 text-xs">Recognized across national and international regulatory bodies.</p>
                </div>

                {/* 52 NIPEX Codes */}
                <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 text-center">
                  <div className="text-5xl font-black text-amber-400 mb-2">52</div>
                  <h3 className="text-lg font-bold mb-2">NIPEX Codes</h3>
                  <p className="text-zinc-400 text-xs">Registered across upstream, midstream, and technical services.</p>
                </div>

                {/* ISO 9001 */}
                <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">ISO 9001</div>
                  <h3 className="text-lg font-bold mb-2">Quality Management</h3>
                  <p className="text-zinc-400 text-xs">Certified quality management system for operational consistency.</p>
                </div>

                {/* PwC */}
                <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 text-center">
                  <div className="text-4xl font-black text-emerald-400 mb-2">PwC</div>
                  <h3 className="text-lg font-bold mb-2">Audited Accounts</h3>
                  <p className="text-zinc-400 text-xs">Financial statements audited by PricewaterhouseCoopers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-zinc-950 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Schedule a Technical Advisory Engagement</h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
                Speak with our consultancy team to assess workforce capability, operating models, or technology adoption.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" className="no-underline">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                    Schedule Consultation
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href="mailto:info@pana-institute.com" className="no-underline">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                    Contact Advisory Desk
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConsultingServicesPage;

import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, ShieldCheck, Cpu, Globe, Database, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { Card3D } from "@/components/ui/Card3D";

const SustainabilitySolutionsPage = () => {
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_sustainability');
  const { get } = usePageContent('sustainability-solutions');
  const headerImage = get('header_image') || defaultHeaderImage;

  return (
    <>
      <Helmet>
        <title>Sustainability Solutions & Climate Services | PANA Institute</title>
        <meta name="description" content="Driving value through decarbonisation, ESG and green innovation. A move from compliance to execution, delivering measurable environmental and financial value." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="Sustainability Solutions & Climate Services"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy via-zinc-900 to-pana-red"></div>
              )}
              <div className="absolute inset-0 bg-black/65"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  <span>Sustainability as a Business</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                  Sustainability Solutions <span className="text-red-600">& Climate Services</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  Driving value through decarbonisation, ESG and green innovation. A move from compliance to execution, delivering measurable environmental and financial value.
                </p>

                {/* Sub-navigation Pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <a href="#overview" className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-lg">
                    Overview
                  </a>
                  <a href="#services" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors">
                    Services
                  </a>
                  <a href="#sustainacore" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors">
                    SustainaCore
                  </a>
                  <a href="#deliverables" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors">
                    What We Deliver
                  </a>
                  <a href="#gtm" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors">
                    Go to Market
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 01: Why Now & Positioning */}
          <section id="overview" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Sustainability · Why Now</span>
                <h2 className="text-4xl font-bold text-pana-navy mb-6">From Commitments to Action</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Sustainability is now a core business driver, not just a compliance task. Climate risk is becoming financial risk, disclosure frameworks are widening, and investors are asking for measurable, auditable performance.
                </p>
                <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl text-left">
                  <p className="text-red-950 font-semibold text-base leading-relaxed">
                    <strong>Our Positioning:</strong> To be the trusted partner that helps organisations move to low carbon, ESG compliant and resilient operations, across advisory, implementation and a digital platform.
                  </p>
                </div>
              </div>

              {/* 4 Trends Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">Trend 01</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Stronger regulation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Disclosure frameworks such as CSRD and ISSB are expanding globally.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Trend 02</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Data driven ESG</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    More focus on measurable, auditable sustainability performance.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">Trend 03</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate momentum</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    More firms adopting science based emissions targets (SBTi).
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-2">Trend 04</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Transition realities</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Progress is uneven under economic and geopolitical pressure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Five Service Verticals */}
          <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Sustainability · Services</span>
                <h2 className="text-4xl font-bold text-pana-navy mb-4">Five Service Verticals</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Comprehensive climate solutions spanning advisory, engineering, data platforms, and green technology:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Pillar 01 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="p-8 bg-white/95 rounded-2xl border border-gray-200 border-t-4 border-t-red-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Decarbonisation solutions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Carbon footprint assessment across Scope 1, 2 and 3, net zero strategy and implementation, methane reduction programmes, carbon management and project development, carbon capture, utilisation and storage, and energy storage and smart grid solutions.
                    </p>
                  </div>
                </Card3D>

                {/* Pillar 02 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(37, 99, 235, 0.15)">
                  <div className="p-8 bg-white/95 rounded-2xl border border-gray-200 border-t-4 border-t-blue-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Energy transition & climate solutions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Renewable energy advisory across solar, wind and hybrid systems, energy audits and efficiency, climate risk and resilience planning, and nature based solutions.
                    </p>
                  </div>
                </Card3D>

                {/* Pillar 03 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(20, 184, 166, 0.15)">
                  <div className="p-8 bg-white/95 rounded-2xl border border-gray-200 border-t-4 border-t-teal-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">ESG advisory</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      ESG strategy and governance frameworks, tracking and reporting aligned to ISSB, GRI and TCFD, ESG ratings and investor readiness, and ESG data platforms.
                    </p>
                  </div>
                </Card3D>

                {/* Pillar 04 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(147, 51, 234, 0.15)">
                  <div className="p-8 bg-white/95 rounded-2xl border border-gray-200 border-t-4 border-t-indigo-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Sustainability consulting</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Sustainability planning, risk, resilience and climate adaptation, supply chain sustainability, circular economy strategies, and sustainable finance advisory.
                    </p>
                  </div>
                </Card3D>

                {/* Pillar 05 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(245, 158, 11, 0.15)">
                  <div className="p-8 bg-white/95 rounded-2xl border border-gray-200 border-t-4 border-t-amber-500 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Green solutions & climate tech</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      ESG data platforms, carbon markets and offsets, climate analytics, carbon accounting software, emissions tracking, and climate fintech, with research and development running through all of it.
                    </p>
                  </div>
                </Card3D>

                {/* Shared R&D Card */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.2)">
                  <div className="p-8 bg-zinc-950 text-white rounded-2xl flex flex-col justify-center shadow-3d-dark h-full preserve-3d">
                    <h3 className="text-xl font-bold mb-3 text-red-500 translate-z-10">R&D-Powered Climate Innovation</h3>
                    <p className="text-gray-300 text-sm leading-relaxed translate-z-10">
                      Research and development runs through all 5 verticals, connecting laboratory insights directly to client carbon abatement projects.
                    </p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Section 03: SustainaCore Platform Table */}
          <section id="sustainacore" className="py-20 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-2">Sustainability · Platform</span>
                <h2 className="text-4xl font-bold mb-4">SustainaCore Platform</h2>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  One intelligent, modular platform for compliance, reduction, reporting and the monetisation of climate action: a unified sustainability operating system, with modules aligned to the core services and to global standards.
                </p>
              </div>

              <div className="bg-zinc-800 rounded-3xl shadow-xl border border-zinc-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950 text-white text-sm font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 border-b border-zinc-700">Pillar</th>
                        <th className="py-4 px-6 border-b border-zinc-700">Platform Module</th>
                        <th className="py-4 px-6 border-b border-zinc-700">Global Standards Aligned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/60 text-sm text-zinc-300">
                      <tr className="hover:bg-zinc-700/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">Emissions data management</td>
                        <td className="py-4 px-6 font-semibold text-red-400">Core Data Engine</td>
                        <td className="py-4 px-6 text-zinc-400">GHG Protocol, ISO 14064, PCAF</td>
                      </tr>
                      <tr className="hover:bg-zinc-700/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">Carbon accounting</td>
                        <td className="py-4 px-6 font-semibold text-red-400">Automated Carbon Ledger</td>
                        <td className="py-4 px-6 text-zinc-400">SBTi, TCFD, EU ETS, SECR</td>
                      </tr>
                      <tr className="hover:bg-zinc-700/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">Reduction roadmap</td>
                        <td className="py-4 px-6 font-semibold text-red-400">Decarbonisation Navigator</td>
                        <td className="py-4 px-6 text-zinc-400">SBTi Net Zero, ACT, ISO 50001</td>
                      </tr>
                      <tr className="hover:bg-zinc-700/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">Climate projects</td>
                        <td className="py-4 px-6 font-semibold text-red-400">Impact Marketplace</td>
                        <td className="py-4 px-6 text-zinc-400">VCS, Gold Standard, ICROA, CORSIA</td>
                      </tr>
                      <tr className="hover:bg-zinc-700/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">Communication and branding</td>
                        <td className="py-4 px-6 font-semibold text-red-400">Green Claims Manager</td>
                        <td className="py-4 px-6 text-zinc-400">EU Green Claims Directive, FTC Green Guides, UK CMA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: What We Deliver */}
          <section id="deliverables" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Sustainability · Deliverables</span>
                <h2 className="text-4xl font-bold text-pana-navy mb-4">What We Deliver</h2>
                <p className="text-lg text-gray-600">
                  Tangible assets, blueprints, and platforms driving real business impact:
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-900 text-white text-sm font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 border-b border-gray-800">Category</th>
                        <th className="py-4 px-6 border-b border-gray-800">Deliverable</th>
                        <th className="py-4 px-6 border-b border-gray-800">Business Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Business and strategy</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Sustainability business model blueprint</td>
                        <td className="py-4 px-6">Clear direction and a scalable structure</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Business and strategy</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Go to market strategy and revenue model</td>
                        <td className="py-4 px-6">Faster market entry and diversified revenue</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Service architecture</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Service portfolio and operating model per line</td>
                        <td className="py-4 px-6">Market ready offerings and efficient delivery</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Execution tools</td>
                        <td className="py-4 px-6 font-semibold text-red-600">ESG frameworks, carbon accounting tools, playbooks</td>
                        <td className="py-4 px-6">Faster delivery and compliance readiness</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Growth enablement</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Partnership ecosystem and digital platform roadmap</td>
                        <td className="py-4 px-6">Wider reach and recurring revenue</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05: Go to Market Phases */}
          <section id="gtm" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Sustainability · Roadmap</span>
                <h2 className="text-4xl font-bold text-pana-navy mb-4">Go to Market: Entry, Growth, Scale</h2>
                <p className="text-lg text-gray-600">
                  Phased deployment roadmap for regional and international expansion:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Phase 1 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 border-t-4 border-t-red-600 shadow-sm hover:shadow-md transition-shadow">
                  <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full uppercase block w-max mb-4">Phase 1</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Market entry</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Build credibility through thought leadership, form strategic partnerships, and secure pilot projects with anchor clients.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-shadow">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full uppercase block w-max mb-4">Phase 2</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Growth</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Develop sector specific solutions, build case studies with measurable impact, and deepen partnerships for repeat business.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 border-t-4 border-t-emerald-600 shadow-sm hover:shadow-md transition-shadow">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase block w-max mb-4">Phase 3</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Scale</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Launch the digital ESG platform (SustainaCore), develop proprietary tools, expand across Africa, and access climate finance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-zinc-950 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Transition From Compliance to Action</h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
                Partner with PANA Institute to deploy carbon reduction roadmaps, ESG frameworks, and climate technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" className="no-underline">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                    Schedule Decarbonisation Audit
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href="mailto:info@pana-institute.com" className="no-underline">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                    Contact Climate Services
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

export default SustainabilitySolutionsPage;

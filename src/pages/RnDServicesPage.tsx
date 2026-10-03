import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, Lightbulb, Users, Globe, Rocket, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { Card3D } from "@/components/ui/Card3D";

const RnDServicesPage = () => {
  // Fetch header image from centralized system
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_rnd');
  const { get } = usePageContent('rnd-services');
  const headerImage = get('header_image') || defaultHeaderImage;

  return (
    <>
      <Helmet>
        <title>R&D Services | PANA Institute</title>
        <meta name="description" content="Research and Development services for innovation, technology development, and cutting-edge solutions." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-grow">
          {/* Page Header with Image */}
          <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="R&D Services"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-red"></div>
              )}
            </div>
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Subtle animated elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pana-gold/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  <span>Research and Development</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.25] pb-2 text-white">
                  Five Centres of <span className="text-red-600">Excellence</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  Five centres of excellence sit inside Research and Development. Each supplies subject authority to every division and drives revenue in a partnership led mode, keeping the Institute's training current.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <a href="#centres-of-excellence" className="no-underline">
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                      Explore Centres
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Shared Charter Banner */}
          <section className="py-12 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="bg-zinc-800/80 border border-zinc-700/80 p-8 rounded-3xl shadow-xl">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-2">Institutional Governance</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Every Centre Carries the Same Charter</h2>
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                  Every centre carries the same charter: a director, a standing advisory panel of operators and regulators, a research agenda approved on a three year cycle, a laboratory or testbed, a family of competence frameworks, a flagship annual publication, and a named funding line. A centre does not run its own training operation or back office.
                </p>
                <div className="pt-4 border-t border-zinc-700 text-zinc-400 text-sm italic">
                  <strong>Gate Criteria for Sponsored Centres:</strong> Sponsored and customised centres follow a gate: a signed funding commitment covering three years of core cost, a named director, an approved research agenda, and proof the field does not duplicate an existing centre. The same gate applies to closing one.
                </div>
              </div>
            </div>
          </section>

          {/* The Five Centres Section */}
          <section id="centres-of-excellence" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">PANA Institute R&D</span>
                <h2 className="text-4xl font-bold text-pana-navy mb-4">The Five Centres of Excellence</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Driving subject authority, accredited frameworks, and industry innovation:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Centre 01 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-red-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Centre for Oil and Gas Technology</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 translate-z-10">
                      Upstream and midstream operations, process safety, flow measurement and control, rotating equipment, welding and inspection, subsea, and petroleum economics.
                    </p>
                    <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-red-700 translate-z-10">
                      Anchors NCDMB & OGTAN accredited work.
                    </div>
                  </div>
                </Card3D>

                {/* Centre 02 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(16, 185, 129, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-emerald-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Centre for Sustainability and Environment</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 translate-z-10">
                      Emissions accounting and verification, life cycle assessment, environmental and social governance reporting, the circular economy, compliance, and host community social performance.
                    </p>
                    <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-emerald-700 translate-z-10">
                      ESG & Decarbonisation Frameworks.
                    </div>
                  </div>
                </Card3D>

                {/* Centre 03 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(37, 99, 235, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-blue-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Centre for Energy and Power</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 translate-z-10">
                      Generation, transmission and distribution operations, grid modernisation, renewable integration, storage, mini grids and rural electrification, and energy efficiency.
                    </p>
                    <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-blue-700 translate-z-10">
                      Grid Modernisation & Power Infrastructure.
                    </div>
                  </div>
                </Card3D>

                {/* Centre 04 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(147, 51, 234, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-purple-600 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Centre for Digital Innovation & AI</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 translate-z-10">
                      Industrial data engineering, artificial intelligence applied to operations, cybersecurity for operational technology, cloud and platform skills, and the data refinery.
                    </p>
                    <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-purple-700 translate-z-10">
                      Scales without adding physical capacity.
                    </div>
                  </div>
                </Card3D>

                {/* Centre 05 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(245, 158, 11, 0.15)">
                  <div className="p-8 bg-gray-50/90 rounded-2xl border border-gray-100 border-t-4 border-t-amber-500 shadow-3d-glass h-full preserve-3d">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">Centre for Smart Agriculture</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 translate-z-10">
                      Climate smart production, agri processing and post harvest systems, irrigation and water productivity, soil health and carbon, agrivoltaics, mechanisation skills, and climate risk in food value chains.
                    </p>
                    <div className="pt-3 border-t border-gray-200 text-xs font-semibold text-amber-700 translate-z-10">
                      Agrivoltaics & Food Value Chains.
                    </div>
                  </div>
                </Card3D>

                {/* Summary Card */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.2)">
                  <div className="p-8 bg-zinc-950 text-white rounded-2xl flex flex-col justify-center shadow-3d-dark h-full preserve-3d">
                    <h3 className="text-xl font-bold mb-3 translate-z-10 text-red-500">Subject Authority Across Divisions</h3>
                    <p className="text-gray-300 text-sm leading-relaxed translate-z-10">
                      Each centre supplies subject authority to every division and drives revenue in a partnership led mode, keeping the Institute's training current.
                    </p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Research to Impact Matrix Table */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Value Delivery</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">From Research to Impact</h2>
                <p className="text-lg text-gray-600">
                  How input areas translate into tangible outputs across the regional ecosystem:
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-900 text-white text-sm font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 border-b border-zinc-800">Input Area</th>
                        <th className="py-4 px-6 border-b border-zinc-800">Contribution</th>
                        <th className="py-4 px-6 border-b border-zinc-800">Output to the Ecosystem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Research</td>
                        <td className="py-4 px-6">Faculty and student led projects, often across departments</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Publications, prototypes, models and datasets</td>
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Innovation</td>
                        <td className="py-4 px-6">Deep technology ideas through proofs of concept and pilots</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Intellectual property, start ups and routes to market</td>
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Talent Development</td>
                        <td className="py-4 px-6">Students engaged in industry funded research</td>
                        <td className="py-4 px-6 font-semibold text-red-600">A skilled workforce</td>
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Policy Impact</td>
                        <td className="py-4 px-6">Data driven insight on sustainable transitions</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Inputs to government, regulators and think tanks</td>
                      </tr>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-900">Global Partnerships</td>
                        <td className="py-4 px-6">Links with international consortia and universities</td>
                        <td className="py-4 px-6 font-semibold text-red-600">Knowledge transfer and funding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-zinc-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner With Our R&D Centres</h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
                Connect with our Centre Directors, access laboratory testbeds, or sponsor a research chair.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" className="no-underline">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                    Start Your R&D Project
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href="mailto:info@pana-institute.com" className="no-underline">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                    Contact R&D Directorate
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

export default RnDServicesPage;

import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, FileCheck, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { Card3D } from "@/components/ui/Card3D";

const SafetyPage = () => {
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_safety');
  const { get } = usePageContent('safety');
  const headerImage = get('header_image') || defaultHeaderImage;

  return (
    <>
      <Helmet>
        <title>{get('hero_title', 'Safety at PANA Institute')} | Health, Safety & Environment (HSE)</title>
        <meta name="description" content={get('hero_description', 'Health, safety and environment standards built into every programme. ISO 14001 and ISO 45001 targeted for completion in 2027.')} />
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
                  alt="Safety at PANA Institute"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-red-950 to-pana-navy"></div>
              )}
              <div className="absolute inset-0 bg-black/70"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <span>{get('hero_badge', 'Our Institute · Safety')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.25] pb-2 text-white">
                  {get('hero_title', 'Safety at PANA Institute')}
                </h1>

                {get('hero_subtitle') && (
                  <p className="text-xl md:text-2xl text-red-400 font-semibold max-w-3xl mx-auto">
                    {get('hero_subtitle')}
                  </p>
                )}

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  {get('hero_description', 'Health, safety and environment standards are built into every programme, from curriculum design through to delivery on live equipment. Safety is taught the way it is practised on a working site, not as a separate module.')}
                </p>

                <div className="flex justify-center gap-4 mt-8">
                  <a href="#safety-framework" className="no-underline">
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                      Explore Safety Framework
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Management System & Target */}
          <section id="safety-framework" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto bg-zinc-900 text-white p-10 md:p-14 rounded-3xl shadow-xl border border-zinc-800">
                <div className="flex items-center gap-3 text-red-400 font-bold text-xs uppercase tracking-wider mb-4">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span>Single Integrated Management System</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">ISO Certification Roadmap (2027)</h2>
                <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8">
                  Environmental and occupational health and safety certification is in progress under ISO 14001 and ISO 45001, targeted for completion in 2027, and folded into the single management system the Institute runs across all of its work.
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
                  <div className="bg-zinc-800/80 p-6 rounded-2xl border border-zinc-700">
                    <span className="text-red-500 font-black text-2xl block mb-1">ISO 14001</span>
                    <div className="font-bold text-white text-lg mb-1">Environment</div>
                    <p className="text-zinc-400 text-sm">Environmental management, in progress across the Institute.</p>
                  </div>

                  <div className="bg-zinc-800/80 p-6 rounded-2xl border border-zinc-700">
                    <span className="text-red-500 font-black text-2xl block mb-1">ISO 45001</span>
                    <div className="font-bold text-white text-lg mb-1">Occupational health and safety</div>
                    <p className="text-zinc-400 text-sm">Worker safety management, in progress alongside the environment scope.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: 4 Core Pillars */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">PANA Institute HSE</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Practice & Assurance</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  How safety is embedded into every operational workflow and internal governance process:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* ISO 14001 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 border-t-4 border-t-red-600 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 translate-z-10">ISO 14001</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Environment</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Environmental management, in progress across the Institute.
                    </p>
                  </div>
                </Card3D>

                {/* ISO 45001 */}
                <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 border-t-4 border-t-red-700 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 translate-z-10">ISO 45001</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Occupational health and safety</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Worker safety management, in progress alongside the environment scope.
                    </p>
                  </div>
                </Card3D>

                {/* Practice */}
                <Card3D intensity={14} depth={20} glowColor="rgba(245, 158, 11, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 border-t-4 border-t-amber-500 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 translate-z-10">Practice</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Train for prevention</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Programmes train for performance, prevention and sustainability across every category of work.
                    </p>
                  </div>
                </Card3D>

                {/* Assurance */}
                <Card3D intensity={14} depth={20} glowColor="rgba(24, 24, 27, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 border-t-4 border-t-zinc-800 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 translate-z-10">Assurance</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">One system</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">
                      Safety obligations sit inside the same document control, internal audit and management review as the rest of the Institute.
                    </p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-zinc-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{get('cta_title', 'Learn With Uncompromising HSE Standards')}</h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
                {get('cta_subtitle', 'All training programmes follow strict operational safety protocols mirroring live industrial sites.')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={get('cta_button_1_link', '/courses')} className="no-underline">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                    {get('cta_button_1_text', 'Explore Programmes')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href={get('cta_button_2_link', '/about')} className="no-underline">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                    {get('cta_button_2_text', 'About Our Institute')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Dynamic Sections from Page Builder */}
        <DynamicPageSections slug="safety" />

        <Footer />
      </div>
    </>
  );
};

export default SafetyPage;

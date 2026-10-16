import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Monitor, Users, Award, ArrowRight, CheckCircle, Zap, Globe, Target, TrendingUp } from "lucide-react";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/Card3D";

const TrainingDelivery = () => {
  // Fetch header image from centralized system
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_training');

  // Fetch CMS content overrides (falls back to hardcoded defaults)
  const { get } = usePageContent('training-delivery');
  const headerImage = get('header_image') || defaultHeaderImage;

  return (
    <>
      <Helmet>
        <title>Training Delivery | PANA Institute - Excellence in Learning</title>
        <meta name="description" content="Discover PANA Institute's comprehensive training delivery methods, modern technology platforms, and international standard learning environments designed for maximum impact." />
        <meta name="keywords" content="training delivery, learning management system, virtual classroom, training methods, PANA Institute" />
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="Competency Assessment & Development"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy via-pana-blue to-pana-red relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-pana-navy/80 via-pana-blue/40 to-transparent"></div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  <span>{get('hero_badge', 'Competency Assessment & Development')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.25] pb-2 text-white">
                  {get('hero_title', 'Competency Assessment ')}<span className="text-red-600">{get('hero_subtitle', '& Development')}</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  {get('hero_description', 'A capability development hub delivering training, leadership development and practical skills aligned with real operational needs, and an assessment function that judges competence on evidence alone.')}
                </p>
              </div>
            </div>
          </section>

          {/* Section 01: Competency · Programmes */}
          <section id="programmes" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Competency · Programmes</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Solution Categories</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We train for performance, prevention and sustainability, across tailored, product specific and NCDMB stipulated Human Capital Development programmes. Thirteen categories of training solution sit under the pillar.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-red-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Technical, operations and maintenance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Power and drives, valves and actuation, measurement and management, instrumentation and automation, welding and NDT, marine and subsea, exploration and production, renewable energy.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-purple-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digitalisation and transformation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Smart grid, SCADA, artificial intelligence, the internet of things, and drones.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-emerald-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Safety and sustainability</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Industrial safety, environmental compliance and sustainable practice.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Project management</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Project management and project development for capital and operational work.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-indigo-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership and management</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Leadership, management and professional development courses.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-amber-500 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Trades and site skills</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Scaffolding, rigging and lifting, welding and pipe fitting.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-rose-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Human capital development</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nigerian Content HCD, collaborative HCD, project based HCD, remedial HCD, and community and industry impact work.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-cyan-600 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digital literacy and social impact</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Digital literacy, IT skills, youth and host community development, and career fairs.
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 border-t-4 border-t-zinc-700 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Customised and specialist</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Customer specific, product specific and specialist courses, onboarding and orientation, sales, and asset management.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl max-w-4xl mx-auto text-center">
                <p className="text-red-900 font-medium text-base">
                  Delivery covers qualification and specialisation courses, certificate courses, scalable digital learning, and assessment against published competence frameworks.
                </p>
              </div>
            </div>
          </section>

          {/* Section 02: Competency · Faculty */}
          <section id="faculty" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Competency · Faculty</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How Delivery is Put Together</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Programmes are led by instructors who have run the jobs they teach, connected to academic partners and to the subject authority held in the centres.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card3D intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 translate-z-10">People</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Industry leading faculty</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">Guided by experts who help shape industry standards.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15} glowColor="rgba(37, 99, 235, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 translate-z-10">Partners</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Global partnerships</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">Connected to leading organisations, innovators and original equipment manufacturers worldwide.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15} glowColor="rgba(245, 158, 11, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 translate-z-10">Design</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Custom learning solutions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">Courses built to address specific job roles and in country skills gaps.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15} glowColor="rgba(16, 185, 129, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 translate-z-10">Support</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Lifetime alumni support</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">Continuing mentorship for sustained professional growth.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15} glowColor="rgba(147, 51, 234, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass h-full preserve-3d">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 translate-z-10">Proof</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Verifiable digital credentials</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">Recognised certifications with secure verification an employer can check.</p>
                  </div>
                </Card3D>
                <Card3D intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.15)">
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-3d-glass border-l-4 border-l-red-600 h-full preserve-3d">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 translate-z-10">Integrity</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 translate-z-10">Independent assessment</h3>
                    <p className="text-gray-600 text-sm leading-relaxed translate-z-10">No commercial relationship changes a judgement about what a person can do.</p>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Section 03: Competency · Labs */}
          <section id="labs" className="py-20 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-2">Competency · Labs</span>
                <h2 className="text-4xl font-bold mb-4">Operational Environments & Simulators</h2>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  Learning happens in environments that mirror real operations: live equipment, workshops, plant and simulators. The technical domains below anchor the laboratories, the curriculum and the assessment centres.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  'Power and Drives',
                  'Valves and Actuation',
                  'Measurement and Management',
                  'Integrated Automation and Digital Solutions',
                  'Supply Chain Management',
                  'Exploration and Production',
                  'Marine and Subsea',
                  'Digitalisation and Digitisation'
                ].map((domain, idx) => (
                  <div key={idx} className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-red-500 transition-colors flex items-center">
                    <div className="font-semibold text-zinc-100 text-base">{domain}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 04: Competency · Roar Club */}
          <section id="roar-club" className="py-20 bg-gradient-to-br from-amber-500/10 via-white to-red-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-2">Competency · Roar Club</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Roar Club Alumni & Community</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Roar Club is the learner and alumni community of PANA Institute. It carries the lifetime relationship the Institute keeps with everyone who trains and is assessed here, from a first certificate course through to the fellowship.
                </p>
                <p className="text-sm text-gray-600 italic">
                  Members stay connected through mentorship, continuing development, and access to events, career fairs and the Institute's partner network. The alumni base is being built toward a standing fellowship with a defined membership.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200 border-t-4 border-t-amber-500">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Belong</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Alumni network</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">A lasting membership for graduates of every programme.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200 border-t-4 border-t-amber-600">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Grow</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mentorship</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Continuing guidance and professional development after certification.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200 border-t-4 border-t-red-600">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Connect</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Events and fairs</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Career fairs, community development and partner led sessions.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200 border-t-4 border-t-zinc-800">
                  <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Advance</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fellowship pathway</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">A route from alumnus to fellow as the fellowship is stood up.</p>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="bg-zinc-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{get('cta_title', 'Ready to Build Verifiable Operational Competence?')}</h2>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
                {get('cta_subtitle', 'Explore our accredited programmes, register for hands-on simulator training, or join the Roar Club community.')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={get('cta_button_1_link', '/courses')} className="no-underline">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                    {get('cta_button_1_text', 'Explore Programmes')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href={get('cta_button_2_link', '/contact')} className="no-underline">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                    {get('cta_button_2_text', 'Contact Admissions')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* Dynamic Page Builder Sections */}
          <DynamicPageSections slug="training-delivery" />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TrainingDelivery;
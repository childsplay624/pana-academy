import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, Briefcase } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSiteImage } from "@/hooks/useSiteImage";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team.types";

// Team member card component
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const { imageUrl } = useSiteImage(member.image_key || '');

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden group border-0 shadow-lg">
        <div className="relative h-96 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <span className="text-6xl font-bold text-red-400">{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {member.name}
              </h3>
              <p className="text-red-600 font-semibold text-base">
                {member.title}
              </p>
              {member.subtitle && (
                <p className="text-gray-600 text-sm mt-1">
                  {member.subtitle}
                </p>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {member.description}
            </p>

            <div className="pt-4">
              <Link
                to={`/team/${member.slug}`}
                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm group/link transition-colors"
              >
                View Full Profile
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div >
  );
};

const TeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setMembers((data as TeamMember[]) || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const governingMembers = members.filter(m => m.category === 'governing');
  const boardMembers = members.filter(m => m.category === 'board');
  const advisoryMembers = members.filter(m => m.category === 'advisory');

  const stats = [
    { icon: Users, value: "200+", label: "trained professionals" },
    { icon: Briefcase, value: "50+", label: "Industry Experts" },
    { icon: Globe, value: "20+", label: "Training programs" },
    { icon: Award, value: "4+", label: "Years of Excellence" }
  ];

  const { imageUrl: headerImageUrl } = useSiteImage('header_team');

  return (
    <>
      <Helmet>
        <title>Our Leadership Team | PANA Institute</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden mt-20">
            <div className="absolute inset-0">
              {headerImageUrl ? (
                <img
                  src={headerImageUrl}
                  alt=""
                  className="w-full h-[110%] object-cover object-top -translate-y-4 md:-translate-y-8"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-red"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
            </div>

            <div className="relative h-full flex items-center justify-center px-4">
              <div className="text-center max-w-4xl mt-12">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 mb-4 uppercase">
                  Our Institute · Leadership
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Governance and leadership
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mx-auto max-w-3xl leading-relaxed">
                  Authority over standards sits with governance, not with delivery. No person may both deliver a programme and decide the assessment outcome for the same candidate. That separation is what lets assessors of international standing trust a judgement made here.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Council & Committees Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Leadership · Governing Council</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Governing Council</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Governing Council holds supreme oversight of the Institute and the PANA Holdings board seat. Four councils and committees report into it, each with a defined authority and a matching limit.
                </p>
              </div>

              {/* Governing Council & Board Team Members */}
              {loading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                </div>
              ) : (
                <>
                  {(governingMembers.length > 0 || boardMembers.length > 0) && (
                    <div className="mb-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...governingMembers, ...boardMembers].map((member, idx) => (
                          <TeamMemberCard key={member.id} member={member} index={idx} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* Councils and Committees Reporting into Governing Council */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-red-600">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Curricula and standards</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Academic and Research Council</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Approves curricula, competence frameworks, academic standards, research agendas and research ethics, and clears every think tank publication.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-blue-600">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Assessment integrity</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Assessment Integrity Committee</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Employers, practitioners, regulators and learners. Owns assessment design, examiner calibration and appeals, and can stop a result being released.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-amber-500">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Fellowship</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Fellows Council</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Governs the fellowship, the professorial chairs and the thought leadership mandate.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-t-4 border-t-zinc-700">
                  <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">Assurance</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Risk, Audit and Ethics Committee</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Assurance over hub governance, joint financing, research integrity and conflict of interest.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl max-w-4xl mx-auto mb-6">
                <p className="text-red-900 text-sm leading-relaxed italic">
                  <strong>ISO 21001:2025 Mandate:</strong> ISO 21001:2025 requires assessment to be traceable, secure against malpractice and open to appeal, with grades tied back to evidence. The Assessment Integrity Committee holds those obligations and reports to the Council rather than to the executive.
                </p>
              </div>
            </div>
          </section>

          {/* Executive Management Structure */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Leadership · Executive Management</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Executive Management Team</h2>
                <p className="text-gray-600 leading-relaxed">
                  The executive runs delivery and research under the Founder and Group Chief Executive. Four delivery divisions sit under the Head of Programmes and Strategy; five centres of excellence sit under the Head of Research and Development.
                </p>
              </div>

              {/* Dynamic Database Team Members (Executive) */}
              {loading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
                </div>
              ) : (
                advisoryMembers.length > 0 && (
                  <div className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {advisoryMembers.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Functional Executive Structure Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Founder and GCEO</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Sets direction for the Institute and holds the relationship with the Governing Council and the group.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Senior Vice President</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Oversees global strategic partnerships and the growth pipeline across the divisions.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Chief of Administration</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Registry, finance, legal, human resources, ICT, the learning platform and facilities.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Head, Programmes & Strategy</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The five delivery divisions, the growth pipeline and strategic planning.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Head, Research & Development</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The five centres of excellence, the chairs, laboratories, grants and licensing.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">Head, Quality, Standards & Curricula</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The management system, curriculum design, the internal audit programme and accreditation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Leadership · Inaugural Faculties */}
          <section className="py-20 bg-zinc-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Leadership · Inaugural Faculties</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Inaugural Faculties</h2>
                <p className="text-zinc-300 leading-relaxed">
                  The inaugural faculty is drawn from instructors who have run the operations they now teach, supported by academic partners and by the subject authority held in the five centres. Faculty appointments are made against the technical areas below.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {[
                  'Power and Drives',
                  'Valves and Actuation',
                  'Measurements and Management',
                  'Electrical Instrumentation and Control',
                  'Integrated Automation and Digital Solutions',
                  'Supply Chain Management',
                  'Exploration and Production',
                  'Marine and Subsea',
                  'Digitalisation and Digitisation'
                ].map((domain, index) => (
                  <div key={index} className="bg-zinc-800/80 p-5 rounded-xl border border-zinc-700 hover:border-red-500 transition-colors">
                    <div className="text-red-500 text-xs font-bold mb-1">0{index + 1}</div>
                    <div className="font-semibold text-zinc-100 text-sm">{domain}</div>
                  </div>
                ))}
              </div>

              <div className="text-center max-w-2xl mx-auto bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700/50">
                <p className="text-zinc-400 text-sm italic">
                  Named inaugural faculty appointments are being confirmed against these areas and will be published here as each chair and lead instructor is announced.
                </p>
              </div>
            </div>
          </section>



          <section className="py-20 bg-red-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Build the Institute with Us</h2>
            <p className="text-red-100 max-w-xl mx-auto mb-8">
              The Institute is appointing principal officers, directors, centre directors, faculty and assessors as it builds out its five pillars.
            </p>
            <Link to="/careers">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Explore Careers & Opportunities
              </Button>
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TeamPage;
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
          <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden mt-100">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            </div>

            <div className="relative h-full flex items-center justify-center px-4 mt-5">
              <div className="text-center max-w-4xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                  Meet Our <span className="text-red-500">Leadership Team</span>
                </h1>
                <p className="text-xl text-gray-200 mx-auto max-w-3xl">
                  Visionary leaders driving innovation and excellence across all our business units
                </p>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {boardMembers.length > 0 && (
                <section className="py-20 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Board of Directors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {boardMembers.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {advisoryMembers.length > 0 && (
                <section className="py-20 bg-gray-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Advisory Board</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {advisoryMembers.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          <section className="py-20 bg-red-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Growing Team</h2>
            <Link to="/careers">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                View Open Positions
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
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, Briefcase, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSiteImage } from "@/hooks/useSiteImage";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team.types";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Executive Team member card component
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const { imageUrl } = useSiteImage(member.image_key || '');

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <ScrollReveal direction="up" delay={index * 0.08} className="h-full">
      <div className="bg-paper border border-line rounded-xs overflow-hidden flex flex-col justify-between hover:border-oxblood/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full">
        <div>
          {/* Member Image / Initial Canvas */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-95"
              />
            ) : (
              <div className="w-full h-full bg-oxblood text-white font-serif text-5xl font-bold flex items-center justify-center">
                {initials}
              </div>
            )}
            <div className="absolute top-3 left-3 bg-oxblood text-white px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest rounded-xs shadow-md">
              {member.category ? member.category.toUpperCase() : 'LEADERSHIP'}
            </div>
          </div>

          {/* Member Info */}
          <div className="p-6 space-y-3">
            <div>
              <span className="font-mono text-[11px] text-brass uppercase font-semibold block mb-1">
                {member.subtitle || 'PANA INSTITUTE ASSESSOR'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink group-hover:text-oxblood transition-colors leading-snug">
                {member.name}
              </h3>
              <p className="font-mono text-xs text-oxblood uppercase font-semibold mt-1">
                {member.title}
              </p>
            </div>

            <p className="font-serif text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {member.description}
            </p>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="px-6 py-4 border-t border-line bg-paper-soft shrink-0 flex items-center justify-between">
          <Link
            to={`/team/${member.slug}`}
            className="font-mono text-xs uppercase tracking-widest text-oxblood hover:text-oxblood-deep font-semibold inline-flex items-center gap-1.5 group/link"
          >
            View Profile
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </ScrollReveal>
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

  return (
    <>
      <Helmet>
        <title>Leadership & Faculty | PANA Institute</title>
      </Helmet>

      <div className="min-h-screen bg-paper text-ink flex flex-col">
        <Navigation />

        <main className="flex-1 w-full">
          {/* Executive Dark Editorial Hero Header */}
          <section className="pt-36 pb-24 bg-ink text-paper border-b border-zinc-800 relative overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-7 relative z-10">
              <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
                INDEPENDENT GOVERNANCE · DOMAIN EXPERTS & ASSESSORS
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper mb-6">
                Governing Council & Executive Faculty
              </h1>
              <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
                Meet the visionary leaders, industry directors, and certified assessors driving competency standards and research innovation across energy and technology disciplines.
              </p>
            </div>
          </section>

          {loading ? (
            <div className="py-24 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood mx-auto"></div>
            </div>
          ) : (
            <div className="py-24 bg-paper">
              <div className="max-w-[1320px] mx-auto px-7 space-y-24">
                {boardMembers.length > 0 && (
                  <section>
                    <ScrollReveal direction="up" delay={0.1}>
                      <div className="mb-12 border-b border-line pb-6">
                        <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-2">
                          01 · EXECUTIVE LEADERSHIP
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Board of Directors & Council</h2>
                      </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {boardMembers.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </section>
                )}

                {advisoryMembers.length > 0 && (
                  <section>
                    <ScrollReveal direction="up" delay={0.1}>
                      <div className="mb-12 border-b border-line pb-6">
                        <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-2">
                          02 · DOMAIN AUTHORITY
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Advisory Board & Subject Experts</h2>
                      </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {advisoryMembers.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Fallback Grid if no specific categories */}
                {boardMembers.length === 0 && advisoryMembers.length === 0 && members.length > 0 && (
                  <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {members.map((member, idx) => (
                        <TeamMemberCard key={member.id} member={member} index={idx} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* Join Team CTA */}
          <section className="py-20 bg-ink text-paper border-t border-zinc-800">
            <div className="max-w-[1320px] mx-auto px-7 text-center space-y-6">
              <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block">
                TALENT RECRUITMENT · PANA INSTITUTE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-paper font-normal">Join Our Faculty & Research Panel</h2>
              <p className="font-serif text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Explore career opportunities to contribute to competency assessment, curriculum design, and live-plant training delivery.
              </p>
              <div className="pt-2">
                <Link to="/careers">
                  <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs font-semibold shadow-xl border border-oxblood-light">
                    View Open Positions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TeamPage;
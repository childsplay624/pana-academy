import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, CheckCircle2, Mail, Linkedin, Twitter, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSiteImage } from "@/hooks/useSiteImage";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team.types";
import { motion } from "framer-motion";

export default function TeamMemberPage() {
  const { memberId: slug } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const { imageUrl } = useSiteImage(member?.image_key || '');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setMember(data as TeamMember);
      } catch (error) {
        console.error('Error fetching team member:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMember();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood mx-auto"></div>
    </div>
  );

  if (!member) return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-serif text-3xl font-bold mb-4 text-ink">Leadership Record Not Found</h1>
      <Link to="/team">
        <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-xs">
          Return to Leadership Faculty
        </Button>
      </Link>
    </div>
  );

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Navigation />
      
      <main className="flex-grow">
        {/* Executive Dark Editorial Header Section */}
        <section className="pt-36 pb-20 bg-ink text-paper border-b border-zinc-800">
          <div className="max-w-[1320px] mx-auto px-7">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 font-mono text-xs text-brass uppercase tracking-widest hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Governing Council & Faculty
            </Link>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Profile Image Frame */}
              <div className="w-full max-w-[400px] shrink-0">
                <div className="relative aspect-[4/5] rounded-xs overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top opacity-95"
                    />
                  ) : (
                    <div className="w-full h-full bg-oxblood text-white font-serif text-7xl font-bold flex items-center justify-center">
                      {initials}
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-paper/90 backdrop-blur-xs rounded-xs border border-line">
                    <CheckCircle2 className="w-3.5 h-3.5 text-oxblood" />
                    <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-widest">
                      ACCREDITED ASSESSOR
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Bio Details */}
              <div className="space-y-6 max-w-3xl">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.22em] font-semibold text-brass block mb-2">
                    {member.category ? member.category.toUpperCase() : 'FACULTY'} MEMBER
                  </span>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-paper mb-3">
                    {member.name}
                  </h1>
                  <p className="font-mono text-base text-oxblood uppercase font-semibold">
                    {member.title}
                  </p>
                  {member.subtitle && (
                    <p className="font-serif text-lg text-zinc-400 mt-1">
                      {member.subtitle}
                    </p>
                  )}
                </div>

                <p className="font-serif text-base text-zinc-300 leading-relaxed pt-4 border-t border-zinc-800">
                  {member.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Bio Section */}
        <section className="py-20 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              {/* Sidebar Info */}
              <div className="space-y-8">
                <div className="bg-paper-soft border border-line p-6 rounded-xs space-y-4">
                  <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-oxblood pb-2 border-b border-line">
                    Institutional Record
                  </h3>
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">STATUS</span>
                      <span className="font-semibold text-ink">ACTIVE GOVERNING COUNCIL</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">ORGANIZATION</span>
                      <span className="font-semibold text-ink">PANA INSTITUTE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Extended Bio */}
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                  <h2 className="font-serif text-3xl font-medium text-ink pb-4 border-b border-line">
                    Executive Biography & Credentials
                  </h2>
                  <div className="font-serif text-base text-muted-foreground leading-relaxed space-y-4 whitespace-pre-line text-justify">
                    {member.full_bio || member.description}
                  </div>
                </div>

                {member.experience && Array.isArray(member.experience) && member.experience.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-medium text-ink pb-3 border-b border-line">
                      Career Landmarks & Mandates
                    </h2>
                    <div className="space-y-3">
                      {member.experience.map((exp: string, index: number) => (
                        <div key={index} className="bg-paper-soft p-5 border border-line rounded-xs flex items-start gap-4">
                          <div className="p-2 bg-paper border border-line text-oxblood rounded-xs shrink-0 mt-0.5">
                            <Award className="w-4 h-4" />
                          </div>
                          <p className="font-serif text-sm text-ink leading-relaxed">{exp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

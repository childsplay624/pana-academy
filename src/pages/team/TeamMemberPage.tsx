import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, Twitter, Share2, Award, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSiteImage } from "@/hooks/useSiteImage";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team.types";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold"
      >
        P
      </motion.div>
    </div>
  );

  if (!member) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Member Disengaged</h1>
      <Link to="/team">
        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all">
          Return to Team
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow pt-20">
        {/* ENHANCED Premium Header Section */}
        <section className="relative w-full bg-gray-50 overflow-hidden">
          {/* Subtle Dynamic Background Patterns */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-100 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              
              {/* IMAGE DISPLAY: Enhanced prominent vertical display */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[480px] lg:w-1/2 group"
              >
                {/* Decorative background frame */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-red-600 z-10" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-gray-900 z-10" />

                {/* Main Profile Image */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-8 ring-white bg-white">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white italic text-9xl opacity-20 select-none">
                      PANA
                    </div>
                  )}
                  
                  {/* Floating badge for image */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                       Verified Leadership
                    </span>
                  </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-[2rem]" />
              </motion.div>

              {/* PROFILE INFO: Focused and Premium Typography */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="w-full lg:w-1/2 space-y-8"
              >
                <div className="space-y-4">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/10 text-red-600 text-xs font-bold uppercase tracking-widest mb-2">
                    {member.category} Member
                  </span>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tighter leading-none italic pointer-events-none selection:bg-red-200">
                    {member.name}
                  </h1>
                  <div className="h-1.5 w-24 bg-red-600 rounded-full" />
                  <div className="space-y-1">
                    <p className="text-2xl md:text-3xl font-light text-gray-700">
                      {member.title}
                    </p>
                    {member.subtitle && (
                      <p className="text-lg md:text-xl text-gray-400 font-medium italic">
                        — {member.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                   {member.description}
                </p>

              </motion.div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION: Modern Clean Layout */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-24">
              
              {/* Profile Meta / Sidebar Info */}
              <div className="space-y-10">
                 <div className="space-y-6 pb-10 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-red-600">Core Expertise</h3>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-900" />
                          <span className="text-gray-900 font-semibold">{member.category === 'board' ? 'Executive Strategy' : 'Strategic Advisor'}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-900" />
                          <span className="text-gray-900 font-semibold">Leadership Development</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-900" />
                          <span className="text-gray-900 font-semibold truncate">Policy Advocacy</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-gray-50 rounded-[2rem] space-y-4">
                    <h4 className="font-bold text-gray-900">About the Profile</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                       This profile represents the official leadership data for PANA Institute. All records are verified by our corporate governance board.
                    </p>
                    <Link to="/team">
                      <Button variant="link" className="px-0 text-red-600 p-0 h-auto font-bold group">
                         Explore All Records
                         <ArrowLeft className="ml-2 w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                 </div>
              </div>

              {/* Main Expanded Content */}
              <div className="space-y-16">
                 {/* BIOGRAPHY */}
                 <div className="space-y-6">
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Biography</h2>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                       {member.full_bio || member.description}
                    </div>
                 </div>

                 {/* EXPERIENCE */}
                 {member.experience && Array.isArray(member.experience) && member.experience.length > 0 && (
                   <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Career Landmarks</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {member.experience.map((exp: string, index: number) => (
                          <motion.div 
                            key={index}
                            whileHover={{ x: 10 }}
                            className="bg-white p-6 rounded-2xl border-l-[6px] border-red-600 shadow-sm shadow-red-100 flex gap-4 items-center group cursor-default"
                          >
                            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                               <Award className="w-5 h-5 flex-shrink-0" />
                            </div>
                            <p className="text-gray-800 font-medium leading-relaxed">{exp}</p>
                          </motion.div>
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

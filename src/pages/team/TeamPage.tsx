import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, Briefcase } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSiteImage } from "@/hooks/useSiteImage";

type TeamMember = {
  name: string;
  title: string;
  image?: string;
  imageKey: string;
  description: string;
  id: string;
  subtitle?: string;
  category: 'board' | 'advisory';
};

const teamMembers: TeamMember[] = [
  {
    id: "daere-akobo",
    name: "Dr. Daere Afonya-a Akobo, FCIoD (London)",
    title: "Chairman and Group CEO",
    subtitle: "PANA Holdings",
    description: "Visionary entrepreneur and business leader with over 25 years of experience across multiple industries including oil & gas, power, and technology.",
    image: "/team/daere-akobo.png",
    imageKey: "team_daere_akobo",
    category: 'board'
  },
  {
    id: "iyenemi-akobo",
    name: "Mrs. Iyenemi Akobo",
    title: "Executive Director",
    subtitle: "Global Business Services",
    description: "Seasoned business administrator with international training and expertise in corporate governance and business administration.",
    image: "/team/iyenemi-akobo.png",
    imageKey: "team_iyenemi_akobo",
    category: 'board'
  },
  {
    id: "callista-azogu",
    name: "Mrs. Callista C. Azogu",
    title: "Board Member",
    subtitle: "Former Deputy Managing Director, NAOC",
    description: "Accomplished executive with extensive experience in the oil and gas industry, specializing in finance, HR, and corporate governance.",
    image: "/team/callista-azogu.png",
    imageKey: "team_callista_azogu",
    category: 'board'
  },
  {
    id: "kennedy-dike",
    name: "Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI",
    title: "Advisory Board Member",
    subtitle: "PANA Academy",
    description: "Seasoned HR practitioner with vast experience in Oil & Gas, Manufacturing, and Corporate Governance.",
    image: "/team/kennedy-dike.jpg",
    imageKey: "team_kennedy_dike",
    category: 'advisory'
  },
  {
    id: "ifeyinwa-achumba",
    name: "Dr. Ifeyinwa Eucharia Achumba",
    title: "Advisory Board Member",
    subtitle: "MNCS, MNSE, COREN Reg, CPN Reg, MIEEE, FFTF Fellow",
    description: "Experienced academic and industry professional with expertise in STEM education and industry-academia partnerships.",
    image: "/team/Ifeyinwa-Eucharia.jpg",
    imageKey: "team_ifeyinwa_achumba",
    category: 'advisory'
  }
];

// Team member card component
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const { imageUrl } = useSiteImage(member.imageKey, member.image);

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
        {/* Image container */}
        <div className="relative h-96 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <span className="text-6xl font-bold text-red-400">{initials}</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
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
                to={`/team/${member.id}`}
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

// Main TeamPage component
const TeamPage = () => {
  const boardMembers = teamMembers.filter(m => m.category === 'board');
  const advisoryMembers = teamMembers.filter(m => m.category === 'advisory');

  const stats = [
    { icon: Users, value: "100+", label: "Years Combined Experience" },
    { icon: Briefcase, value: "10+", label: "Business Verticals" },
    { icon: Globe, value: "Global", label: "Industry Reach" },
    { icon: Award, value: "5", label: "Leadership Experts" }
  ];

  // Fetch team header image from centralized system
  const { imageUrl: headerImageUrl } = useSiteImage('header_team', '/img/team-header.jpg');

  return (
    <>
      <Helmet>
        <title>Our Leadership Team | PANA Academy</title>
        <meta name="description" content="Meet the visionary leaders driving innovation and excellence at PANA Academy. Our distinguished team brings decades of experience across multiple sectors." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={headerImageUrl}
                alt="Our Leadership Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            </div>

            <div className="relative h-full flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-block mb-6"
                >
                  <span className="px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-400 text-sm font-medium">
                    Leadership Excellence
                  </span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Meet Our
                  <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Leadership Team
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Visionary leaders driving innovation and excellence across all our business units
                </p>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <Icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                      <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Leadership Team
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  At PANA Academy, our leadership team brings together decades of combined experience across various industries.
                  Their collective expertise and shared vision drive our commitment to excellence, innovation, and sustainable growth.
                </p>
                <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
              </motion.div>
            </div>
          </section>

          {/* Board Members Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Board of Directors
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our board members provide strategic guidance and leadership
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {boardMembers.map((member, index) => (
                  <TeamMemberCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Advisory Board Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Advisory Board
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Expert advisors bringing specialized knowledge and industry insights
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advisoryMembers.map((member, index) => (
                  <TeamMemberCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-red-600 to-red-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Join Our Growing Team
                </h2>
                <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                  We're always looking for talented individuals to join our team. Check out our current openings and become part of our mission.
                </p>
                <Link to="/careers">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
                  >
                    View Open Positions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TeamPage;
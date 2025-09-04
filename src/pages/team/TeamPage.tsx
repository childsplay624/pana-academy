import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "@/lib/avatarUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TeamMember = {
  name: string;
  title: string;
  image?: string;
  description: string;
  id: string;
  subtitle?: string;
};

const teamMembers: TeamMember[] = [
  {
    id: "daere-akobo",
    name: "Dr. Daere Afonya-a Akobo, FCIoD (London)",
    title: "Chairman and Group CEO",
    subtitle: "PANA Holdings",
    description: "Visionary entrepreneur and business leader with over 25 years of experience across multiple industries including oil & gas, power, and technology.",
    image: "/team/daere-akobo.png"
  },
  {
    id: "iyenemi-akobo",
    name: "Mrs. Iyenemi Akobo",
    title: "Executive Director",
    subtitle: "Global Business Services",
    description: "Seasoned business administrator with international training and expertise in corporate governance and business administration.",
    image: "/team/iyenemi-akobo.png"
  },
  {
    id: "callista-azogu",
    name: "Mrs. Callista C. Azogu",
    title: "Board Member",
    subtitle: "Former Deputy Managing Director, NAOC",
    description: "Accomplished executive with extensive experience in the oil and gas industry, specializing in finance, HR, and corporate governance.",
    image: "/team/callista-azogu.png"
  },
  {
    id: "kennedy-dike",
    name: "Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI",
    title: "Advisory Board Member",
    subtitle: "PANA Academy",
    description: "Seasoned HR practitioner with vast experience in Oil & Gas, Manufacturing, and Corporate Governance.",
    image: "/team/kennedy-dike.jpg"
  },
  {
    id: "ifeyinwa-achumba",
    name: "Dr. Ifeyinwa Eucharia Achumba",
    title: "Advisory Board Member",
    subtitle: "MNCS, MNSE, COREN Reg, CPN Reg, MIEEE, FFTF Fellow",
    description: "Experienced academic and industry professional with expertise in STEM education and industry-academia partnerships.",
    image: "/team/Ifeyinwa-Eucharia.jpg"
  }
];

// Compact Team member card component with avatar
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const avatarUrl = member.image || getAvatarUrl(member.name);
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-red-50 to-red-50">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
              <img 
                src={avatarUrl} 
                alt={member.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-600 text-xl font-semibold" 
                style={{ display: 'none' }}
              >
                {initials}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="pt-20 pb-6 px-4 text-center">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-xl font-semibold line-clamp-2 mb-1" title={member.name}>
                {member.name}
              </h3>
              <p className="text-gray-700 text-base font-medium line-clamp-1">
                {member.title}
              </p>
              {member.subtitle && (
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">
                  {member.subtitle}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {member.description}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <Link 
                to={`/team/${member.id}`}
                className="inline-flex items-center justify-center text-red-600 hover:text-red-700 text-xs font-medium w-full"
              >
                View Profile <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main TeamPage component
const TeamPage = () => {
  // Team introduction content
  const teamIntro = {
    title: "Our Leadership Team",
    subtitle: "Meet the Visionaries",
    description: "Our distinguished team of industry leaders brings together decades of experience across multiple sectors. With a shared vision for innovation and excellence, we are committed to driving sustainable growth and creating lasting impact across all our business verticals.",
    stats: [
      { value: "100+", label: "Years Combined Experience" },
      { value: "10+", label: "Business Verticals" },
      { value: "Global", label: "Industry Reach" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section with Header Image */}
        <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/assets/team/team-header.jpg"
              alt="Our Leadership Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Meet Our Leadership Team
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                  Visionary leaders driving innovation and excellence across all our business units
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Introduction */}
        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Our Guiding Vision
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                At PANA Holdings, our leadership team brings together decades of combined experience across various industries. 
                Their collective expertise and shared vision drive our commitment to excellence, innovation, and sustainable growth.
              </p>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              {[
                { value: "100+", label: "Years Combined Experience" },
                { value: "10+", label: "Business Verticals" },
                { value: "Global", label: "Industry Reach" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <p className="text-4xl font-bold text-red-600">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <h2 className="text-3xl font-semibold mb-8 text-center">
              Meet Our Leadership
            </h2>
          </div>
        </section>

        {/* Team Members Grid - Compact Layout */}
        <div className="container px-4 mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-32 mb-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Growing Team</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Check out our current openings.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            View Open Positions
          </Button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

// Main component
export default TeamPage;
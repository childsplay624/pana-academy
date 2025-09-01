import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

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
    id: "igilar-chukwuemeka",
    name: "Mr. Igilar Chukwuemeka",
    title: "Vice President, Synergy E&P",
    subtitle: "Technical Sales & Business Growth Leader",
    description: "A rising executive in the energy sector with a strong foundation in technical sales and business development.",
  },
  {
    id: "sylvia-agbamuche-maduka",
    name: "Dr. Sylvia Agbamuche‑Maduka",
    title: "Vice President",
    subtitle: "Global Business Services",
    description: "Seasoned executive with extensive experience in enterprise efficiency and operational excellence.",
  },
  {
    id: "lalit-zavar",
    name: "Mr. Lalit Zavar",
    title: "VP AKD Digital",
    subtitle: "Digital Transformation Leader",
    description: "Seasoned business leader driving digital transformation and industrial automation in the Energy sector.",
  },
  {
    id: "domotimi-leghemo",
    name: "Mr. Domotimi Leghemo",
    title: "General Manager",
    subtitle: "PANA Infrastructure",
    description: "Results-oriented engineer with extensive experience in large-scale energy infrastructure projects.",
  }
];

// Team member card component
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardContent className="flex-grow p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-600 font-medium">{member.title}</p>
            {member.subtitle && (
              <p className="text-gray-500 text-sm">{member.subtitle}</p>
            )}
            <p className="text-gray-600 text-sm">{member.description}</p>
            <Link 
              to={`/team/${member.id}`} 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
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
    description: "Our team of experienced professionals is dedicated to driving innovation and excellence in the energy sector. With diverse expertise and a shared commitment to sustainable growth, we're shaping the future of energy.",
    stats: [
      { value: "100+", label: "Years Combined Experience" },
      { value: "15+", label: "Countries Served" },
      { value: "50+", label: "Industry Experts" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {teamIntro.title}
            </h1>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              {teamIntro.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {teamIntro.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            <Separator className="my-12" />
            
            <h2 className="text-3xl font-semibold mb-8">
              Meet Our Leadership
            </h2>
          </motion.div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Our Growing Team</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Check out our current openings.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
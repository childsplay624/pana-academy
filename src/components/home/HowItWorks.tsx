import { motion } from "framer-motion";
import { BookOpen, Video, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card3D } from "@/components/ui/Card3D";

export function HowItWorks() {
  const howItWorksSteps = [
    {
      number: "01",
      title: "Choose Your Path",
      description: "Browse 200+ expert courses across 8 specializations tailored to your career goals",
      icon: BookOpen,
    },
    {
      number: "02",
      title: "Learn & Practice",
      description: "Engage with video lessons, live sessions, and hands-on projects guided by industry experts",
      icon: Video,
    },
    {
      number: "03",
      title: "Get Certified",
      description: "Earn industry-recognized credentials and advance your career with our job placement support",
      icon: Award,
    },
  ];

  return (
    <section className="py-24 bg-white pt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Structured Roadmap</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How PANA Institute Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your journey to competency mastery and professional accreditation in 3 steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card3D key={index} intensity={15} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                <div className="relative bg-gray-50/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200/80 shadow-3d-glass hover:shadow-3d-dark transition-all duration-300 h-full text-center preserve-3d">
                  {/* Step Number Badge */}
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 text-white text-xl font-extrabold rounded-2xl mb-6 shadow-md shadow-red-600/30 translate-z-10">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-5 translate-z-10 shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 translate-z-10">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm translate-z-10">{step.description}</p>
                </div>
              </Card3D>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <Link to="/courses">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-9 py-6 text-lg font-bold rounded-xl shadow-3d-red transition-all hover:scale-105">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

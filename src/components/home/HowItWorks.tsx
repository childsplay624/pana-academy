import { motion } from "framer-motion";
import { BookOpen, Video, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const howItWorksSteps = [
    {
      number: "1",
      title: "Choose Your Path",
      description: "Browse 200+ expert courses across 8 specializations tailored to your career goals",
      icon: BookOpen,
    },
    {
      number: "2",
      title: "Learn & Practice",
      description: "Engage with video lessons, live sessions, and hands-on projects guided by industry experts",
      icon: Video,
    },
    {
      number: "3",
      title: "Get Certified",
      description: "Earn industry-recognized credentials and advance your career with our job placement support",
      icon: Award,
    },
  ];

  return (
    <section className="py-20 bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How PANA Academy Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your journey to career excellence in 3 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white text-2xl font-bold rounded-full mb-6">
                  {step.number}
                </div>

                {/* Icon */}
                <Icon className="w-12 h-12 text-red-600 mx-auto mb-4" />

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* Connector Arrow (except for last step) */}
                {index < howItWorksSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-6 w-8 h-8 text-gray-300" />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/courses">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

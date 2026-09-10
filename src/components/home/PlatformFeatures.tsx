import { motion } from "framer-motion";
import { Video, Download, Smartphone, MessageSquare, CheckCircle, Target } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

export function PlatformFeatures() {
  const platformFeatures = [
    {
      icon: Video,
      title: "Live Instructor Sessions",
      description: "Interactive classes with real-time Q&A and expert guidance",
    },
    {
      icon: Download,
      title: "Downloadable Resources",
      description: "Access course materials, templates, and tools offline anytime",
    },
    {
      icon: Smartphone,
      title: "Mobile App Access: Coming Soon",
      description: "Learn on-the-go with our iOS and Android mobile applications",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with peers, share insights, and collaborate on projects",
    },
    {
      icon: CheckCircle,
      title: "Lifetime Access",
      description: "Unlimited access to all course materials and future updates",
    },
    {
      icon: Target,
      title: "Career Support",
      description: "Resume reviews, interview prep, and job placement assistance",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Platform Excellence</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Why Choose PANA Institute
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive learning platform built for operational performance and global certification
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card3D key={index} intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.12)">
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-3d-glass hover:shadow-3d-dark transition-all duration-300 border border-gray-200/80 h-full preserve-3d">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-sm translate-z-10">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 translate-z-10">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm translate-z-10">{feature.description}</p>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}

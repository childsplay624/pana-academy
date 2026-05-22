import { motion } from "framer-motion";
import { Video, Download, Smartphone, MessageSquare, CheckCircle, Target } from "lucide-react";

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose PANA Academy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive learning platform built for your success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <Icon className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

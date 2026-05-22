import { motion } from "framer-motion";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";

export function HomeStats() {
  const stats = [
    { value: "200+", label: "Trained Professionals", icon: Users },
    { value: "200+", label: "Expert Courses", icon: BookOpen },
    { value: "95%", label: "Success Rate", icon: TrendingUp },
    { value: "50+", label: "Industry Partners", icon: Award },
  ];

  return (
    <section className="py-12 bg-white border-b relative z-20" style={{ marginTop: '-4rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

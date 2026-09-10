import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@/components/ui/FontAwesomeIcon";
import { Card3D } from "@/components/ui/Card3D";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numericTarget = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeOutProgress * numericTarget);

      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, numericTarget, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HomeStats() {
  const stats = [
    { value: "200+", label: "Trained Professionals", icon: "fa-solid fa-user-graduate", glow: "rgba(220, 38, 38, 0.15)" },
    { value: "200+", label: "Expert Courses", icon: "fa-solid fa-book-open", glow: "rgba(245, 158, 11, 0.15)" },
    { value: "95%", label: "Success Rate", icon: "fa-solid fa-chart-line", glow: "rgba(16, 185, 129, 0.15)" },
    { value: "50+", label: "Industry Partners", icon: "fa-solid fa-award", glow: "rgba(37, 99, 235, 0.15)" },
  ];

  return (
    <section className="relative z-20 py-8 bg-transparent" style={{ marginTop: '-4.5rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-3d-dark border border-white/60 p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              return (
                <Card3D key={index} intensity={12} depth={15} glowColor={stat.glow}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-center flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm h-full preserve-3d"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/80 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-sm text-2xl translate-z-10">
                      <FontAwesomeIcon name={stat.icon} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight translate-z-10">
                      <AnimatedCounter value={stat.value} duration={2.2} />
                    </h3>
                    <p className="text-sm font-medium text-gray-600 translate-z-10">{stat.label}</p>
                  </motion.div>
                </Card3D>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

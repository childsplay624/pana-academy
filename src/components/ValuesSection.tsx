import { motion } from "framer-motion";
import { useSiteImage } from "@/hooks/useSiteImage";

const ValuesSection = () => {
  // Fetch values images from centralized system
  const { imageUrl: sandsImage } = useSiteImage('values_sands');
  const { imageUrl: maximsImage } = useSiteImage('values_maxims');

  const values = [
    {
      title: "Our Core Values",
      description: "",
      image: sandsImage
    },
    {
      title: "Our 5 Operating Maxims",
      description: "",
      image: maximsImage
    }
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-pana-navy mb-6 tracking-tight">
              The Principles That Guide Us
            </h2>
            <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-24">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="relative group"
            >
              {/* Animated Glowing Backdrop */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pana-navy to-red-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-gradient-xy"></div>
              
              <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                {/* Header Strip */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8 md:p-10 text-center relative overflow-hidden">
                  <h3 className="relative z-10 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    {value.title}
                  </h3>
                </div>

                {/* Graphic Container */}
                <div className="p-6 md:p-12 flex items-center justify-center bg-gray-50/30 group-hover:bg-gray-50/50 transition-colors duration-500">
                  {value.image ? (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full flex justify-center"
                    >
                      <img
                        src={value.image}
                        alt={value.title}
                        className="w-full max-w-4xl h-auto drop-shadow-xl"
                        loading="lazy"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <span className="text-3xl font-bold text-gray-400">{value.title.charAt(0)}</span>
                      </div>
                      <p className="text-sm font-medium">Graphic loading...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;

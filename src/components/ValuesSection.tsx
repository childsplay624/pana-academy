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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Principles that guide our Operations</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-transparent hover:border-red-500"
              >
                <div className="w-full h-64 overflow-hidden relative group">
                  <div className="absolute inset-0 overflow-hidden">
                    {value.image ? (
                      <img
                        src={value.image}
                        alt={value.title}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 ease-in-out transform group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl font-bold">{value.title.charAt(0)}</span>
                          </div>
                          <p className="text-sm">{value.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function OurJourney() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Link 
              to="#about" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/#about';
              }}
              className="inline-flex items-center text-blue-300 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to About
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Our <span className="text-yellow-400">Journey</span> So Far
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl">
              From vision to impact: Charting PANA Academy's path in transforming the energy sector through competency development.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Floating Cards Section */}
        <div className="relative mb-24">
          {/* Background Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-20 left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          
          {/* Main Content Grid */}
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-600 transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="w-12 h-1 bg-blue-600 mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Foundation</h3>
              <p className="text-gray-600">
                PANA Academy Limited, a competency cultivation hub and subsidiary of PANA Holdings Group, began with a bold vision to close critical in-country competency gaps in the oil and gas industry and empower a new generation of professionals. The focus is on practical, transformative training based on international best practices. Our journey so far is one of growth, impact and transformation of trainees into professional workforce driving excellence across the energy value chain.
              </p>
            </motion.div>

            {/* Growth Card */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-yellow-500 transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="w-12 h-1 bg-yellow-500 mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Growth</h3>
              <p className="text-gray-600">
                PANA Academy has become a trusted training provider for the oil and gas industry. Our training programmes encompass craftsmanship, technician, specialist, professional, engineering, and digital courses designed for school leavers, undergraduates, graduates, and professionals. We leverage our team of certified facilitators, industry experts, subject mater experts, and strategic partnerships to develop a workforce pipeline equipped with role-specific skills.
              </p>
            </motion.div>

            {/* Impact Card */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-600 transform transition-all hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="w-12 h-1 bg-red-600 mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Impact</h3>
              <p className="text-gray-600">
                The journey so far has been marked by measurable competency cultivation achievements reflecting our unwavering commitment to training for performance, prevention, and sustainability. Our footprint is recognized not only for the competences/skills we cultivate, but also for the values we instill- trust, transparency, character, and commitment. As we look ahead, our journey continues with a clear mission to be the leading catalyst for competency development in the energy sector.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white py-16 mt-24 rounded-2xl overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '1000+', label: 'Trained Professionals' },
                { number: '50+', label: 'Industry Experts' },
                { number: '20+', label: 'Training Programs' },
                { number: '10+', label: 'Years of Excellence' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Guiding Principles</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌟',
                title: 'Excellence',
                description: 'Delivering world-class training that meets international standards and industry best practices.'
              },
              {
                icon: '💡',
                title: 'Innovation',
                description: 'Continuously evolving our programs to address emerging industry needs and technological advancements.'
              },
              {
                icon: '🌍',
                title: 'Impact',
                description: 'Creating measurable, positive change in the lives of our trainees and the industries they serve.'
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full opacity-30 -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 -z-10"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Join Our Growing Community of Professionals
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Be part of our mission to transform the energy sector through competency development and professional excellence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/courses" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-center"
                >
                  Explore Our Programs
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 border-2 border-gray-200 rounded-lg transition-colors duration-200 inline-block text-center"
                >
                  Get In Touch
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

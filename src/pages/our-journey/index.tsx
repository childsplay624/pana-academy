import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { useSiteImage } from "@/hooks/useSiteImage";
import { ChevronLeft } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function OurJourney() {
  // Fetch header image from centralized system
  const { imageUrl: headerImage } = useSiteImage('header_team');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-grow pt-20">
        {/* Hero Section with Header Image */}
        <section className="relative w-full py-20 md:py-28 overflow-hidden bg-zinc-950 text-white min-h-[440px] md:min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            {headerImage ? (
              <img
                src={headerImage}
                alt="Our Journey"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-gold"></div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-900/85 to-red-950/80"></div>
          
          {/* Animated elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pana-gold/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider bg-red-600/30 text-red-200 border border-red-500/40 mb-4 uppercase">
                Our Institute · Our Journey
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                From Academy to Institute
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                PANA Institute grew from a corporate training arm into a centre of excellence with a broader remit across competency assessment and development, applied research, consultancy, global engagement, and sustainability.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="#evolution-journey"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  View Timeline
                </a>
                <Link
                  to="/contact"
                  className="bg-transparent hover:bg-white/20 text-white font-medium py-3 px-8 border-2 border-white/30 rounded-lg transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Floating Cards Section */}
          <div className="relative mb-24">
            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-20 left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            {/* Main Content Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vision Card */}
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-600 transform transition-all hover:scale-102"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="w-12 h-1 bg-blue-600 mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Foundation</h3>
                <p className="text-gray-600">
                  Set up as the training and capability development arm of PANA Holdings, delivering technical and professional programmes aligned with corporate objectives.
                </p>
              </motion.div>

              {/* Growth Card */}
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-500 transform transition-all hover:scale-102"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="w-12 h-1 bg-red-500 mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Regional Reach</h3>
                <p className="text-gray-600">
                  Operating across two locations, Port Harcourt and Abuja, giving the Academy regional reach and a permanent institutional base.
                </p>
              </motion.div>

              {/* Impact Card */}
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-600 transform transition-all hover:scale-102"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="w-12 h-1 bg-red-600 mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Excellence</h3>
                <p className="text-gray-600">
                  Elevated to Institute status, taking on competency assessment and cultivation, applied research, international partnerships, consulting and sustainability under ISO 21001:2025 guidelines.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="bg-gradient-to-r from-red-700 to-red-900 text-white py-16 rounded-2xl overflow-hidden mb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: '2023', label: 'Founded' },
                  { number: '2', label: 'Centres (Abuja & PH)' },
                  { number: 'ISO 21001', label: 'Integrated Management' },
                  { number: '4+', label: 'Strategic Pillars' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-white opacity-90">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Creative Timeline Section */}
          <div id="evolution-journey" className="relative overflow-hidden py-20 bg-gradient-to-br from-red-50 to-gray-50">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-100 rounded-full opacity-20"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-100 rounded-full opacity-30"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Our <span className="text-red-600">Evolution</span> Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Charting the milestones that shaped PANA Institute's path to excellence
                </p>
                <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-500 mx-auto mt-6 rounded-full"></div>
              </motion.div>

              <div className="relative">
                {/* Animated timeline line */}
                <div className="absolute left-1/2 h-[calc(100%-100px)] w-0.5 bg-gradient-to-b from-red-200 to-red-200 transform -translate-x-1/2 top-12">
                  <motion.div
                    className="h-0 w-full bg-gradient-to-b from-red-600 to-red-600"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>

                <div className="space-y-32">
                  {/* STAGE 1: 2023 FOUNDED */}
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="md:flex items-center">
                      <div className="hidden md:block md:w-1/2 pr-12">
                        <div className="relative">
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-lg"></div>
                          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-102">
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                              2023 · FOUNDED
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">The capability arm</h3>
                            <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-200 mb-4"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              Set up as the training and capability development arm of PANA Holdings, delivering technical and professional programmes aligned with corporate objectives.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
                        <div className="bg-gradient-to-br from-red-600 to-red-800 p-1 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-white">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold">Foundation & Launch</h3>
                            </div>
                            <p className="text-red-100 leading-relaxed">
                              Establishing the baseline for technical competence across core energy and industrial disciplines.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* STAGE 2: REACH */}
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="md:flex md:flex-row-reverse items-center">
                      <div className="md:w-1/2 pl-12">
                        <div className="relative">
                          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-lg"></div>
                          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-102">
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                              REACH
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Regional presence</h3>
                            <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-200 mb-4"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              Operating across two locations, Port Harcourt and Abuja, giving the Academy regional reach and a permanent institutional base.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 pr-12 mt-8 md:mt-0">
                        <div className="bg-gradient-to-br from-red-600 to-red-800 p-1 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-white">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold">Institutional Footprint</h3>
                            </div>
                            <p className="text-red-100 leading-relaxed">
                              Expanding physical infrastructure and live-plant simulation hubs across key geopolitical and industrial regions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* STAGE 3: MANDATE */}
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="md:flex items-center">
                      <div className="md:w-1/2 pr-12">
                        <div className="relative">
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-red-500 border-4 border-white shadow-lg"></div>
                          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-102">
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                              MANDATE
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">A broadened mandate</h3>
                            <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-200 mb-4"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              Elevated to Institute status, taking on competency assessment and cultivation, applied research, international partnerships, consulting and sustainability.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 pl-12 mt-8 md:mt-0">
                        <div className="bg-gradient-to-br from-red-500 to-red-700 p-1 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-white">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold">Elevated Authority</h3>
                            </div>
                            <p className="text-red-100 leading-relaxed">
                              Transforming into an independent competency benchmark body for global energy, tech, and public governance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* STAGE 4: 2026 POSITIONED */}
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="md:flex md:flex-row-reverse items-center">
                      <div className="md:w-1/2 pl-12">
                        <div className="relative">
                          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 border-4 border-white shadow-lg"></div>
                          <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-102">
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                              2026 · POSITIONED
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">A centre of excellence</h3>
                            <div className="h-1 w-16 bg-gradient-to-r from-red-400 to-red-200 mb-4"></div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              PANA Institute now serves industry, government and community across Africa and beyond, working to one integrated management system aligned to ISO 21001:2025.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/2 pr-12 mt-8 md:mt-0">
                        <div className="bg-gradient-to-br from-red-600 to-red-800 p-1 rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-[1.02]">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-white">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold">Global Benchmark</h3>
                            </div>
                            <p className="text-red-100 leading-relaxed">
                              Operating to one unified integrated management system certified against ISO 21001:2025 standard guidelines.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Animated scroll indicator */}
                <motion.div
                  className="mt-20 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  viewport={{ once: true }}
                >

                </motion.div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="max-w-6xl mx-auto py-16 md:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Guiding Principles</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  title: 'Purpose for Sustainable Enterprise',
                  description: 'We align transformation initiatives to long-term enterprise sustainability, resilience, and measurable value creation.'
                },
                {
                  number: '02',
                  title: 'Philosophy, Process with Technology',
                  description: 'We combine disciplined transformation philosophy and structured processes with intelligent technology enablement to ensure clarity, control, and operational impact.'
                },
                {
                  number: '03',
                  title: 'Products, Platforms, Solutions & Services',
                  description: 'We develop and deploy integrated digital platforms and solutions that address industry-specific operational and regulatory challenges.'
                },
                {
                  number: '04',
                  title: 'People, Passion, Talent with Performance',
                  description: 'We bring together sector expertise, execution discipline, and a culture of accountability to deliver transformation at scale.'
                },
                {
                  number: '05',
                  title: 'Profit & Prosperity for Employees, Stakeholders & Shareholders',
                  description: 'We design transformation models that generate sustainable value and shared prosperity across the enterprise ecosystem.'
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-left relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="text-3xl font-black text-red-600 mb-3">{value.number}.</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
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
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-100 rounded-full opacity-30 -z-10"></div>
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
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block text-center"
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
      </main>
      <Footer />
    </div>
  );
}

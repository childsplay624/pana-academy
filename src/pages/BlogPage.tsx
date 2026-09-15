import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, FileText, ExternalLink, ArrowRight, Download, 
  BookOpen, ShieldCheck, Image as ImageIcon, Newspaper, Images
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import heroTraining from '@/assets/hero-training.jpg';
import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.toLowerCase();
  const isMediaPage = currentPath === '/media';
  const isNewsPage = currentPath === '/news' || currentPath === '/blog';
  const isResourcesPage = currentPath === '/resources';

  const mediaPosts = posts.filter(p => p.category === 'media');
  const newsPosts = posts.filter(p => p.category === 'news' || !p.category);
  const resourcesPosts = posts.filter(p => p.category === 'resources');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPublishedPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine metadata & hero copy based on the current page
  const pageMeta = isMediaPage
    ? {
        title: "Media & Trainee Gallery | PANA Institute",
        desc: "Photography and records from technical and competency programmes delivered across Nigeria's energy sector on live equipment.",
        badge: "PANA Institute Media",
        heroTitle: "Media & Visual",
        heroHighlight: "Records",
        heroDesc: "Photography and documentary records from programmes delivered across Nigeria's energy and power industries: real programmes, real trainees, real work on live equipment."
      }
    : isResourcesPage
    ? {
        title: "Resources, Governance & Policies | PANA Institute",
        desc: "Institutional documentation, governance policies, compliance manuals, and brand communication assets.",
        badge: "PANA Institute Resources",
        heroTitle: "Institutional",
        heroHighlight: "Resources",
        heroDesc: "Official governance policies, institutional documentation, compliance standards, and communications assets for partners and clients."
      }
    : {
        title: "News, Press & Insights | PANA Institute",
        desc: "Latest news, milestone releases, and operational insights from PANA Institute.",
        badge: "PANA Institute Newsroom",
        heroTitle: "News &",
        heroHighlight: "Insights",
        heroDesc: "Operational updates, strategic milestones, industry partnerships, and articles from across the Institute and its faculties."
      };

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.desc} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Dedicated Hero Section */}
          <section className="bg-zinc-950 text-white pt-36 pb-20 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/80 to-zinc-950 pointer-events-none" />
            <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                {pageMeta.badge}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
                {pageMeta.heroTitle} <span className="text-red-600">{pageMeta.heroHighlight}</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
                {pageMeta.heroDesc}
              </p>
            </div>
          </section>

          {/* ======================= MEDIA PAGE CONTENT ======================= */}
          {isMediaPage && (
            <section id="media" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Visual Documentation</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Programme & Facility Gallery</h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Experiential training on live plant equipment, valve testing facilities, calibration laboratories, and site inspections.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Gallery 01 */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="h-60 relative overflow-hidden bg-zinc-900">
                      <img 
                        src={heroSlide1} 
                        alt="Project based HCD, PE Energy and Chevron" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Field Training
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        Project-Based HCD, PE Energy & Chevron
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Fifty trainees on the Makaraba Utonana gas flare project, covering valve assembly and testing, flow drives, and hydraulics, including visits to the Afam power plant.
                      </p>
                    </div>
                  </div>

                  {/* Gallery 02 */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="h-60 relative overflow-hidden bg-zinc-900">
                      <img 
                        src={heroTraining} 
                        alt="PIDWAL and TotalEnergies HCD" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Laboratory Workshop
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        PIDWAL & TotalEnergies HCD
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Hands-on instruction at the Port Harcourt center, including industrial flow measurement training delivered by original equipment measurement specialists.
                      </p>
                    </div>
                  </div>

                  {/* Gallery 03 */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="h-60 relative overflow-hidden bg-zinc-900">
                      <img 
                        src={heroSlide3} 
                        alt="Assessment on site" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Live Assessment
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        On-Site Competency Assessment
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Independent competency assessment witnessed and certified on-site by Chevron and NCDMB at the Institute's specialized Port Harcourt facility.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Published Media Activities & Galleries from Admin */}
                {mediaPosts.length > 0 && (
                  <div className="pt-16 mt-16 border-t border-gray-200">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-2 flex items-center justify-center gap-1.5">
                        <Images className="w-4 h-4" /> Activity Photo Albums & Gallery
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Media Activities & Photo Galleries</h3>
                      <p className="text-sm text-gray-600">High-resolution photographic documentation, live equipment exercises, graduations, and trainee activity galleries.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {mediaPosts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card 
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-200 group flex flex-col bg-white"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            <div className="h-56 overflow-hidden relative bg-zinc-900">
                              {post.cover_image ? (
                                <img 
                                  src={post.cover_image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-zinc-900 text-white">
                                  PANA Media
                                </div>
                              )}
                              <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                Media Activity
                              </span>

                              {post.gallery && post.gallery.length > 0 && (
                                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                                  <Images className="w-3.5 h-3.5 text-blue-400" />
                                  {post.gallery.length} Photos
                                </span>
                              )}
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1 text-blue-600" />
                                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h4>
                              
                              <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                {post.excerpt || 'View media gallery and photographic field documentation...'}
                              </p>

                              {/* Gallery Filmstrip Preview */}
                              {post.gallery && post.gallery.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-3 mb-4 border-t border-gray-100">
                                  {post.gallery.slice(0, 4).map((thumb, tIdx) => (
                                    <div key={tIdx} className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                  {post.gallery.length > 4 && (
                                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                      +{post.gallery.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              <div className="mt-auto pt-3 border-t border-gray-100">
                                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 uppercase tracking-wider inline-flex items-center">
                                  Explore Activity Gallery <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ======================= NEWS PAGE CONTENT ======================= */}
          {isNewsPage && (
            <section id="news" className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Institutional Updates</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest News & Press</h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Announcements, project completions, and strategic partnership developments across our competency network.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {/* Item 01 */}
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-red-600 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">2026 Milestone</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">PANA Academy Evolves to PANA Institute</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      The Academy is formally elevated to Institute status with a broadened continental mandate across competency assessment and development, applied research, consultancy, sustainability, and global engagement.
                    </p>
                  </div>

                  {/* Item 02 */}
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Strategic Partnership</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">DigitalEnergy Asia Joins Partner Network</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      An advanced upstream oil and gas digital curriculum is integrated into executive training delivery, extending institutional collaboration into Southeast Asia.
                    </p>
                  </div>

                  {/* Item 03 */}
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-emerald-600 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Programme Completion</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Chevron HCD Gas Flare Project Concluded</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      The multi-month Human Capital Development programme for the Makaraba Utonana gas flare initiative is successfully delivered and assessed on-site.
                    </p>
                  </div>
                </div>

                {/* Published Articles from Database */}
                {newsPosts.length > 0 && (
                  <div className="pt-12 border-t border-gray-200">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Published Press & Insights</h3>
                      <p className="text-sm text-gray-600">Thought leadership and official press releases from Institute specialists.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {newsPosts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card 
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-200 group flex flex-col bg-white"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            <div className="h-52 overflow-hidden relative bg-gray-100">
                              {post.cover_image ? (
                                <img 
                                  src={post.cover_image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-zinc-900 text-white">
                                  PANA Institute
                                </div>
                              )}
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1 text-red-600" />
                                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h4>
                              
                              <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                {post.excerpt || 'Read the full coverage and technical insights...'}
                              </p>
                              
                              <div className="mt-auto pt-4 border-t border-gray-100">
                                <span className="text-xs font-bold text-red-600 group-hover:text-red-700 uppercase tracking-wider inline-flex items-center">
                                  Read Article <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ======================= RESOURCES PAGE CONTENT ======================= */}
          {isResourcesPage && (
            <section id="resources" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Institutional Material</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Governance, Documents & Media Assets</h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Official compliance frameworks, governance codes, and brand kits available for institutional partners and the press.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Resource 01 - Policies */}
                  <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-red-600 transition-colors">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Governance</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        Policies & Compliance
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        The Institute's policy library, including health, safety, environmental protocols, ethics, and anti-bribery governance material.
                      </p>
                    </div>
                    <a href="mailto:info@pana-institute.com?subject=Policy%20Resource%20Request" className="no-underline">
                      <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold">
                        Request Policy Access
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>

                  {/* Resource 02 - Marcomms / Media Kit */}
                  <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-red-600 transition-colors">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Brand & Press</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Marcomms Media Kit
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        Official brand guidelines, approved vector wordmarks, corporate typography, executive photos, and fact sheets for accredited journalists.
                      </p>
                    </div>
                    <a href="mailto:info@pana-institute.com?subject=Marcomms%20Media%20Assets%20Request" className="no-underline">
                      <Button variant="outline" className="w-full border-zinc-900 text-zinc-900 hover:bg-zinc-100 font-semibold">
                        Request Media Kit
                        <Download className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>

                  {/* Resource 03 - Programme Directory */}
                  <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-red-600 transition-colors">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Curriculum</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Curriculum Catalog
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        Complete competency frameworks, syllabus structures, and ISO 21001-aligned learning outcomes across all 13 training categories.
                      </p>
                    </div>
                    <a href="/courses" className="no-underline">
                      <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 font-semibold">
                        Browse Course Syllabus
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Published Institutional Documents & Policies from Admin */}
                {resourcesPosts.length > 0 && (
                  <div className="pt-16 mt-16 border-t border-gray-200">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-2">Policy & Document Library</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Published Policies & Documents</h3>
                      <p className="text-sm text-gray-600">Official institutional documentation, governance standards, and operational guidelines.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {resourcesPosts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card 
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-200 group flex flex-col bg-white"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                          >
                            {post.cover_image ? (
                              <div className="h-52 overflow-hidden relative bg-gray-100">
                                <img 
                                  src={post.cover_image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                  Policy / Document
                                </span>
                              </div>
                            ) : (
                              <div className="p-6 pb-2 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                  Official Document
                                </span>
                              </div>
                            )}
                            <CardContent className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1 text-emerald-600" />
                                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h4>
                              
                              <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                {post.excerpt || 'Read official policy guidelines, documentation and regulatory compliance information...'}
                              </p>
                              
                              <div className="mt-auto pt-4 border-t border-gray-100">
                                <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 uppercase tracking-wider inline-flex items-center">
                                  Read Document & Policy <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

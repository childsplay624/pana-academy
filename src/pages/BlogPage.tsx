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
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.25] pb-2">
                {pageMeta.heroTitle} <span className="text-red-600">{pageMeta.heroHighlight}</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
                {pageMeta.heroDesc}
              </p>
            </div>
          </section>

          {/* ======================= MEDIA PAGE CONTENT ======================= */}
          {isMediaPage && (
            <section id="media" className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {mediaPosts.length > 0 ? (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                      <div>
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                          <Images className="w-4 h-4" /> Activity Photo Albums & Gallery
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          Media Activities & Photo Records
                        </h2>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Showing {mediaPosts.length} published {mediaPosts.length === 1 ? 'record' : 'records'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {mediaPosts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
                    <Images className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Media Posts Published Yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Media activities, field training photos, and gallery records will appear here once published from the dashboard.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ======================= NEWS PAGE CONTENT ======================= */}
          {isNewsPage && (
            <section id="news" className="py-16 sm:py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {newsPosts.length > 0 ? (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                      <div>
                        <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                          <Newspaper className="w-4 h-4" /> Official Press Releases & Insights
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          News, Milestone Releases & Industry Insights
                        </h2>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Showing {newsPosts.length} published {newsPosts.length === 1 ? 'article' : 'articles'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {newsPosts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                              <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                News & Press
                              </span>
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
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                    <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No News Articles Published Yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Official announcements, articles, and milestones will be displayed here once published.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ======================= RESOURCES PAGE CONTENT ======================= */}
          {isResourcesPage && (
            <section id="resources" className="py-16 sm:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {resourcesPosts.length > 0 ? (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                      <div>
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                          <FileText className="w-4 h-4" /> Official Policies, Brochures & Documents
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          Resources & Governance Library
                        </h2>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Showing {resourcesPosts.length} published {resourcesPosts.length === 1 ? 'document' : 'documents'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {resourcesPosts.map((post, idx) => {
                        const hasPdf = !!post.pdf_url;
                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                    {hasPdf && (
                                      <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                                        <Download className="w-3 h-3" /> PDF
                                      </span>
                                    )}
                                  </div>
                                  <span className="absolute bottom-3 left-3 bg-zinc-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                    Policy / Document
                                  </span>
                                </div>
                              ) : (
                                <div className="p-6 pb-2 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                      Official Document
                                    </span>
                                  </div>
                                  {hasPdf && (
                                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                      <Download className="w-3 h-3" /> PDF
                                    </span>
                                  )}
                                </div>
                              )}
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1 text-emerald-600" />
                                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  {post.pdf_size && (
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px]">
                                      {post.pdf_size}
                                    </span>
                                  )}
                                </div>
                                
                                <h4 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                                  {post.title}
                                </h4>
                                
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                  {post.excerpt || 'Access official policy guidelines, documentation and regulatory compliance material...'}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                  <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 uppercase tracking-wider inline-flex items-center">
                                    {hasPdf ? 'View & Download PDF' : 'Read Document'} <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                                  </span>
                                  {hasPdf && (
                                    <a
                                      href={post.pdf_url}
                                      download
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                                      title="Direct PDF download"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Documents Published Yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Brochures, institutional policies, and compliance manuals will be listed here once published from the admin panel.
                    </p>
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

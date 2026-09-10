import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, FileText, Image as ImageIcon, Newspaper, ExternalLink, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-zinc-950 text-white pt-32 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider block">PANA Institute Hub</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Media and <span className="text-red-600">Resources</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
              Coverage, updates and reference material from across the Institute and its programmes.
            </p>

            {/* Sub-nav Pills */}
            <div className="flex justify-center gap-4 pt-6">
              <a href="#media" className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-lg">
                Media
              </a>
              <a href="#news" className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm border border-zinc-700 transition-colors">
                News
              </a>
              <a href="#resources" className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm border border-zinc-700 transition-colors">
                Resources
              </a>
            </div>
          </div>
        </section>

        {/* Section 01: Media */}
        <section id="media" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Media and Resources · Media</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Media</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Photography and record from programmes delivered across Nigeria's energy industry: real programmes, real trainees, real work on live equipment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Gallery 01 */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-56 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Gallery</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Project based HCD, PE Energy and Chevron</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Fifty trainees on the Makaraba Utonana gas flare project, across valve assembly and testing, flow drives and hydraulics, with a visit to the Afam power plant.
                  </p>
                </div>
              </div>

              {/* Gallery 02 */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-56 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Gallery</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">PIDWAL and TotalEnergies HCD</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hands on instruction at the Port Harcourt workshop, including flow measurement training led by an original equipment measurement expert.
                  </p>
                </div>
              </div>

              {/* Gallery 03 */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-56 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Gallery</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Assessment on site</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Programmes assessed on site by CNL and NCDMB at the Institute's Port Harcourt facility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: News */}
        <section id="news" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Media and Resources · News</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">News</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Item 01 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-red-600">
                <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">2026</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">PANA Academy becomes PANA Institute</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Academy is elevated to Institute status with a broadened mandate across competency assessment and development, research, consultancy, sustainability and global engagement.
                </p>
              </div>

              {/* Item 02 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-blue-600">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Partnership</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">DigitalEnergy Asia joins the partner network</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  An upstream oil and gas management curriculum is added to the executive training offering, extending reach into South East Asia.
                </p>
              </div>

              {/* Item 03 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm border-t-4 border-t-emerald-600">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Programme</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Chevron HCD gas flare project completed</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Human Capital Development programme for the Makaraba Utonana project is delivered and assessed on site.
                </p>
              </div>
            </div>

            {/* Dynamic Blog Posts from Database */}
            {posts.length > 0 && (
              <div className="pt-12 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Published Press & Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card 
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-100 group flex flex-col bg-white"
                        onClick={() => navigate(`/blog/${post.slug}`)}
                      >
                        <div className="h-56 overflow-hidden relative bg-gray-100">
                          {post.cover_image ? (
                            <img 
                              src={post.cover_image} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">
                              PANA Institute
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {post.excerpt || 'Read more about this article...'}
                          </p>
                          
                          <div className="mt-auto">
                            <span className="text-sm font-bold text-red-600 group-hover:text-red-700 uppercase tracking-widest inline-flex items-center">
                              Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
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

        {/* Section 03: Resources */}
        <section id="resources" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Media and Resources · Resources</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Resources</h2>
              <p className="text-lg text-gray-600">
                Institutional documentation, governance policies, and brand assets:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Resource 01 */}
              <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Resource</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Policies <ExternalLink className="w-5 h-5 text-red-600" />
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    The Institute's policy library, including governance, ethics and compliance material. Opens the policies resource.
                  </p>
                </div>
                <a href="mailto:info@pana-institute.com?subject=Policy%20Resource%20Request" className="no-underline">
                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold">
                    Access Policy Library
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Resource 02 */}
              <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Resource</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Marcomms</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Brand and communications assets: the logo, the wordmark, approved boilerplate, fact sheets and the media contact for press enquiries.
                  </p>
                </div>
                <a href="mailto:info@pana-institute.com?subject=Marcomms%20Media%20Assets%20Request" className="no-underline">
                  <Button variant="outline" className="w-full border-zinc-900 text-zinc-900 hover:bg-zinc-100 font-semibold">
                    Request Media Kit
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

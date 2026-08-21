import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <Navigation />
      <div className="flex-1 w-full">
        {/* Executive Dark Editorial Header */}
        <section className="bg-ink text-paper pt-36 pb-24 border-b border-zinc-800">
          <div className="max-w-[1320px] mx-auto px-7">
            <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
              THINK TANK · PUBLICATIONS & RESEARCH INSIGHTS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper mb-6">
              Publications, Policy & Research Commentary
            </h1>
            <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              Discover industry research, regulatory insights, and technical policy commentary from PANA Institute faculty and research directors.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7">
            {loading ? (
              <div className="flex justify-center p-20">
                <Loader2 className="w-12 h-12 animate-spin text-oxblood" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-paper-soft rounded-xs border border-line p-12">
                <h2 className="font-serif text-2xl font-bold text-ink mb-2">No publications yet</h2>
                <p className="font-serif text-sm text-muted-foreground">Check back soon for new research and technical policy commentary.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, idx) => (
                  <ScrollReveal key={post.id} direction="up" delay={idx * 0.08} className="h-full">
                    <div 
                      className="bg-paper border border-line rounded-xs overflow-hidden flex flex-col justify-between hover:border-oxblood/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full cursor-pointer"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div>
                        {/* Cover Image Canvas */}
                        <div className="aspect-[16/10] w-full overflow-hidden bg-ink relative">
                          {post.cover_image ? (
                            <img 
                              src={post.cover_image} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-serif italic text-lg">
                              PANA Institute Research
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-oxblood text-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs shadow-md">
                            PUBLICATIONS
                          </div>
                        </div>

                        {/* Article Card Content */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-2 font-mono text-[11px] text-brass uppercase font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-oxblood shrink-0" />
                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-tight group-hover:text-oxblood transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="font-serif text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt || 'Read full policy commentary and technical analysis...'}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Link */}
                      <div className="px-6 py-4 border-t border-line bg-paper-soft shrink-0 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-oxblood group-hover:text-oxblood-deep font-semibold inline-flex items-center gap-1.5">
                          Read Publication <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

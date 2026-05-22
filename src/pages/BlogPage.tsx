import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="flex-1">
        {/* Header */}
        <section className="bg-pana-navy text-white pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Blog & <span className="text-red-500">News</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest insights, news, and articles from PANA Academy.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-12 h-12 animate-spin text-red-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No articles yet</h2>
              <p className="text-gray-500">Check back later for exciting updates and news!</p>
            </div>
          ) : (
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
                          PANA Academy
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
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

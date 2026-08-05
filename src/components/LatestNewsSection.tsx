import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService, BlogPost } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LatestNewsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPublishedPosts();
      // Get only the 3 most recent posts
      setPosts(data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Failed to load latest news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show the section if there are no posts
  }

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              News & <span className="text-red-600">Insights</span>
            </h2>
            <p className="text-lg text-gray-600">
              Stay updated with the latest industry trends, expert insights, and PANA Institute news.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/blog')}
            >
              View All Articles <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

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
                <div className="h-48 overflow-hidden relative bg-gray-100">
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
                  
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed text-sm">
                    {post.excerpt || 'Read more about this article...'}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="text-sm font-bold text-red-600 group-hover:text-red-700 uppercase tracking-widest inline-flex items-center">
                      Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

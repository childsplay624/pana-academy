import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Calendar, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import 'react-quill/dist/quill.snow.css';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPostBySlug(slug!);
      if (data) {
        setPost(data);
      } else {
        navigate('/not-found', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/not-found', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Helmet>
        <title>{post.title} | PANA Institute</title>
        <meta name="description" content={post.excerpt || post.title} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>
      
      <Navigation />
      
      <div className="flex-1 pb-20">
        {/* Minimal Header if no cover, otherwise Cover Image Header */}
        {post.cover_image ? (
          <div className="w-full h-[50vh] md:h-[60vh] relative pt-20">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <div className="max-w-4xl text-center">
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">
                    {post.title}
                 </h1>
                 <div className="flex items-center justify-center gap-6 text-white/90 text-sm font-medium uppercase tracking-widest drop-shadow-md">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-32 pb-12 px-4 bg-gray-50 border-b border-gray-100">
             <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-pana-navy mb-6 leading-tight">
                    {post.title}
                 </h1>
                 <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                 </div>
              </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 md:mt-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8 text-gray-500 hover:text-pana-navy hover:bg-gray-100 -ml-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to articles
          </Button>
          
          <article 
            className="prose prose-lg md:prose-xl prose-red max-w-none 
                       prose-headings:font-bold prose-headings:text-pana-navy 
                       prose-a:text-red-600 hover:prose-a:text-red-700
                       prose-img:rounded-2xl prose-img:shadow-lg ql-editor"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

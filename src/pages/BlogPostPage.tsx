import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Calendar } from 'lucide-react';
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
      <div className="min-h-screen bg-paper flex flex-col text-ink">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-oxblood" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-paper flex flex-col text-ink font-serif">
      <Helmet>
        <title>{post.title} | PANA Institute</title>
        <meta name="description" content={post.excerpt || post.title} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>
      
      <Navigation />
      
      <div className="flex-1 pb-24">
        {/* Editorial Dark Header Banner */}
        <section className="bg-ink text-paper pt-36 pb-20 border-b border-zinc-800 relative overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-7 relative z-10">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 font-mono text-xs text-brass uppercase tracking-widest hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Publications & Commentary
            </button>

            <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
              PANA INSTITUTE RESEARCH · TECHNICAL POLICY COMMENTARY
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-paper leading-tight mb-6 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brass" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </section>

        {/* Optional Hero Image Banner */}
        {post.cover_image && (
          <div className="max-w-[1320px] mx-auto px-7 pt-12">
            <div className="aspect-[21/9] w-full overflow-hidden bg-ink rounded-xs border border-line shadow-lg">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-7 pt-12">
          <article 
            className="prose prose-lg md:prose-xl max-w-none text-ink leading-relaxed font-serif
                       prose-headings:font-serif prose-headings:font-normal prose-headings:text-ink 
                       prose-a:text-oxblood hover:prose-a:text-oxblood-deep
                       prose-img:rounded-xs prose-img:border prose-img:border-line ql-editor"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

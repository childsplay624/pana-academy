import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { blogService, BlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Loader2, Calendar, Images, X, Maximize2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import 'react-quill/dist/quill.snow.css';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !post?.gallery?.length) return;

      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! + 1) % post.gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! - 1 + post.gallery.length) % post.gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, post?.gallery]);

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

  const backRoute = post.category === 'media' ? '/media' : post.category === 'resources' ? '/resources' : '/news';
  const backLabel = post.category === 'media' ? 'Back to Media Gallery' : post.category === 'resources' ? 'Back to Resources & Policies' : 'Back to News & Press';
  const hasGallery = post.gallery && post.gallery.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Helmet>
        <title>{post.title} | PANA Institute</title>
        <meta name="description" content={post.excerpt || post.title} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>
      
      <Navigation />
      
      <div className="flex-1 pb-20">
        {/* Header with Cover Image or Minimal Header */}
        {post.cover_image ? (
          <div className="w-full h-[50vh] md:h-[60vh] relative pt-20">
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <div className="max-w-4xl text-center space-y-4">
                <div className="inline-flex items-center gap-2">
                  <Badge className="bg-red-600/90 hover:bg-red-600 text-white uppercase tracking-wider text-xs font-bold px-3 py-1">
                    {post.category === 'media' ? 'Media & Gallery' : post.category === 'resources' ? 'Resources & Policies' : 'News & Press'}
                  </Badge>
                  {hasGallery && (
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-blue-400" />
                      {post.gallery.length} Photos in Gallery
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight">
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
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="bg-white text-red-600 border-red-200 uppercase tracking-wider text-xs font-bold px-3 py-1">
                  {post.category === 'media' ? 'Media & Gallery' : post.category === 'resources' ? 'Resources & Policies' : 'News & Press'}
                </Badge>
                {hasGallery && (
                  <Badge variant="outline" className="bg-white text-blue-600 border-blue-200 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-blue-600" />
                    {post.gallery.length} Photos in Gallery
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-pana-navy leading-tight">
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
            onClick={() => navigate(backRoute)}
            className="mb-8 text-gray-500 hover:text-pana-navy hover:bg-gray-100 -ml-4 font-semibold text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
          
          <article 
            className="prose prose-lg md:prose-xl prose-red max-w-none 
                       prose-headings:font-bold prose-headings:text-pana-navy 
                       prose-a:text-red-600 hover:prose-a:text-red-700
                       prose-img:rounded-2xl prose-img:shadow-lg ql-editor"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        {/* Media Activity Photo Gallery Section */}
        {hasGallery && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Images className="w-4 h-4" /> Activity Photo Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Media Activity Gallery
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  High-resolution photo documentation from this event, site workshop, and participant activities ({post.gallery.length} photos).
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Click any photo to view in full screen
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {post.gallery.map((imgUrl, index) => (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`${post.title} photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                      <Maximize2 className="w-3.5 h-3.5" /> Photo #{index + 1}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Expand
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {lightboxIndex !== null && hasGallery && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">
                Photo {lightboxIndex + 1} of {post.gallery.length}
              </span>
              <span className="text-xs text-zinc-500 hidden sm:inline">| {post.title}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => setLightboxIndex(null)}
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Central Image with Navigation */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6" onClick={(e) => e.stopPropagation()}>
            {/* Prev Button */}
            {post.gallery.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 z-10 text-white bg-black/40 hover:bg-black/80 rounded-full h-12 w-12 border border-white/10"
                onClick={() => setLightboxIndex((lightboxIndex - 1 + post.gallery.length) % post.gallery.length)}
                title="Previous photo (Left arrow)"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}

            {/* Main Lightbox Image */}
            <div className="max-h-[75vh] max-w-5xl overflow-hidden rounded-xl shadow-2xl flex items-center justify-center">
              <img
                src={post.gallery[lightboxIndex]}
                alt={`Activity photo ${lightboxIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Next Button */}
            {post.gallery.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 z-10 text-white bg-black/40 hover:bg-black/80 rounded-full h-12 w-12 border border-white/10"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % post.gallery.length)}
                title="Next photo (Right arrow)"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}
          </div>

          {/* Bottom Filmstrip */}
          {post.gallery.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 z-10" onClick={(e) => e.stopPropagation()}>
              {post.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2 ${
                    idx === lightboxIndex ? 'border-red-500 scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Footer />
    </div>
  );
}

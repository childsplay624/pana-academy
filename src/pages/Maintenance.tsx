import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { useSiteImage } from '@/hooks/useSiteImage';
import { 
  RefreshCw, Lock, CheckCircle2, ArrowRight, Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Maintenance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Background image using provided URL with custom CMS override support
  const { imageUrl: customBg } = useSiteImage('maintenance_background');
  const bgImage = customBg || 'https://pana-institute.com/assets/hero-training-FMKqjiTQ.jpg';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribed(true);
    toast({
      title: "You're on the list",
      description: `We'll drop an email to ${email} as soon as we're back up.`,
    });
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const { data } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .maybeSingle();

      setTimeout(() => {
        setIsChecking(false);
        let isMaint = false;
        if (data?.value !== undefined) {
          const val = String(data.value).toLowerCase().replace(/^["']|["']$/g, '');
          isMaint = val === 'true' || val === '1';
        }

        if (!isMaint) {
          toast({
            title: "We are back online!",
            description: "Reloading your page...",
          });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast({
            title: "Still in maintenance",
            description: "Updates are wrapping up. Check back shortly.",
          });
        }
      }, 800);
    } catch {
      setTimeout(() => {
        setIsChecking(false);
        toast({
          title: "Maintenance in progress",
          description: "Systems are being updated as planned.",
        });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">
      
      {/* Background Image with Luminous Light Frosted Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={bgImage}
          alt="PANA Institute Facilities"
          className="w-full h-full object-cover object-center scale-105 filter blur-[3px]"
        />
        {/* Luminous light glass layer */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <Logo />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/auth')}
          className="text-xs text-slate-600 hover:text-slate-900 hover:bg-white/80 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-full px-4 py-1.5 transition-colors gap-1.5 shadow-sm"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Staff Login</span>
        </Button>
      </header>

      {/* Centerpiece Minimal Body */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-12 flex flex-col items-center text-center my-auto">
        
        {/* Floating Minimalist Card Container */}
        <div className="w-full bg-white/80 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-slate-900/5 rounded-3xl p-8 sm:p-12">
          


          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 mb-3 leading-tight">
            We're making things better.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
            Our platform is temporarily down for scheduled performance upgrades. All certificates and student records are safely stored.
          </p>

          {/* Minimalist Notify Form */}
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm hover:shadow transition-shadow mb-8 mx-auto">
            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-3 px-4 flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You'll be the first to know when we're live.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input 
                    type="email"
                    placeholder="Enter email to get notified..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 text-sm h-11 px-3 shadow-none"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium h-11 px-5 rounded-xl transition-all shadow-sm flex-shrink-0"
                  >
                    Notify me
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Clean Secondary Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="rounded-full text-xs font-medium text-slate-700 border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 h-9 gap-1.5 shadow-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isChecking ? 'animate-spin text-red-600' : ''}`} />
              <span>{isChecking ? 'Checking...' : 'Check again'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "mailto:support@pana-institute.com"}
              className="rounded-full text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 h-9 gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact support</span>
            </Button>
          </div>

        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 px-6 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          <span>© {new Date().getFullYear()} PANA Institute. All systems verified and secure.</span>
        </div>
        <div>
          <span>Questions? <a href="mailto:info@pana-institute.com" className="text-slate-700 hover:underline">info@pana-institute.com</a></span>
        </div>
      </footer>

    </div>
  );
}

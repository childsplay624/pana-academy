import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, Eye, EyeOff, Github, Linkedin } from 'lucide-react';
import { signInWithLinkedIn } from '@/lib/auth-utils';
import { useSiteImage } from '@/hooks/useSiteImage';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const { signIn, signUp, signInWithProvider, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch background image from database
  const { imageUrl: bgImage } = useSiteImage('auth_background');
  const { imageUrl: logoImage } = useSiteImage('logo_pana_why');

  // Redirect if already authenticated
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/dashboard');
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isLogin ? "Sign in failed" : "Sign up failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    const { error } = await signInWithProvider(provider);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen selection:bg-pana-red/30">
      {/* Left Side - Background with Image Overlay */}
      <div
        className="hidden md:flex md:w-5/12 lg:w-[45%] relative text-white p-6 md:p-10 flex-col min-h-screen animate-fade-in"
      >
        <div className="absolute inset-0 overflow-hidden">
          {bgImage ? (
            <img
              src={bgImage}
              className="w-full h-full object-cover scale-100"
              style={{ filter: 'brightness(0.5) contrast(1.05)' }}
              onError={(e) => {
                console.error('Background image failed to load:', bgImage);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-pana-navy via-pana-navy to-pana-red ${bgImage ? 'hidden' : ''}`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-pana-navy via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-pana-navy/10 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full max-w-lg mr-auto items-start text-left pb-20">
          <div className="mb-10 animate-float">
            <div className="relative inline-block">
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="PANA Academy"
                  className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  onError={(e) => {
                    console.error('Logo image failed to load:', logoImage);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`fallback-logo h-12 w-auto bg-gradient-to-r from-pana-red to-red-500 rounded-lg flex items-center justify-center px-4 shadow-lg ${logoImage ? 'hidden' : ''}`}>
                <span className="text-white font-black text-xl tracking-tighter">PANA</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight tracking-tight drop-shadow-sm">
              {isLogin ? 'Welcome Back' : 'Join Our Mission'}
              <span className="text-pana-red block mt-1 tracking-normal">to Excellence</span>
            </h1>
            <p className="text-white/70 mb-6 text-base md:text-lg font-normal leading-relaxed max-w-sm mr-auto">
              {isLogin
                ? 'Resume your mastery journey and access your advanced learning tools.'
                : 'Join an elite community and unlock your full potential today.'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-center text-[10px] text-white/30 tracking-[0.3em] font-bold uppercase">
          &copy; {new Date().getFullYear()} PANA Academy &bull; Quality Excellence
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-7/12 lg:w-[55%] p-4 md:p-8 flex items-center justify-center min-h-screen bg-[#fcfdfe] relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pana-red/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pana-navy/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <Card className="w-full max-w-[390px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] bg-white/90 backdrop-blur-md relative z-10 animate-slide-in-right">
          <CardHeader className="text-center space-y-3 pb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-pana-red to-red-800 rounded-xl flex items-center justify-center mx-auto mb-1 shadow-md shadow-pana-red/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                {isLogin ? 'Propel Your Growth' : 'Start Your Era'}
              </CardTitle>
              <CardDescription className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                {isLogin ? "New here? " : 'A member? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', fullName: '' });
                  }}
                  className="font-black text-pana-red hover:text-red-800 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Full Identity
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-pana-red transition-colors">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Admiral Nelson"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-9 h-10 text-sm border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-pana-red/30 transition-all font-medium"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Access Portal (Email)
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 h-10 text-sm border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-pana-red/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Security Key
                  </Label>
                  {isLogin && (
                    <Link
                      to="/reset-password"
                      className="text-[9px] font-bold text-pana-red hover:text-red-800 transition-colors uppercase tracking-wider"
                    >
                      Lost access?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 pr-9 h-10 text-sm border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-pana-red/30 transition-all font-medium"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 text-gray-400 hover:text-pana-red transition-colors" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-gray-400 hover:text-pana-red transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pana-navy to-pana-red hover:scale-[1.01] active:scale-[0.99] text-white font-bold h-11 transition-all shadow-lg shadow-pana-navy/10 uppercase tracking-widest text-[10px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing...
                  </span>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-50" />
                </div>
                <div className="relative flex justify-center text-[9px]">
                  <span className="bg-white px-3 text-gray-300 font-bold uppercase tracking-[0.2em]">
                    Social Access
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="bg-[#0077B5] hover:bg-[#006097] text-white hover:text-white border-0 font-bold h-10 text-[10px] transition-all shadow-sm"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await signInWithLinkedIn();
                    } catch (error) {
                      console.error('LinkedIn login error:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <Linkedin className="mr-1.5 h-3.5 w-3.5 fill-current" />
                  LinkedIn
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  className="bg-white hover:bg-gray-50 text-gray-700 font-bold h-10 text-[10px] transition-all shadow-sm border-gray-100"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <img src="/google-icon.svg" alt="Google" className="w-3.5 h-3.5 mr-1.5" />
                  Google
                </Button>
              </div>

              <Button
                variant="ghost"
                type="button"
                className="w-full mt-4 h-8 text-[9px] font-bold text-gray-400 hover:text-pana-navy transition-all uppercase tracking-[0.2em]"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                ← Return to Base
              </Button>
            </div>

            <p className="mt-6 text-center text-[9px] text-gray-400 leading-relaxed font-medium">
              BY JOINING, YOU AGREE TO OUR{' '}
              <Link to="/terms" className="text-pana-red hover:underline underline-offset-2">TERMS</Link>
              {' '}AND{' '}
              <Link to="/privacy" className="text-pana-red hover:underline underline-offset-2">PRIVACY</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
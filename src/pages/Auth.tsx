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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Background with Image Overlay */}
      <div 
        className="w-full md:w-1/2 relative text-white p-8 md:p-12 flex flex-col min-h-screen"
      >
        <div className="absolute inset-0">
          {bgImage ? (
            <img
              src={bgImage}
              alt="Authentication Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Background image failed to load:', bgImage);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-pana-navy to-pana-red ${bgImage ? 'hidden' : ''}`}></div>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full pb-12">
          <div className="mb-8">
            <div className="relative">
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="PANA Academy"
                  className="h-20 w-auto brightness-125 drop-shadow-lg"
                  onError={(e) => {
                    console.error('Logo image failed to load:', logoImage);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`fallback-logo h-20 w-auto bg-red-600 rounded-lg flex items-center justify-center ${logoImage ? 'hidden' : ''}`}>
                <span className="text-white font-bold text-xl">PANA</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isLogin ? 'Welcome back!' : 'Join us today'}
          </h1>
          <p className="text-pana-light-gray mb-8">
            {isLogin 
              ? 'Sign in to access your personalized learning dashboard and continue your journey.'
              : 'Create an account to unlock all features and start your learning journey with us.'}
          </p>         
        </div>
        
        <div className="text-center text-sm text-white/70 mt-8">
          &copy; {new Date().getFullYear()} PANA Academy. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-0 shadow-none md:shadow-md">
          <CardHeader className="text-center space-y-1">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', fullName: '' });
                }}
                className="font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  {isLogin && (
                    <Link 
                      to="/reset-password" 
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "••••••••" : "Create a password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-800 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-3 w-full">
                                
                <Button
                  variant="outline"
                  type="button"
                  className="w-full bg-[#0077B5] text-white hover:bg-[#006097] hover:text-white"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await signInWithLinkedIn();
                    } catch (error) {
                      console.error('LinkedIn login error:', error);
                      toast({
                        title: "Login Error",
                        description: "Failed to sign in with LinkedIn. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
                
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>
                
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full mt-3 text-sm font-medium text-black hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-500">
              By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
              <Link to="/terms" className="font-medium text-red-600 hover:text-red-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-red-600 hover:text-red-800">
                Privacy Policy
              </Link>.
            </p>
    </CardContent>
  </Card>
</div>
</div>
  );
}
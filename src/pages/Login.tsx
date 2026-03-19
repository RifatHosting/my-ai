import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/ui-custom/AnimatedBackground';
import { OrbitRing } from '@/components/ui-custom/OrbitRing';
import { LoadingSpinner } from '@/components/ui-custom/LoadingSpinner';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Title animation
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Orbit ring animation
      tl.fromTo(
        orbitRef.current,
        { opacity: 0, scale: 0.8, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1 },
        '-=0.5'
      );

      // Form card animation
      tl.fromTo(
        rightPanelRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8 },
        '-=0.6'
      );

      // Form elements stagger
      tl.fromTo(
        '.form-field',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.4'
      );

      // Buttons
      tl.fromTo(
        '.form-button',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Toggle animation
  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0.8, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [isLogin]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.email, formData.password, formData.name);
      }
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Panel - Branding */}
          <div ref={leftPanelRef} className="hidden lg:flex flex-col items-center justify-center">
            <div ref={titleRef} className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-white" />
                <span className="text-3xl font-display font-bold tracking-tight text-white">
                  Rifat AI
                </span>
              </div>
              <h1 className="text-5xl xl:text-6xl font-display font-bold text-white leading-tight mb-4">
                AI that builds
                <br />
                <span className="text-gradient">worlds.</span>
              </h1>
              <p className="text-rifat-gray-400 text-lg max-w-md mx-auto">
                Generate images, write, code, and iterate with a system designed for speed, control, and scale.
              </p>
            </div>
            
            <div ref={orbitRef} className="mt-4">
              <OrbitRing size={320} />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div ref={rightPanelRef} className="flex justify-center">
            <GlassCard 
              variant="strong" 
              className="w-full max-w-md p-8 shadow-2xl"
              glow
            >
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-white" />
                <span className="text-xl font-display font-bold text-white">Rifat AI</span>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold text-white mb-2">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-rifat-gray-400 text-sm">
                  {isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Sign up to start creating with AI'}
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="form-field space-y-2">
                    <Label htmlFor="name" className="text-white/80 text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 h-12 ${
                        errors.name ? 'border-red-500/50' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs">{errors.name}</p>
                    )}
                  </div>
                )}

                <div className="form-field space-y-2">
                  <Label htmlFor="email" className="text-white/80 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 h-12 ${
                      errors.email ? 'border-red-500/50' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email}</p>
                  )}
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="password" className="text-white/80 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 h-12 pr-10 ${
                        errors.password ? 'border-red-500/50' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs">{errors.password}</p>
                  )}
                </div>

                {isLogin && (
                  <div className="form-field flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-rifat-gray-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="form-button w-full h-12 bg-white text-rifat-black hover:bg-white/90 font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="form-button relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[rgba(11,11,11,0.85)] text-rifat-gray-400">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="form-button grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="h-11 bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-rifat-gray-400 text-sm">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="ml-2 text-white hover:underline font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import { OrbitRing } from '@/components/ui-custom/OrbitRing';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  Code,
  Mic,
  FileText,
  Zap,
  Check,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
      );

      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo(
        '.hero-orbit',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      // Scroll-triggered animations
      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Feature cards stagger
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: ImageIcon, title: 'Image Generation', desc: 'Photorealistic renders from text prompts' },
    { icon: MessageSquare, title: 'Intelligent Chat', desc: 'Context-aware answers with sources' },
    { icon: Code, title: 'Code Assistant', desc: 'Write, refactor, and debug faster' },
    { icon: Mic, title: 'Voice & Audio', desc: 'Transcribe, narrate, and translate' },
    { icon: FileText, title: 'Data Analysis', desc: 'Upload files. Get insights.' },
    { icon: Zap, title: 'Automation', desc: 'Connect workflows and run tasks' },
  ];

  const testimonials = [
    { text: 'RIFAT cut our asset time by 70%.', author: 'Aiko Tanaka', role: 'Creative Lead' },
    { text: 'The chat context feels like a senior teammate.', author: 'Leo Chen', role: 'Product Manager' },
    { text: 'We shipped a campaign in 48 hours.', author: 'Maya Patel', role: 'Marketing' },
  ];

  const pricing = [
    { name: 'Free', price: '$0', period: '/mo', features: ['Basic generation', 'Limited chats', 'Community support'], cta: 'Get started' },
    { name: 'Pro', price: '$20', period: '/mo', features: ['Priority speed', 'Unlimited chats', 'Image packs', 'API access'], cta: 'Start trial', popular: true },
    { name: 'Team', price: '$49', period: '/seat/mo', features: ['Collaboration', 'Admin controls', 'Priority support', 'Custom models'], cta: 'Contact sales' },
  ];

  return (
    <div className="min-h-screen bg-rifat-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-rifat-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rifat-black" />
              </div>
              <span className="text-white font-display font-semibold">RIFAT</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm">Features</a>
              <a href="#pricing" className="text-white/60 hover:text-white transition-colors text-sm">Pricing</a>
              <a href="#testimonials" className="text-white/60 hover:text-white transition-colors text-sm">Testimonials</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white/80 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-white text-rifat-black hover:bg-white/90 rounded-full px-5"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="hero-title">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rifat-gray-400 text-xs font-mono tracking-wider mb-6">
                  Rifat AI PLATFORM
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                  AI that builds
                  <br />
                  <span className="text-gradient">worlds.</span>
                </h1>
              </div>
              
              <p className="hero-subtitle text-rifat-gray-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
                Generate images, write, code, and iterate with a system designed for speed, control, and scale.
              </p>
              
              <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-white text-rifat-black hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold hover:shadow-glow transition-all hover:scale-105"
                >
                  Start creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-14 text-base"
                >
                  Watch demo
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                <div>
                  <p className="text-3xl font-display font-bold text-white">&lt;1.2s</p>
                  <p className="text-rifat-gray-400 text-sm">Avg. generation</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-white">99.99%</p>
                  <p className="text-rifat-gray-400 text-sm">Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-white">Free</p>
                  <p className="text-rifat-gray-400 text-sm">No API key</p>
                </div>
              </div>
            </div>

            {/* Right Content - Orbit */}
            <div className="hero-orbit hidden lg:flex justify-center items-center">
              <OrbitRing size={400} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Six engines. One canvas.
            </h2>
            <p className="text-rifat-gray-400 text-lg max-w-2xl mx-auto">
              Switch modes instantly. RIFAT adapts to the task without switching tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={i}
                  variant="default"
                  hover
                  className="feature-card p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-rifat-gray-400 text-sm">{feature.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section ref={showcaseRef} className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Generate the impossible.
              </h2>
              <p className="text-rifat-gray-400 text-lg mb-8">
                Describe a scene. RIFAT renders it in seconds—portraits, environments, concepts, variations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">No API key required</h4>
                    <p className="text-rifat-gray-400 text-sm">Start generating immediately. No setup, no credit card.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Unlimited generations</h4>
                    <p className="text-rifat-gray-400 text-sm">Create as many images as you want. No quotas, no limits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">High quality output</h4>
                    <p className="text-rifat-gray-400 text-sm">Get stunning 1024x1024 images with incredible detail.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-reveal">
              <GlassCard variant="strong" className="p-4 overflow-hidden">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="w-10 h-10 text-white/60" />
                    </div>
                    <p className="text-white/60 text-sm mb-2">Generated Output</p>
                    <p className="text-white text-lg font-medium">Neon-noir portrait series</p>
                    <p className="text-rifat-gray-400 text-sm mt-2">From a single prompt, iterated in real time</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Loved by teams
            </h2>
            <p className="text-rifat-gray-400 text-lg">
              From startups to enterprise studios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <GlassCard
                key={i}
                variant="default"
                hover
                className="scroll-reveal p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-white fill-white" />
                  ))}
                </div>
                <p className="text-white text-lg mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-rifat-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-rifat-gray-400 text-lg">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <GlassCard
                key={i}
                variant={plan.popular ? 'strong' : 'default'}
                hover
                className={cn(
                  'scroll-reveal p-6 relative',
                  plan.popular && 'border-white/30'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-white text-rifat-black text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-white font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-rifat-gray-400">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-rifat-gray-300 text-sm">
                      <Check className="w-4 h-4 text-white flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => navigate('/login')}
                  className={cn(
                    'w-full rounded-full',
                    plan.popular
                      ? 'bg-white text-rifat-black hover:bg-white/90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  )}
                >
                  {plan.cta}
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Start building today.
            </h2>
            <p className="text-rifat-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Create your free account. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-white text-rifat-black hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold hover:shadow-glow transition-all hover:scale-105"
              >
                Create free account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-14 text-base"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rifat-black" />
              </div>
              <span className="text-white font-display font-semibold">RIFAT</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-rifat-gray-400">
              <a href="#" className="hover:text-white transition-colors">Product</a>
              <a href="#" className="hover:text-white transition-colors">Solutions</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            
            <p className="text-rifat-gray-500 text-sm">
              © 2026 Rifat AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

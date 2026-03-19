import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ImageGenerator } from '@/components/image-gen/ImageGenerator';
import { GlassCard } from '@/components/ui-custom/GlassCard';
import {
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'chat' | 'image';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initial animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-sidebar',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.dashboard-content',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Tab change animation
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0.8, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [activeTab]);

  const tabs = [
    { id: 'chat' as Tab, label: 'AI Chat', icon: MessageSquare },
    { id: 'image' as Tab, label: 'Image Gen', icon: ImageIcon },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-rifat-black flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'dashboard-sidebar hidden lg:flex flex-col border-r border-white/10 bg-rifat-charcoal/50 backdrop-blur-xl transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-rifat-black" />
            </div>
            {sidebarOpen && (
              <span className="text-white font-display font-semibold">RIFAT</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/40 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-white text-rifat-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-white/10">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-white/5',
              !sidebarOpen && 'justify-center'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-rifat-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={logout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 mt-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-rifat-charcoal/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-rifat-black" />
          </div>
          <span className="text-white font-display font-semibold">RIFAT</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-rifat-black/95 backdrop-blur-xl z-40 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all',
                    activeTab === tab.id
                      ? 'bg-white text-rifat-black'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-rifat-gray-400 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:pt-0 pt-16">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div>
            <h1 className="text-white font-display font-semibold text-lg">
              {activeTab === 'chat' ? 'AI Chat' : 'Image Generator'}
            </h1>
            <p className="text-rifat-gray-400 text-xs">
              {activeTab === 'chat' 
                ? 'Have a conversation with AI' 
                : 'Create stunning images with AI'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Free API</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div 
          ref={contentRef} 
          className="flex-1 overflow-hidden p-4 lg:p-6"
        >
          <GlassCard 
            variant="strong" 
            className="h-full overflow-hidden"
          >
            {activeTab === 'chat' ? (
              <ChatInterface className="h-full" />
            ) : (
              <ImageGenerator className="h-full" />
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

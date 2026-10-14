import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { sendPanaAiMessage, ChatMessage } from '@/services/panaAiService';
import { 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const PanaAiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const getGreeting = () => {
    const role = profile?.role || 'visitor';
    if (role === 'admin') {
      return `Welcome, Administrator! I am **PANA AI**, your platform assistant. I can guide you through user management, course approvals, transactions, or system settings. What would you like to review?`;
    }
    if (role === 'student') {
      return `Hi ${profile?.full_name?.split(' ')[0] || 'there'}! I'm **PANA AI**, your personal co-instructor and academic guide. Ask me questions about course concepts, assignments, upcoming deadlines, or certificates!`;
    }
    if (role === 'instructor') {
      return `Welcome Instructor! I'm **PANA AI**. Need help with curriculum planning, quiz questions, or navigating student submissions? I'm here to assist.`;
    }
    return `Hello! I'm **PANA AI**, your intelligent guide to PANA Institute. Explore courses, discover certifications, understand training schedules, or ask for guidance around the platform!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: getGreeting(),
      timestamp: Date.now(),
    },
  ]);

  // Context-aware suggested prompts
  const getQuickSuggestions = () => {
    const role = profile?.role;
    const path = location.pathname;

    if (role === 'admin') {
      return [
        { label: 'Platform Users', query: 'How do I manage users and assign instructor roles?' },
        { label: 'Course Catalog', query: 'Where do I add and publish a new course?' },
        { label: 'Check Payments', query: 'Show me where to review payments and transactions.' },
      ];
    }
    if (role === 'student') {
      return [
        { label: 'My Courses', query: 'Take me to my enrolled courses.' },
        { label: 'Verify Certificate', query: 'How do I get and verify my course certificate?' },
        { label: 'Study Assistance', query: 'Can you help explain a technical engineering concept from my lessons?' },
      ];
    }
    if (role === 'instructor') {
      return [
        { label: 'Create Quiz', query: 'Give me ideas for a quiz on Industrial Instrumentation.' },
        { label: 'Course Dashboard', query: 'How do I view my students and assignments?' },
      ];
    }
    if (path.includes('/courses')) {
      return [
        { label: 'Recommend Course', query: 'Which course is best for a beginner in Energy Transition and Safety?' },
        { label: 'Certifications', query: 'Are PANA Institute certificates accredited and verifiable?' },
        { label: 'Delivery Formats', query: 'What training delivery formats does PANA Institute support?' },
      ];
    }
    return [
      { label: 'Browse Courses', query: 'What courses and engineering programs does PANA Institute offer?' },
      { label: 'Verify Certificate', query: 'How can I verify a PANA certificate?' },
      { label: 'Consulting Services', query: 'Tell me about PANA Institute consulting and R&D services.' },
    ];
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendPanaAiMessage({
        messages: [...messages, userMsg].map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        context: {
          role: (profile?.role as any) || (user ? 'student' : 'visitor'),
          userName: profile?.full_name || null,
          currentPath: location.pathname,
        },
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error getting response from PANA AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I apologize, but I encountered a momentary connection glitch. Please try asking again!",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: getGreeting(),
        timestamp: Date.now(),
      },
    ]);
  };

  // Helper to parse markdown links and render internal router navigation
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];

      const isInternal = linkUrl.startsWith('/') || linkUrl.startsWith(window.location.origin);
      const cleanPath = linkUrl.replace(window.location.origin, '');

      parts.push(
        <button
          key={match.index}
          onClick={() => {
            if (isInternal) {
              navigate(cleanPath);
              if (window.innerWidth < 768) {
                setIsOpen(false);
              }
            } else {
              window.open(linkUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors mx-1"
        >
          {linkText}
          {isInternal ? <ChevronRight className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
        </button>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <div className="space-y-2 whitespace-pre-wrap leading-relaxed text-sm">
        {parts.map((part, i) => {
          if (typeof part === 'string') {
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return (
              <span key={i}>
                {boldParts.map((subPart, j) => {
                  if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={j} className="font-semibold text-foreground">{subPart.slice(2, -2)}</strong>;
                  }
                  return subPart;
                })}
              </span>
            );
          }
          return part;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Classic Modern Round Floating Trigger */}
      {!isOpen && (
        <div className="relative group">
          {/* Subtle Outer Glow Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-70 blur-md group-hover:opacity-100 group-hover:scale-105 transition duration-500 animate-tilt" />

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500/30 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open PANA AI Chat"
          >
            {/* PANA AI Custom Avatar */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center p-1.5 shadow-inner border border-slate-200 dark:border-slate-700">
              <img
                src="/pana-ai-avatar.png"
                alt="PANA AI"
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                }}
              />
            </div>

            {/* Online Pulse Indicator */}
            <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>

            {/* Sparkle Icon Badge */}
            <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </button>

          {/* Hover Tooltip Capsule */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium backdrop-blur shadow-xl border border-white/10 whitespace-nowrap pointer-events-none transition-opacity duration-200">
            <span>Ask PANA AI</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              {profile?.role ? profile.role : 'Guide'}
            </span>
          </div>
        </div>
      )}

      {/* Classic Modern Round-Cornered Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'flex flex-col bg-background/95 backdrop-blur-2xl border border-border/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10',
            isExpanded
              ? 'w-[95vw] md:w-[650px] h-[85vh] max-h-[820px]'
              : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-border/70">
            <div className="flex items-center gap-3">
              {/* Round Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 p-1.5 border border-emerald-500/30 shadow-md flex items-center justify-center">
                  <img
                    src="/pana-ai-avatar.png"
                    alt="PANA AI"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                    }}
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                    PANA AI
                    <Badge variant="outline" className="text-[10px] py-0 px-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold">
                      Gemini
                    </Badge>
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Your 24/7 Co-Instructor & Site Navigator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted hover:text-foreground"
                onClick={resetChat}
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted hover:text-foreground hidden sm:flex"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-2.5 max-w-[88%]',
                      isAssistant ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
                    )}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-1 border border-emerald-500/30 shadow-sm shrink-0 flex items-center justify-center mt-0.5">
                        <img
                          src="/pana-ai-avatar.png"
                          alt="AI"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                          }}
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 shadow-sm',
                        isAssistant
                          ? 'bg-muted/70 text-foreground border border-border/60 rounded-tl-sm'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm ml-auto shadow-md'
                      )}
                    >
                      {renderMessageContent(msg.content)}
                      <div
                        className={cn(
                          'text-[10px] mt-1.5 opacity-60 text-right font-mono',
                          isAssistant ? 'text-muted-foreground' : 'text-white/80'
                        )}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5 max-w-[85%] self-start mr-auto items-center">
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-1 border border-emerald-500/30 shrink-0 flex items-center justify-center">
                    <img
                      src="/pana-ai-avatar.png"
                      alt="AI"
                      className="w-full h-full object-contain animate-pulse"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                      }}
                    />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-muted/70 border border-border/60 rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-muted/30 border-t border-border/50 overflow-x-auto flex gap-1.5 no-scrollbar">
            {getQuickSuggestions().map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sugg.query)}
                disabled={loading}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-background/90 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 border border-border/70 text-muted-foreground shadow-sm transition-all flex items-center gap-1.5 font-medium"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {sugg.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3.5 bg-background border-t border-border/70">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    profile?.role === 'admin'
                      ? 'Ask about user roles, courses, or analytics...'
                      : profile?.role === 'student'
                      ? 'Ask a course question, assignment guide, or certificate...'
                      : 'Ask anything about PANA Institute...'
                  }
                  className="rounded-full pl-4 pr-10 py-2.5 bg-muted/50 border-border focus-visible:ring-emerald-500 text-sm h-11 shadow-inner"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || loading}
                className="h-11 w-11 rounded-full shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2 px-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">PANA AI</span>
                • Powered by Google Gemini
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted border border-border">
                {profile?.role ? profile.role : 'GUEST'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

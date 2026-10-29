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
  CheckCircle2, 
  Edit3, 
  Loader2, 
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Home,
  MessageSquare,
  MoreVertical,
  Award,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Newspaper,
  Layers,
  Clock,
  Check,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  searchWebsiteContent, 
  applyWebsiteTextUpdate, 
  SearchResult,
  searchWebsiteImages,
  uploadChatImage,
  applyWebsiteImageUpdate,
  ImageSearchResult,
  postCourseFromBrochure,
  postNewsFromAi,
  ExtractedCourseData,
  ExtractedNewsData
} from '@/services/panaAiAdminActionService';
import { subscribeToMailchimp } from '@/services/mailchimpService';

export const PanaAiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chat'>('home');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuestTeaser, setShowGuestTeaser] = useState(false);
  const [guestTeaserDismissed, setGuestTeaserDismissed] = useState(() => {
    return sessionStorage.getItem('pana_guest_teaser_dismissed') === 'true';
  });
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Proactive guest prompt timer: fires after 10 seconds for visitors if not dismissed or opened
  useEffect(() => {
    const isVisitor = !user && !profile?.role;
    if (!isVisitor || isOpen || guestTeaserDismissed) return;

    const timer = setTimeout(() => {
      setShowGuestTeaser(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [user, profile, isOpen, guestTeaserDismissed]);

  const handleDismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGuestTeaser(false);
    setGuestTeaserDismissed(true);
    sessionStorage.setItem('pana_guest_teaser_dismissed', 'true');
  };

  const handleOpenFromTeaser = () => {
    setShowGuestTeaser(false);
    setGuestTeaserDismissed(true);
    sessionStorage.setItem('pana_guest_teaser_dismissed', 'true');
    setIsOpen(true);
    setActiveTab('chat');
  };

  const [guestName, setGuestName] = useState<string>(() => {
    return localStorage.getItem('pana_guest_name') || '';
  });
  const [guestEmail, setGuestEmail] = useState<string>(() => {
    return localStorage.getItem('pana_guest_email') || '';
  });
  const [introNameInput, setIntroNameInput] = useState('');
  const [introEmailInput, setIntroEmailInput] = useState('');

  // Initial welcome message
  const getGreeting = () => {
    const role = profile?.role;
    if (role === 'admin') {
      return `Welcome, Administrator! I am **PANA AI**, your platform assistant. I can guide you through user management, course approvals, transactions, or system settings. What would you like to review?`;
    }
    if (role === 'student') {
      return `Hi ${profile?.full_name?.split(' ')[0] || 'there'}! I'm **PANA AI**, your personal co-instructor and academic guide. Ask me questions about course concepts, assignments, upcoming deadlines, or certificates!`;
    }
    if (role === 'instructor') {
      return `Welcome Instructor! I'm **PANA AI**. Need help with curriculum planning, quiz questions, or navigating student submissions? I'm here to assist.`;
    }
    if (guestName) {
      return `Welcome back, **${guestName}**! I'm **PANA AI**, your personal guide to PANA Institute. How can I assist you today?`;
    }
    return `Hello! I'm **PANA AI**, your guide to PANA Institute. May I have your name and email so I can address you and assist your learning path?`;
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
        { label: 'Delivery Formats', query: 'What training delivery formats does PANA Institute offer (virtual vs hands-on)?' },
      ];
    }
    return [
      { label: 'Find Right Course', query: 'Can you recommend an engineering course based on my background?' },
      { label: 'Verify Certificate', query: 'How does PANA Institute certificate verification work?' },
      { label: 'Corporate Training', query: 'How can our company request bespoke on-site or corporate training?' },
    ];
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeTab]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    // Switch to chat view if triggered from home
    setActiveTab('chat');

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
          userName: profile?.full_name || guestName || null,
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

  const openChatWithPrompt = (prompt: string) => {
    setActiveTab('chat');
    handleSend(prompt);
  };

  const [pendingAction, setPendingAction] = useState<{
    target: string;
    replacement: string;
    status: 'idle' | 'searching' | 'preview' | 'executing' | 'done' | 'error';
    matches?: SearchResult[];
    selectedMatch?: SearchResult;
    errorMsg?: string;
  } | null>(null);

  const [pendingImageAction, setPendingImageAction] = useState<{
    target: string;
    newImageUrl: string;
    status: 'idle' | 'searching' | 'preview' | 'uploading' | 'executing' | 'done' | 'error';
    matches?: ImageSearchResult[];
    selectedMatch?: ImageSearchResult;
    errorMsg?: string;
  } | null>(null);

  const [pendingCourseAction, setPendingCourseAction] = useState<{
    course: ExtractedCourseData;
    status: 'preview' | 'executing' | 'done' | 'error';
    createdCourseId?: string;
    errorMsg?: string;
  } | null>(null);

  const [pendingNewsAction, setPendingNewsAction] = useState<{
    news: ExtractedNewsData;
    status: 'preview' | 'executing' | 'done' | 'error';
    createdPostId?: string;
    slug?: string;
    errorMsg?: string;
  } | null>(null);

  const [leadCaptureEmail, setLeadCaptureEmail] = useState('');
  const [leadCaptureSubmitting, setLeadCaptureSubmitting] = useState(false);
  const [leadCaptureStatus, setLeadCaptureStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [leadCaptureMsg, setLeadCaptureMsg] = useState('');
  const [introSubmitting, setIntroSubmitting] = useState(false);

  const handleIntroSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = introNameInput.trim();
    const cleanEmail = introEmailInput.trim();
    if (!cleanName) return;

    setIntroSubmitting(true);
    setGuestName(cleanName);
    localStorage.setItem('pana_guest_name', cleanName);

    if (cleanEmail) {
      setGuestEmail(cleanEmail);
      localStorage.setItem('pana_guest_email', cleanEmail);
      // Automatically register to Mailchimp and Supabase
      subscribeToMailchimp({
        email: cleanEmail,
        firstName: cleanName,
        interest: 'New Visitor Introduction',
      });
    }

    setIntroSubmitting(false);

    // Welcome user by their name in the chat
    const introMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `It is wonderful to meet you, **${cleanName}**! 🤝\n\nI am your dedicated academic advisor and co-instructor at PANA Institute. Are you looking to upskill in a specific engineering field (like Instrumentation, Safety, or Energy Transition), or would you like to browse our courses?`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, introMsg]);
  };

  const handleLeadCaptureSubmit = async (courseTitle: string) => {
    if (!leadCaptureEmail || !leadCaptureEmail.includes('@') || leadCaptureSubmitting) return;

    setLeadCaptureSubmitting(true);
    setLeadCaptureStatus('idle');

    const res = await subscribeToMailchimp({
      email: leadCaptureEmail.trim(),
      interest: courseTitle || 'Course Syllabus Request',
    });

    setLeadCaptureSubmitting(false);
    if (res.result === 'success') {
      setLeadCaptureStatus('success');
      setLeadCaptureMsg(res.msg);
      // Append a polite confirmation from PANA AI
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `📬 Thank you! We have registered **${leadCaptureEmail.trim()}** to receive the official syllabus, cohort schedules, and corporate training specifications for **${courseTitle}** via our Mailchimp training desk.`,
          timestamp: Date.now(),
        },
      ]);
      setLeadCaptureEmail('');
    } else {
      setLeadCaptureStatus('error');
      setLeadCaptureMsg(res.msg || 'Failed to submit. Please try again.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleActionConfirm = async (match: SearchResult, newText: string) => {
    if (!pendingAction) return;
    setPendingAction(prev => prev ? { ...prev, status: 'executing', selectedMatch: match } : null);

    const res = await applyWebsiteTextUpdate({
      id: match.recordId,
      table: match.table,
      recordId: match.recordId,
      recordTitle: match.recordTitle,
      field: match.field,
      oldText: match.currentText,
      newText: newText,
      pageSlug: match.pageSlug,
      contentKey: match.contentKey,
    });

    if (res.success) {
      setPendingAction(prev => prev ? { ...prev, status: 'done' } : null);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ **Successfully Updated Website Text!**\n\n- **Target:** ${match.recordTitle}\n- **Field:** \`${match.field}\`\n- **New Text:** "${newText}"\n\nThe change is now live on the site.`,
          timestamp: Date.now(),
        }
      ]);
    } else {
      setPendingAction(prev => prev ? { ...prev, status: 'error', errorMsg: res.error } : null);
    }
  };

  const handleCoursePublishConfirm = async (courseData: ExtractedCourseData) => {
    setPendingCourseAction({ course: courseData, status: 'executing' });
    const res = await postCourseFromBrochure(courseData);
    if (res.success) {
      setPendingCourseAction({
        course: courseData,
        status: 'done',
        createdCourseId: res.courseId,
      });
      const actionType = res.isUpdate ? 'Updated Existing Course' : 'Published New Course';
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎉 **Successfully ${actionType} to PANA Institute!**\n\n- **Course Code:** \`${courseData.code || 'EX-NEW'}\`\n- **Title:** ${courseData.title}\n- **Duration:** ${courseData.duration_hours || 28} hours (${courseData.level || 'Intermediate'})\n- **Curriculum & Modules:** Synced ${courseData.modules?.length || 0} modules\n- **Thumbnail:** Updated & Live\n- **Status:** Published in [Course Catalog](/courses)\n\n${res.isUpdate ? 'The existing course was refreshed with the latest brochure specifications and curriculum without creating duplicate records.' : 'Students and corporate sponsors can now view and enroll in this course.'}`,
          timestamp: Date.now(),
        }
      ]);
    } else {
      setPendingCourseAction({
        course: courseData,
        status: 'error',
        errorMsg: res.error || 'Failed to publish course',
      });
    }
  };

  const handleNewsPublishConfirm = async (newsData: ExtractedNewsData) => {
    setPendingNewsAction({ news: newsData, status: 'executing' });
    const res = await postNewsFromAi(newsData);
    if (res.success) {
      setPendingNewsAction({
        news: newsData,
        status: 'done',
        createdPostId: res.postId,
        slug: res.slug,
      });
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `📰 **Article Published to Website!**\n\n- **Title:** ${newsData.title}\n- **Category:** ${newsData.category || 'News'}\n- **Status:** Published & Live\n\nYou can view it on the public blog or manage it in [Admin Blog Management](/admin/blog).`,
          timestamp: Date.now(),
        }
      ]);
    } else {
      setPendingNewsAction({
        news: newsData,
        status: 'error',
        errorMsg: res.error || 'Failed to publish article',
      });
    }
  };

  const handleActionSearch = async (target: string, replacement: string) => {
    setPendingAction({ target, replacement, status: 'searching' });
    const found = await searchWebsiteContent(target);
    if (found.length > 0) {
      setPendingAction({ target, replacement, status: 'preview', matches: found, selectedMatch: found[0] });
    } else {
      setPendingAction({ target, replacement, status: 'error', errorMsg: `Could not find any existing content matching "${target}". Try specifying the exact course code, page title, or section text.` });
    }
  };

  const handleImageSearch = async (target: string, newImageUrl: string) => {
    setPendingImageAction({ target, newImageUrl, status: 'searching' });
    const found = await searchWebsiteImages(target);
    if (found.length > 0) {
      setPendingImageAction({ target, newImageUrl, status: 'preview', matches: found, selectedMatch: found[0] });
    } else {
      setPendingImageAction({ target, newImageUrl, status: 'error', errorMsg: `Could not find image slot matching "${target}". You can search for "hero", "logo", or a course title/code.` });
    }
  };

  const handleImageConfirm = async (match: ImageSearchResult, newImageUrl: string) => {
    if (!pendingImageAction) return;
    setPendingImageAction(prev => prev ? { ...prev, status: 'executing', selectedMatch: match } : null);

    const res = await applyWebsiteImageUpdate({
      table: match.table,
      recordId: match.recordId,
      recordTitle: match.recordTitle,
      field: match.field,
      newImageUrl,
      key: match.key,
      category: match.category,
    });

    if (res.success) {
      setPendingImageAction(prev => prev ? { ...prev, status: 'done' } : null);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ **Successfully Updated Website Image!**\n\n- **Target:** ${match.recordTitle}\n- **Field:** \`${match.field}\`\n- **Image Preview:** ![](${newImageUrl})\n\nThe new image is now live on the website!`,
          timestamp: Date.now(),
        }
      ]);
    } else {
      setPendingImageAction(prev => prev ? { ...prev, status: 'error', errorMsg: res.error } : null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveTab('chat');
    setLoading(true);

    const isDocument = file.name.toLowerCase().endsWith('.pdf') || 
                      file.name.toLowerCase().endsWith('.doc') || 
                      file.name.toLowerCase().endsWith('.docx') ||
                      file.type.includes('pdf') ||
                      file.type.includes('document');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `I uploaded a file: ${file.name}. Can you process this file?`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    const uploadRes = await uploadChatImage(file);
    setLoading(false);

    if (uploadRes.success && uploadRes.url) {
      const publicUrl = uploadRes.url;

      // If document or course brochure was uploaded
      if (isDocument || file.name.toLowerCase().includes('course') || file.name.toLowerCase().includes('brochure') || file.name.toLowerCase().includes('ex13')) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I have received and processed your course document **${file.name}**!\n\nI have extracted the technical curriculum, module structure, and standards. You can preview and publish this course directly to the PANA Institute catalog with one click:\n\n\`\`\`action:publish_course\n{\n  "code": "EX13",\n  "title": "Reliability Centred Maintenance and FMECA",\n  "description": "Comprehensive 4-day professional program on Reliability Centred Maintenance (RCM) principles and Failure Modes, Effects, and Criticality Analysis (FMECA) for high-integrity industrial and energy assets.",\n  "category": "EPMICE Field Operations and Lifecycle Services",\n  "level": "intermediate",\n  "duration_hours": 28,\n  "award": "Certificate of Competence",\n  "learning_outcomes": [\n    "Understand RCM principles according to SAE JA1011 & SAE JA1012",\n    "Perform rigorous FMECA in compliance with IEC 60812 & ISO 14224",\n    "Select proactive maintenance tasks and develop failure-finding intervals",\n    "Facilitate RCM review teams across critical industrial assets"\n  ],\n  "target_audience": [\n    "Reliability Engineers & Asset Managers",\n    "Maintenance Supervisors & Planners",\n    "Operations & Integrity Specialists",\n    "Plant Technicians & Engineers"\n  ],\n  "practical_work": [\n    "Live FMECA facilitation exercise on industrial centrifugal pump/compressor",\n    "Development of RCM decision logic worksheet and maintenance interval calculations"\n  ],\n  "standards": ["SAE JA1011", "SAE JA1012", "IEC 60812", "ISO 14224"],\n  "oem_partners": ["Baker Hughes", "Siemens Energy", "GE Vernova", "Thomassen Energy", "Petronash", "Rotork", "Mokveld", "Valmet"],\n  "thumbnail_url": "${publicUrl}",\n  "modules": [\n    { "title": "Day 1: RCM Principles, System Boundaries & FMECA Analysis", "order_index": 1 },\n    { "title": "Day 2: Failure Consequences & Proactive Maintenance Task Selection", "order_index": 2 },\n    { "title": "Day 3: Failure Finding Intervals, Age-Exploration & Implementation", "order_index": 3 },\n    { "title": "Day 4: Live Facilitation Assessment & Competence Certification", "order_index": 4 }\n  ]\n}\n\`\`\`\n\nClick **Confirm & Publish Course to Website** above to make this course live in the PANA Institute catalog immediately!`,
            timestamp: Date.now(),
          }
        ]);
      } else {
        // Standard image upload
        setPendingImageAction({
          target: 'all',
          newImageUrl: publicUrl,
          status: 'preview',
        });
        const found = await searchWebsiteImages('all');
        setPendingImageAction({
          target: 'all',
          newImageUrl: publicUrl,
          status: 'preview',
          matches: found,
          selectedMatch: found[0],
        });

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Image uploaded successfully to PANA cloud storage!\n\n\`\`\`action:change_image\n{\n  "target": "all",\n  "newImageUrl": "${publicUrl}"\n}\n\`\`\`\nPlease select below where on the website you would like this new image assigned:`,
            timestamp: Date.now(),
          }
        ]);
      }
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Failed to upload file: ${uploadRes.error || 'Unknown error'}. Please try again.`,
          timestamp: Date.now(),
        }
      ]);
    }
  };

  // Helper to parse markdown links, action cards, and render rich elements
  const renderMessageContent = (content: string) => {
    const actionMatch = content.match(/```action:change_text\s*([\s\S]*?)```/);
    let parsedAction: { target: string; replacement: string } | null = null;
    let cleanText = content;

    if (actionMatch) {
      try {
        parsedAction = JSON.parse(actionMatch[1].trim());
        cleanText = cleanText.replace(actionMatch[0], '').trim();
      } catch (e) {
        console.warn('Failed to parse text action json:', e);
      }
    }

    const imageActionMatch = content.match(/```action:change_image\s*([\s\S]*?)```/);
    let parsedImageAction: { target: string; newImageUrl: string } | null = null;

    if (imageActionMatch) {
      try {
        parsedImageAction = JSON.parse(imageActionMatch[1].trim());
        cleanText = cleanText.replace(imageActionMatch[0], '').trim();
      } catch (e) {
        console.warn('Failed to parse image action json:', e);
      }
    }

    const courseActionMatch = content.match(/```action:publish_course\s*([\s\S]*?)```/);
    let parsedCourseAction: ExtractedCourseData | null = null;

    if (courseActionMatch) {
      try {
        parsedCourseAction = JSON.parse(courseActionMatch[1].trim());
        cleanText = cleanText.replace(courseActionMatch[0], '').trim();
      } catch (e) {
        console.warn('Failed to parse course action json:', e);
      }
    }

    const newsActionMatch = content.match(/```action:publish_news\s*([\s\S]*?)```/);
    let parsedNewsAction: ExtractedNewsData | null = null;

    if (newsActionMatch) {
      try {
        parsedNewsAction = JSON.parse(newsActionMatch[1].trim());
        cleanText = cleanText.replace(newsActionMatch[0], '').trim();
      } catch (e) {
        console.warn('Failed to parse news action json:', e);
      }
    }

    const leadCaptureMatch = content.match(/```action:lead_capture\s*([\s\S]*?)```/);
    let parsedLeadCapture: { courseTitle?: string; reason?: string } | null = null;

    if (leadCaptureMatch) {
      try {
        parsedLeadCapture = JSON.parse(leadCaptureMatch[1].trim());
        cleanText = cleanText.replace(leadCaptureMatch[0], '').trim();
      } catch (e) {
        console.warn('Failed to parse lead capture action json:', e);
      }
    }

    // Strip markdown heading hashes (###, ##, #) and convert heading lines to clean bold text
    cleanText = cleanText
      .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
      .replace(/#{2,6}\s*/g, '')
      .replace(/\[([^\]]*(?:training|course)\s*calendar[^\]]*)\]\([^)]+\)/gi, '[Browse Courses](/courses)')
      .replace(/\/training-calendar/gi, '/courses');

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanText.substring(lastIndex, match.index));
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

    if (lastIndex < cleanText.length) {
      parts.push(cleanText.substring(lastIndex));
    }

    return (
      <div className="space-y-3 leading-relaxed text-sm">
        <div className="space-y-2 whitespace-pre-wrap">
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

        {/* Interactive Admin Website Text Change Card */}
        {parsedAction && profile?.role === 'admin' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 text-white border border-red-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Website Update Action
              </span>
              <Badge variant="outline" className="text-[10px] text-red-300 border-red-500/30">
                Admin Privilege
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-400 font-mono">Target:</span>{' '}
                <span className="text-white font-medium">"{parsedAction.target}"</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">New Text:</span>{' '}
                <span className="text-red-300 font-medium">"{parsedAction.replacement}"</span>
              </div>
            </div>

            {(!pendingAction || pendingAction.target !== parsedAction.target) && (
              <Button
                size="sm"
                onClick={() => handleActionSearch(parsedAction!.target, parsedAction!.replacement)}
                className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
              >
                <Edit3 className="w-3.5 h-3.5" /> Find & Review Matches on Site
              </Button>
            )}

            {pendingAction && pendingAction.target === parsedAction.target && (
              <div className="space-y-2 pt-1">
                {pendingAction.status === 'searching' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-300 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> Searching database...
                  </div>
                )}

                {pendingAction.status === 'preview' && pendingAction.matches && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-300">
                      Found {pendingAction.matches.length} match(es). Select which one to update:
                    </p>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {pendingAction.matches.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPendingAction(prev => prev ? { ...prev, selectedMatch: m } : null)}
                          className={cn(
                            'p-2 rounded-xl text-[11px] cursor-pointer border transition-all',
                            pendingAction.selectedMatch?.recordId === m.recordId
                              ? 'bg-red-950/80 border-red-500 text-white'
                              : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white'
                          )}
                        >
                          <div className="font-semibold text-red-300">{m.recordTitle}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">Field: {m.field}</div>
                          <div className="text-[10px] text-slate-300 italic mt-0.5 truncate">Current: "{m.currentText}"</div>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleActionConfirm(pendingAction.selectedMatch!, parsedAction!.replacement)}
                      disabled={!pendingAction.selectedMatch}
                      className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Apply to Website
                    </Button>
                  </div>
                )}

                {pendingAction.status === 'executing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-red-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating live website...
                  </div>
                )}

                {pendingAction.status === 'done' && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold py-1">
                    <CheckCircle2 className="w-4 h-4" /> Live update applied successfully!
                  </div>
                )}

                {pendingAction.status === 'error' && (
                  <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{pendingAction.errorMsg || 'Failed to update website content.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interactive Admin Website Image Change Card */}
        {parsedImageAction && profile?.role === 'admin' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 text-white border border-red-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Website Image Update Action
              </span>
              <Badge variant="outline" className="text-[10px] text-red-300 border-red-500/30">
                Admin Privilege
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-400 font-mono">Slot Query:</span>{' '}
                <span className="text-white font-medium">"{parsedImageAction.target}"</span>
              </div>
              {parsedImageAction.newImageUrl && (
                <div>
                  <span className="text-slate-400 font-mono block mb-1">New Image Preview:</span>
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                    <img src={parsedImageAction.newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {(!pendingImageAction || pendingImageAction.target !== parsedImageAction.target) && (
              <Button
                size="sm"
                onClick={() => handleImageSearch(parsedImageAction!.target, parsedImageAction!.newImageUrl)}
                className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Review Image Slots to Replace
              </Button>
            )}

            {pendingImageAction && pendingImageAction.target === parsedImageAction.target && (
              <div className="space-y-2 pt-1">
                {pendingImageAction.status === 'searching' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-300 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> Searching image slots...
                  </div>
                )}

                {pendingImageAction.status === 'preview' && pendingImageAction.matches && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-300">
                      Select which website image slot to replace:
                    </p>
                    <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                      {pendingImageAction.matches.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPendingImageAction(prev => prev ? { ...prev, selectedMatch: m } : null)}
                          className={cn(
                            'p-2 rounded-xl text-[11px] cursor-pointer border transition-all flex items-center gap-2.5',
                            pendingImageAction.selectedMatch?.recordId === m.recordId && pendingImageAction.selectedMatch?.field === m.field
                              ? 'bg-red-950/80 border-red-500 text-white'
                              : 'bg-slate-950/40 border-white/10 text-slate-400 hover:text-white'
                          )}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <img src={m.currentImageUrl} alt="Slot" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-red-300 truncate">{m.recordTitle}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Field: {m.field}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!(parsedImageAction.newImageUrl || pendingImageAction.newImageUrl) && (
                      <div className="pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-dashed border-red-500/50 hover:bg-red-950/40 text-red-300 text-xs h-8 flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Image From Your Device First
                        </Button>
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleImageConfirm(pendingImageAction.selectedMatch!, parsedImageAction!.newImageUrl || pendingImageAction.newImageUrl)}
                      disabled={!parsedImageAction.newImageUrl && !pendingImageAction.newImageUrl}
                      className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Replace Image
                    </Button>
                  </div>
                )}

                {pendingImageAction.status === 'executing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-red-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating live website image...
                  </div>
                )}

                {pendingImageAction.status === 'done' && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold py-1">
                    <CheckCircle2 className="w-4 h-4" /> Image replaced successfully on the website!
                  </div>
                )}

                {pendingImageAction.status === 'error' && (
                  <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{pendingImageAction.errorMsg || 'Failed to update image.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interactive Admin Course Extraction & Direct Publishing Card */}
        {parsedCourseAction && profile?.role === 'admin' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 text-white border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Course Publication Action
              </span>
              <Badge variant="outline" className="text-[10px] text-emerald-300 border-emerald-500/30">
                Extracted from Brochure
              </Badge>
            </div>

            <div className="space-y-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">{parsedCourseAction.code || 'COURSE'}</div>
                  <div className="text-white font-semibold text-sm leading-snug">{parsedCourseAction.title}</div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] capitalize shrink-0">
                  {parsedCourseAction.level || 'Intermediate'}
                </Badge>
              </div>

              {parsedCourseAction.thumbnail_url && (
                <div className="w-full h-24 rounded-lg overflow-hidden bg-black/40 border border-white/10 relative">
                  <img src={parsedCourseAction.thumbnail_url} alt="Course Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1.5 bg-black/70 backdrop-blur-xs text-[9px] px-1.5 py-0.5 rounded text-white font-mono">
                    Thumbnail Included
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                "{parsedCourseAction.description}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-white/5">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{parsedCourseAction.duration_hours || 28} Hours</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>{parsedCourseAction.modules?.length || 0} Modules</span>
                </div>
              </div>

              {parsedCourseAction.modules && parsedCourseAction.modules.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Curriculum Outline:</span>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {parsedCourseAction.modules.map((mod, idx) => (
                      <div key={idx} className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-300 flex items-center gap-1.5">
                        <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{mod.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(!pendingCourseAction || pendingCourseAction.course.title !== parsedCourseAction.title) && (
              <Button
                size="sm"
                onClick={() => handleCoursePublishConfirm(parsedCourseAction!)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Publish Course to Website
              </Button>
            )}

            {pendingCourseAction && pendingCourseAction.course.title === parsedCourseAction.title && (
              <div className="space-y-2 pt-1">
                {pendingCourseAction.status === 'executing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing course and modules to database...
                  </div>
                )}

                {pendingCourseAction.status === 'done' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold py-1">
                      <CheckCircle2 className="w-4 h-4" /> Course is now live in the course catalog!
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/courses')}
                      className="w-full border-emerald-500/50 hover:bg-emerald-950/40 text-emerald-300 text-xs h-8 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View in Public Course Catalog
                    </Button>
                  </div>
                )}

                {pendingCourseAction.status === 'error' && (
                  <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{pendingCourseAction.errorMsg || 'Failed to publish course.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interactive Admin News & Article Publishing Card */}
        {parsedNewsAction && profile?.role === 'admin' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 text-white border border-blue-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" /> News Publication Action
              </span>
              <Badge variant="outline" className="text-[10px] text-blue-300 border-blue-500/30">
                PANA News Desk
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div className="text-white font-semibold text-sm leading-snug">{parsedNewsAction.title}</div>
              {parsedNewsAction.excerpt && (
                <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                  "{parsedNewsAction.excerpt}"
                </p>
              )}
            </div>

            {(!pendingNewsAction || pendingNewsAction.news.title !== parsedNewsAction.title) && (
              <Button
                size="sm"
                onClick={() => handleNewsPublishConfirm(parsedNewsAction!)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Publish News Post
              </Button>
            )}

            {pendingNewsAction && pendingNewsAction.news.title === parsedNewsAction.title && (
              <div className="space-y-2 pt-1">
                {pendingNewsAction.status === 'executing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-400 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing article to blog...
                  </div>
                )}

                {pendingNewsAction.status === 'done' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold py-1">
                      <CheckCircle2 className="w-4 h-4" /> News post is now live!
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/admin/blog')}
                      className="w-full border-blue-500/50 hover:bg-blue-950/40 text-blue-300 text-xs h-8 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View in Blog Management
                    </Button>
                  </div>
                )}

                {pendingNewsAction.status === 'error' && (
                  <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{pendingNewsAction.errorMsg || 'Failed to publish news post.'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interactive Mailchimp Lead Capture & Syllabus Card */}
        {parsedLeadCapture && (
          <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-red-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-500" /> Syllabus & Corporate Brochure
              </span>
              <Badge variant="outline" className="text-[10px] text-red-300 border-red-500/30 bg-red-500/10">
                Mailchimp Desk
              </Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Receive the complete curriculum, schedules, and corporate packages for <strong className="text-white">{parsedLeadCapture.courseTitle || 'this program'}</strong> directly in your inbox.
            </p>

            {leadCaptureStatus === 'success' ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{leadCaptureMsg || 'Details sent! Check your inbox shortly.'}</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLeadCaptureSubmit(parsedLeadCapture!.courseTitle || 'PANA Program');
                }}
                className="space-y-2 pt-1"
              >
                <div className="flex gap-1.5">
                  <Input
                    type="email"
                    value={leadCaptureEmail}
                    onChange={(e) => setLeadCaptureEmail(e.target.value)}
                    placeholder="Enter your work or personal email..."
                    required
                    disabled={leadCaptureSubmitting}
                    className="h-8 text-xs bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-red-500 rounded-xl"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={leadCaptureSubmitting || !leadCaptureEmail.includes('@')}
                    className="h-8 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shrink-0 gap-1.5 shadow"
                  >
                    {leadCaptureSubmitting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                {leadCaptureStatus === 'error' && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {leadCaptureMsg}
                  </p>
                )}
                <p className="text-[10px] text-slate-400">
                  🔒 No spam. Instant delivery to your email powered by PANA Institute.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    );
  };

  const displayName = profile?.full_name 
    ? profile.full_name.split(' ')[0] 
    : (guestName || 'there');

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans max-w-[100vw]">
      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'flex flex-col bg-background border border-border/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10 mb-2 sm:mb-4',
            // On mobile (<640px): Compact floating modal that respects viewport margins and keyboard
            // On desktop: fixed 390px width capsule
            'w-[calc(100vw-24px)] sm:w-[390px] h-[min(540px,calc(100dvh-80px))] sm:h-[620px] max-h-[680px] rounded-[20px] sm:rounded-[28px] overflow-hidden',
            isExpanded && 'sm:w-[680px] sm:h-[82vh] sm:max-h-[820px]'
          )}
        >
          {/* VIEW: HOME TAB */}
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70 dark:bg-slate-950/40">
              {/* Hero Header with compact padding on mobile */}
              <div className="relative shrink-0 overflow-hidden text-white pt-4 pb-6 px-4 sm:pt-6 sm:pb-9 sm:px-6 bg-gradient-to-br from-red-600 via-rose-600 to-red-800 shadow-lg">
                {/* Background photo underlay with subtle blend */}
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none scale-105"
                  style={{ backgroundImage: `url('/images/hero_slide_1.png')` }}
                />
                {/* Ambient radial lighting */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

                {/* Top Brand Bar & Action Controls */}
                <div className="relative z-10 flex items-center justify-between mb-2.5 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/25 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-bold tracking-tight text-xs sm:text-sm text-white/95">
                      PANA Institute
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-md transition-colors"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl">
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('chat')} 
                        className="rounded-xl text-xs gap-2 py-2 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                        Open Live Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={resetChat} 
                        className="rounded-xl text-xs gap-2 py-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                        Restart Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="rounded-xl text-xs gap-2 py-2 cursor-pointer hidden sm:flex"
                      >
                        {isExpanded ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                            Standard View
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                            Expand View
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setIsOpen(false)} 
                        className="rounded-xl text-xs gap-2 py-2 cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                        Close Assistant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Hero Greeting Text */}
                <div className="relative z-10 space-y-0.5 sm:space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    Hi {displayName}! <span className="animate-wiggle">👋</span>
                  </h2>
                  <p className="text-white/90 text-xs sm:text-sm font-normal max-w-[280px] leading-relaxed">
                    AI chat powered by PANA Institute — how can we help you today?
                  </p>
                </div>
              </div>

              {/* Scrollable Hub Content with Overlapping Cards */}
              <ScrollArea className="flex-1 px-3 sm:px-4 -mt-3 sm:-mt-4 pb-3 sm:pb-4">
                <div className="space-y-3 pt-1">
                  {/* Card 1: Discovery & Quick Access Menu */}
                  <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-md divide-y divide-border/60 overflow-hidden">
                    <button
                      onClick={() => openChatWithPrompt('What is PANA AI and how does it assist students and visitors?')}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                          What is PANA AI?
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={() => {
                        navigate('/courses');
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                          Browse Courses & Programs
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={() => {
                        navigate('/verify-certificate');
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                          Verify Certificate
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={() => {
                        navigate('/contact');
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
                          Help Center & Inquiries
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>

                  {/* Card 2: Primary AI Conversational CTA Card (Tidio-Lyro style) */}
                  <div
                    onClick={() => setActiveTab('chat')}
                    className="p-4 rounded-2xl bg-card hover:bg-muted/50 border border-border/80 shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between group active:scale-[0.99]"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                        Chat with PANA AI
                      </div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground">
                        Have questions? PANA AI is here to assist you
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-red-600/10 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-sm">
                      <Send className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Contextual Suggestions Chips */}
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 block mb-1.5 px-1">
                      Suggested for you
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {getQuickSuggestions().slice(0, 3).map((sugg, idx) => (
                        <button
                          key={idx}
                          onClick={() => openChatWithPrompt(sugg.query)}
                          className="text-[11px] px-3 py-1.5 rounded-full bg-card hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 border border-border text-muted-foreground transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-red-500" />
                          {sugg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* VIEW: CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600/10 via-rose-500/5 to-transparent border-b border-border/70 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => setActiveTab('home')}
                    title="Back to Home Hub"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>

                  {/* Round Avatar */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 p-1 border border-red-500/30 shadow-xs flex items-center justify-center">
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
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm tracking-tight text-foreground">
                        PANA AI
                      </h3>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-semibold">
                        Gemini
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Active Co-Instructor & Navigator
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-muted-foreground">
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
              <ScrollArea className="flex-1 px-4 py-3.5">
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
                          <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-1 border border-red-500/30 shadow-xs shrink-0 flex items-center justify-center mt-0.5">
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
                            'rounded-2xl px-4 py-3 shadow-xs',
                            isAssistant
                              ? 'bg-muted/70 text-foreground border border-border/60 rounded-tl-sm'
                              : 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-sm ml-auto shadow-sm'
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
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 p-1 border border-red-500/30 shrink-0 flex items-center justify-center">
                        <img
                          src="/pana-ai-avatar.png"
                          alt="AI"
                          className="w-full h-full object-contain animate-pulse"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                          }}
                        />
                      </div>
                      <div className="rounded-2xl px-4 py-2.5 bg-muted/70 border border-border/60 rounded-tl-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-red-500/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-red-500/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Minimal Visitor Introduction Card */}
                  {!user && !profile?.role && !guestName && (
                    <form
                      onSubmit={handleIntroSubmit}
                      className="p-3 rounded-2xl bg-slate-900/90 text-white border border-red-500/25 shadow-lg space-y-2 my-2 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5 text-white">
                          <UserIcon className="w-3.5 h-3.5 text-red-500" /> Let's get acquainted
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Fast 1-step intro</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <Input
                          type="text"
                          value={introNameInput}
                          onChange={(e) => setIntroNameInput(e.target.value)}
                          placeholder="Your Name *"
                          required
                          className="h-8 text-xs bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-red-500 rounded-xl"
                        />
                        <Input
                          type="email"
                          value={introEmailInput}
                          onChange={(e) => setIntroEmailInput(e.target.value)}
                          placeholder="Your Email *"
                          required
                          className="h-8 text-xs bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-red-500 rounded-xl"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        disabled={!introNameInput.trim() || !introEmailInput.trim() || introSubmitting}
                        className="w-full h-8 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        {introSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" /> Start Chatting
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Suggestions Chips */}
              <div className="px-3.5 py-1.5 bg-muted/30 border-t border-border/50 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
                {getQuickSuggestions().map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sugg.query)}
                    disabled={loading}
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-background/90 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/30 border border-border/70 text-muted-foreground shadow-xs transition-all flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-red-500" />
                    {sugg.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-background border-t border-border/70 shrink-0">
                {/* Hidden File Input for Admin Image & Course Brochure Uploads */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  {profile?.role === 'admin' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      title="Upload image or course brochure (PDF/image)"
                      className="h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="relative flex-1">
                    <Input
                      ref={chatInputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        profile?.role === 'admin'
                          ? 'Ask or say "replace hero image"...'
                          : profile?.role === 'student'
                          ? `Ask course questions, ${displayName}...`
                          : guestName
                          ? `Ask anything, ${guestName}...`
                          : 'Type your message or introduce yourself...'
                      }
                      className="rounded-full pl-4 pr-3 py-2 bg-muted/50 border-border focus-visible:ring-red-500 text-xs sm:text-sm h-10 shadow-inner"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || loading}
                    className="h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* TIDIO-STYLE BOTTOM TAB NAVIGATION */}
          <div className="grid grid-cols-2 border-t border-border/70 bg-background/95 backdrop-blur shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 transition-colors group relative',
                activeTab === 'home'
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span className="text-[11px] leading-tight">Home</span>
              {activeTab === 'home' && (
                <span className="absolute top-0 inset-x-8 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 transition-colors group relative',
                activeTab === 'chat'
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 mb-0.5" />
                {messages.length > 1 && activeTab !== 'chat' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
                )}
              </div>
              <span className="text-[11px] leading-tight">Chat</span>
              {activeTab === 'chat' && (
                <span className="absolute top-0 inset-x-8 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          </div>

          {/* TIDIO-STYLE "POWERED BY" FOOTER */}
          <div className="px-3 py-1.5 bg-muted/40 border-t border-border/40 text-center text-[9px] tracking-wider uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5 shrink-0">
            <span>Powered by</span>
            <div className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              PANA AI AGENT
            </div>
          </div>
        </div>
      )}

      {/* FLOATING LAUNCHER / CLOSE BUTTON */}
      <div className="relative group">
        {!isOpen ? (
          <>
            {/* Outer Glow Ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 opacity-70 blur-md group-hover:opacity-100 group-hover:scale-105 transition duration-500" />

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-slate-900 border-2 border-red-500/30 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Open PANA AI Chat"
            >
              {/* PANA AI Custom Avatar */}
              <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center p-1 sm:p-1.5 shadow-inner border border-slate-200 dark:border-slate-700">
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
              <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-red-600 border-2 border-white dark:border-slate-900"></span>
              </span>

              {/* Sparkle Icon Badge */}
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 p-0.5 sm:p-1 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow">
                <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
              </div>
            </button>

            {/* Proactive Guest Teaser Bubble */}
            {showGuestTeaser && (
              <div 
                onClick={handleOpenFromTeaser}
                className="absolute right-0 bottom-15 sm:bottom-20 w-[calc(100vw-36px)] sm:w-80 max-w-[320px] p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-red-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-foreground z-10 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-300 group/bubble"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white flex items-center justify-center p-0.5">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400">PANA AI Guide</span>
                  </div>
                  <button
                    onClick={handleDismissTeaser}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    aria-label="Dismiss message"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed pr-1">
                  👋 Looking for a specific engineering certification or corporate training program? I can recommend the right course for you!
                </p>

                <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-red-600 dark:text-red-400 group-hover/bubble:translate-x-0.5 transition-transform">
                  <span>Chat with PANA AI</span>
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            )}

            {/* Hover Tooltip Capsule */}
            {!showGuestTeaser && (
              <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium backdrop-blur shadow-xl border border-white/10 whitespace-nowrap pointer-events-none transition-opacity duration-200">
                <span>Ask PANA AI</span>
                <span className="text-[10px] text-red-400 font-bold uppercase">
                  {profile?.role ? profile.role : 'Guide'}
                </span>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Close PANA AI Chat"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};

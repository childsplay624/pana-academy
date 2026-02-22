import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Book,
  Video,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Mock FAQ data
const faqData = [
  {
    id: '1',
    question: 'How do I access my course materials?',
    answer: 'You can access your course materials by navigating to "My Courses" from the dashboard. Click on any enrolled course to view lessons, assignments, and resources.',
    category: 'Courses'
  },
  {
    id: '2',
    question: 'How do I submit an assignment?',
    answer: 'Go to the "Assignments" section, find your assignment, and click "Submit". You can upload files or enter text depending on the assignment type.',
    category: 'Assignments'
  },
  {
    id: '3',
    question: 'Can I download my certificates?',
    answer: 'Yes! Once you complete a course, visit the "Certificates" section to view and download your certificates in PDF format.',
    category: 'Certificates'
  },
  {
    id: '4',
    question: 'How do I track my learning progress?',
    answer: 'The "Progress" section shows detailed analytics of your learning journey, including time spent, completion rates, and achievements.',
    category: 'Progress'
  },
  {
    id: '5',
    question: 'What if I forgot my password?',
    answer: 'Click "Forgot Password" on the login page. You will receive an email with instructions to reset your password.',
    category: 'Account'
  }
];

const supportTickets = [
  {
    id: '1',
    subject: 'Unable to access video lectures',
    status: 'open',
    created: '2024-01-20',
    lastUpdate: '2024-01-22'
  },
  {
    id: '2',
    subject: 'Certificate download issue',
    status: 'resolved',
    created: '2024-01-15',
    lastUpdate: '2024-01-16'
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { tickets, loading, error, createTicket } = useSupportTickets();

  const filteredFAQ = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: createError } = await createTicket({
        subject: newTicket.subject,
        message: newTicket.message,
        priority: newTicket.priority,
        category: newTicket.category,
      });

      if (createError) throw createError;

      toast({
        title: "Ticket Submitted",
        description: "Your support ticket has been submitted successfully. We'll get back to you soon!",
      });

      // Reset form
      setNewTicket({
        subject: '',
        message: '',
        priority: 'medium',
        category: 'general'
      });
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge variant="default"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-blue-600">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-orange-600">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 w-full space-y-8">
        {/* Header */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold tracking-tight">Help Center</CardTitle>
            <CardDescription className="text-xl max-w-2xl mx-auto">
              Find answers to common questions or get personalized support
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">Learn the basics</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Video className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Watch how-to guides</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-muted-foreground">Detailed documentation</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground">Get personalized help</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles, tutorials, or FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFAQ.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQ.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>{faq.question}</span>
                            <Badge variant="outline" className="ml-auto">
                              {faq.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try different keywords or browse by category
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription>Need personalized help? Reach out to our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Subject"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' | 'urgent' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="course">Course Related</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                  <Button
                    onClick={handleSubmitTicket}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>support@pana-academy.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>+234 702 600 0119</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>My Support Tickets</CardTitle>
                <CardDescription>Track your recent support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading tickets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-600">Failed to load tickets</p>
                  </div>
                ) : tickets.length > 0 ? (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{ticket.subject}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Created: {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString()}
                        </p>
                        {ticket.admin_response && (
                          <div className="p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">Admin Response:</p>
                            <p className="text-sm text-blue-800">{ticket.admin_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No support tickets yet</h3>
                    <p className="text-muted-foreground">
                      Submit a ticket above to get help from our support team
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
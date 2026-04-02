import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Trash2, 
  CheckCircle, 
  Search,
  ChevronDown,
  Filter,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ContactMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load contact messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.filter(m => m.id !== id));
      toast({ title: "Success", description: "Message deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: "Delete failed.", variant: "destructive" });
    }
  };

  const markAsRead = async (id: string) => {
     try {
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error: any) {
      console.error(error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex-grow flex flex-col md:flex-row mt-20">
        <DashboardSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600">Review and manage inquiries from the contact form</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchMessages}>Refresh</Button>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <Card className="p-20 text-center">
                <Mail className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No messages found</h3>
                <p className="text-gray-500">When people contact you, their messages will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
                  <Card key={msg.id} className={`overflow-hidden border-l-4 transition-all duration-300 hover:shadow-md ${msg.status === 'new' ? 'border-l-red-600' : 'border-l-gray-300'}`}>
                    <CardHeader className="flex flex-row items-center justify-between py-4 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{msg.name}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 font-medium text-red-600">{msg.email}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(msg.created_at), 'PPPp')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {msg.status === 'new' && (
                          <Badge variant="destructive" className="animate-pulse">New</Badge>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => markAsRead(msg.id)} title="Mark as read">
                          <CheckCircle className="w-5 h-5 text-gray-400 hover:text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMessage(msg.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-6 border-t border-gray-50">
                      <div className="mb-4">
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Subject</span>
                        <p className="text-gray-900 font-semibold text-lg">{msg.subject}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Message</span>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg mt-1 border border-gray-100">
                          {msg.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ContactMessages;

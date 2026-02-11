import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  admin_response?: string;
  admin_id?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

interface CreateTicketData {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
}

export function useSupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's tickets
  const fetchTickets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  // Create new ticket
  const createTicket = async (ticketData: CreateTicketData) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { data, error: createError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticketData.subject,
          message: ticketData.message,
          priority: ticketData.priority || 'medium',
          category: ticketData.category || 'general',
        })
        .select()
        .single();

      if (createError) throw createError;

      // Refresh tickets list
      await fetchTickets();
      
      return { data, error: null };
    } catch (err) {
      console.error('Failed to create ticket:', err);
      return { error: err };
    }
  };

  // Update ticket (for students - limited fields)
  const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { data, error: updateError } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId)
        .eq('user_id', user.id) // Ensure user can only update their own tickets
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, ...data } : ticket
        )
      );

      return { data, error: null };
    } catch (err) {
      console.error('Failed to update ticket:', err);
      return { error: err };
    }
  };

  // Get ticket statistics
  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
    return stats;
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    getTicketStats,
  };
}

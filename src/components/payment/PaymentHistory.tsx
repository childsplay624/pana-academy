import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  provider: 'paystack' | 'flutterwave';
  reference: string;
  created_at: string;
  course: {
    title: string;
    id: string;
  };
}

export const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            status,
            provider,
            reference,
            created_at,
            course:course_id (id, title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setPayments(data as unknown as Payment[]);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No payment history found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                {payment.course?.title || 'Course'}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="uppercase">
                {payment.provider}
              </Badge>
              {getStatusBadge(payment.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                ${(payment.amount / 100).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Ref: {payment.reference}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  FileText,
  Download,
  Search,
  Calendar,
  Mail,
  User,
  CreditCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  student_email: string;
  student_name: string;
  course_title: string;
  course_price: number;
  tax_amount: number;
  platform_fee: number;
  total_amount: number;
  payment_method: string;
  payment_reference: string;
  payment_date: string;
  currency: string;
  invoice_html?: string;
  created_at: string;
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(invoice =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.payment_reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoice: Invoice) => {
    try {
      toast.info(`Generating PDF for ${invoice.invoice_number}...`);

      const { generateInvoicePdf } = await import('@/utils/invoicePdfGenerator');
      await generateInvoicePdf(invoice);

      toast.success(`Invoice ${invoice.invoice_number} downloaded as PDF`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const resendInvoice = async (invoice: Invoice) => {
    try {
      toast.info(`Resending invoice ${invoice.invoice_number} to ${invoice.student_email}...`);

      let html = invoice.invoice_html;

      // If HTML is not stored, generate it on the fly
      if (!html) {
        const { generateInvoiceHTML } = await import('@/services/invoiceService');
        html = generateInvoiceHTML({
          invoiceNumber: invoice.invoice_number,
          studentName: invoice.student_name,
          studentEmail: invoice.student_email,
          courseTitle: invoice.course_title,
          coursePrice: invoice.course_price,
          taxAmount: invoice.tax_amount,
          platformFee: invoice.platform_fee,
          totalAmount: invoice.total_amount,
          paymentMethod: invoice.payment_method,
          paymentReference: invoice.payment_reference,
          paymentDate: new Date(invoice.payment_date).toLocaleDateString(),
          currency: invoice.currency
        });
      }

      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: invoice.student_email,
          subject: `Invoice ${invoice.invoice_number} - PANA Academy Course Purchase`,
          html: html,
        }
      });

      if (error) throw error;

      toast.success(`Invoice ${invoice.invoice_number} successfully resent!`);
    } catch (error) {
      console.error('Error resending invoice:', error);
      toast.error('Failed to resend invoice. Please check the console for details.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage and view all course purchase invoices
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-xl sm:text-2xl font-bold">{invoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Unique Students</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {new Set(invoices.map(inv => inv.student_email)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold truncate">
                    NGN {invoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {invoices.filter(inv =>
                      new Date(inv.created_at).getMonth() === new Date().getMonth() &&
                      new Date(inv.created_at).getFullYear() === new Date().getFullYear()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Invoices Table - scrollable on small screens */}
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4 max-w-sm mx-auto">
                          <div className="p-3 rounded-full bg-muted">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {searchTerm ? 'No invoices found matching your search' : 'No invoices found'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Invoices are automatically generated for new successful course purchases.
                              Historical transactions can be viewed in the Payments section.
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard/payments')}
                            className="mt-2"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Payments
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium whitespace-nowrap">{invoice.student_name}</span>
                            <span className="text-sm text-muted-foreground">
                              {invoice.student_email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[180px] truncate" title={invoice.course_title}>
                            {invoice.course_title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-medium">
                              {invoice.currency} {invoice.total_amount.toLocaleString()}
                            </span>
                            {invoice.tax_amount > 0 && (
                              <span className="text-xs text-muted-foreground">
                                +{invoice.currency} {invoice.tax_amount.toLocaleString()} tax
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs">
                              {invoice.payment_method}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              #{invoice.payment_reference.slice(-8)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                            <Calendar className="h-3 w-3" />
                            {new Date(invoice.payment_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadInvoice(invoice)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resendInvoice(invoice)}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Resend
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

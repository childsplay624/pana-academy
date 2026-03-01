import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CheckCircle2,
    XCircle,
    Eye,
    Loader2,
    Search,
    AlertCircle,
    FileText
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    getAllManualPayments,
    approvePayment,
    rejectPayment
} from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/services/emailService';
import type { Payment, PaymentStatus } from '@/types/database.types';

export default function PaymentManagement() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchPayments();
    }, [filterStatus]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const statusArg = filterStatus === 'all' ? undefined : filterStatus;
            const data = await getAllManualPayments(statusArg);
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch manual payments',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const { success, error } = await approvePayment(id);
            if (success) {
                toast({
                    title: 'Success',
                    description: 'Payment approved and student enrolled',
                });

                // Send payment confirmation email (non-blocking)
                const payment = payments.find(p => p.id === id);
                if (payment?.profiles?.email && payment?.profiles?.full_name && payment?.courses?.title) {
                    sendEmail({
                        to: payment.profiles.email,
                        type: 'payment_confirmed',
                        payload: {
                            userName: payment.profiles.full_name,
                            courseTitle: payment.courses.title,
                            amount: payment.amount?.toLocaleString(),
                            reference: payment.reference,
                        }
                    }).catch(err => console.warn('Payment confirmation email failed (non-critical):', err));
                }

                fetchPayments();
            } else {
                throw error;
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            toast({
                title: 'Error',
                description: 'Failed to approve payment',
                variant: 'destructive'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!selectedPayment) return;
        setProcessingId(selectedPayment.id);
        try {
            const { success, error } = await rejectPayment(selectedPayment.id, rejectionReason);
            if (success) {
                toast({
                    title: 'Payment Rejected',
                    description: 'The payment has been marked as failed',
                });

                // Send payment rejection email (non-blocking)
                if (selectedPayment?.profiles?.email && selectedPayment?.profiles?.full_name && selectedPayment?.courses?.title) {
                    sendEmail({
                        to: selectedPayment.profiles.email,
                        type: 'payment_rejected',
                        payload: {
                            userName: selectedPayment.profiles.full_name,
                            courseTitle: selectedPayment.courses.title,
                            reason: rejectionReason || undefined,
                        }
                    }).catch(err => console.warn('Payment rejection email failed (non-critical):', err));
                }

                setIsRejectOpen(false);
                setRejectionReason('');
                fetchPayments();
            } else {
                throw error;
            }
        } catch (error) {
            console.error('Error rejecting payment:', error);
            toast({
                title: 'Error',
                description: 'Failed to reject payment',
                variant: 'destructive'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = payments.filter(p =>
        p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
            case 'pending': return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
            case 'failed': return <Badge variant="destructive">Failed</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Payment Management</h1>
                    <p className="text-muted-foreground">Review and approve manual bank transfer receipts</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg w-full md:w-auto">
                        <Button
                            variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterStatus('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterStatus === 'pending' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterStatus('pending')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant={filterStatus === 'completed' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterStatus('completed')}
                        >
                            Completed
                        </Button>
                        <Button
                            variant={filterStatus === 'failed' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterStatus('failed')}
                        >
                            Failed
                        </Button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reference, user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading payments...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No manual payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{payment.profiles?.full_name}</span>
                                                    <span className="text-xs text-muted-foreground">{payment.profiles?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">{payment.courses?.title}</TableCell>
                                            <TableCell className="font-semibold">₦{payment.amount.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setIsViewOpen(true);
                                                        }}
                                                        title="View Receipt"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    {payment.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="icon"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => handleApprove(payment.id)}
                                                                disabled={processingId === payment.id}
                                                            >
                                                                {processingId === payment.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setSelectedPayment(payment);
                                                                    setIsRejectOpen(true);
                                                                }}
                                                                disabled={processingId === payment.id}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* View Receipt Dialog */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Payment Receipt</DialogTitle>
                            <DialogDescription>
                                Reference: {selectedPayment?.reference}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 border rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center min-h-[300px]">
                            {selectedPayment?.receipt_url ? (
                                selectedPayment.receipt_url.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center gap-4 p-8">
                                        <FileText className="h-16 w-16 text-muted-foreground" />
                                        <Button asChild>
                                            <a href={selectedPayment.receipt_url} target="_blank" rel="noreferrer">
                                                Open PDF Receipt
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedPayment.receipt_url}
                                        alt="Payment Receipt"
                                        className="max-w-full max-h-[500px] object-contain"
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <AlertCircle className="h-8 w-8" />
                                    <span>No receipt uploaded</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 flex justify-between items-center sm:justify-between w-full">
                            <div className="text-sm">
                                <span className="font-semibold">Amount:</span> ₦{selectedPayment?.amount.toLocaleString()}
                            </div>
                            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Payment Dialog */}
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Payment</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to reject this payment? This will mark it as failed.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for rejection (Optional)</Label>
                                <Input
                                    id="reason"
                                    placeholder="e.g. Invalid receipt, Amount mismatch"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={processingId === selectedPayment?.id}
                            >
                                {processingId === selectedPayment?.id ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    'Confirm Rejection'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

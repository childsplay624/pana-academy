import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    Mail,
    Send,
    UserPlus,
    CheckCircle,
    Trophy,
    GraduationCap,
    Flame,
    FileText,
    AlertCircle,
    XCircle,
    Zap
} from 'lucide-react';
import { sendEmail } from '@/services/emailService';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

export function EmailTester() {
    const [testEmail, setTestEmail] = useState('');
    const [testName, setTestName] = useState('Test Student');
    const [isSending, setIsSending] = useState<string | null>(null);
    const {
        sendEnrollmentConfirmation,
        sendCertificateNotification,
        sendLevelUpNotification,
        sendStreakReminder
    } = useEmailNotifications();

    const handleTest = async (type: string, action: () => Promise<any>) => {
        if (!testEmail) {
            toast.error('Please enter a test email address');
            return;
        }

        setIsSending(type);
        try {
            await action();
            toast.success(`${type} test email sent to ${testEmail}`);
        } catch (error) {
            console.error(`Error sending ${type} email:`, error);
            toast.error(`Failed to send ${type} email`);
        } finally {
            setIsSending(null);
        }
    };

    const emailTests = [
        {
            id: 'welcome',
            name: 'Welcome Email',
            description: 'Sent when a new student signs up.',
            icon: UserPlus,
            color: 'text-blue-500',
            action: () => sendEmail({
                to: testEmail,
                type: 'welcome',
                payload: { name: testName }
            })
        },
        {
            id: 'enrollment',
            name: 'Course Enrollment',
            description: 'Sent when a student enrolls in a course.',
            icon: CheckCircle,
            color: 'text-green-500',
            action: () => sendEnrollmentConfirmation('Fullstack Development Mock', testName, testEmail)
        },
        {
            id: 'payment_confirmed',
            name: 'Payment Confirmed',
            description: 'Sent when a payment is approved.',
            icon: Zap,
            color: 'text-amber-500',
            action: () => sendEmail({
                to: testEmail,
                type: 'payment_confirmed',
                payload: {
                    userName: testName,
                    courseTitle: 'Advanced UI Design',
                    amount: '25,000',
                    reference: 'PANA-TEST-123'
                }
            })
        },
        {
            id: 'payment_rejected',
            name: 'Payment Rejected',
            description: 'Sent when a payment receipt is rejected.',
            icon: XCircle,
            color: 'text-red-500',
            action: () => sendEmail({
                to: testEmail,
                type: 'payment_rejected',
                payload: {
                    userName: testName,
                    courseTitle: 'Advanced UI Design',
                    reason: 'Uploaded image was not a valid receipt.'
                }
            })
        },
        {
            id: 'certificate',
            name: 'Certificate Earned',
            description: 'Sent upon course completion.',
            icon: Trophy,
            color: 'text-gold-500',
            action: () => sendCertificateNotification('React Mastery', testName, testEmail)
        },
        {
            id: 'level_up',
            name: 'Level Up!',
            description: 'Celebrates reaching a new level.',
            icon: GraduationCap,
            color: 'text-red-600',
            action: () => sendLevelUpNotification(testName, testEmail, 5, 2500)
        },
        {
            id: 'streak',
            name: 'Streak Reminder',
            description: 'Sent when a streak is at risk.',
            icon: Flame,
            color: 'text-orange-500',
            action: () => sendStreakReminder(testName, testEmail, 12, 4)
        },
        {
            id: 'invoice',
            name: 'Invoice/Receipt',
            description: 'Sent after a successful purchase.',
            icon: FileText,
            color: 'text-slate-600',
            action: () => sendEmail({
                to: testEmail,
                type: 'invoice',
                payload: {
                    userName: testName,
                    invoiceNumber: 'INV001-TEST',
                    courseTitle: 'Business Mastery Program',
                    subtotal: '45,000',
                    tax: '3,375',
                    fee: '1,500',
                    total: '49,875',
                    reference: 'TRANS-REF-MOCK',
                    method: 'Card Payment',
                    date: new Date().toLocaleDateString()
                }
            })
        }
    ];

    return (
        <Card className="border-red-100 bg-red-50/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-red-600" />
                    Email System Tester
                </CardTitle>
                <CardDescription>
                    Send real transactional emails to verify templates and delivery.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-red-100">
                    <div className="space-y-2">
                        <Label htmlFor="test-email">Destination Email</Label>
                        <Input
                            id="test-email"
                            placeholder="e.g. testing@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="bg-muted/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="test-name">Mock Name</Label>
                        <Input
                            id="test-name"
                            placeholder="e.g. John Doe"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="bg-muted/30"
                        />
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {emailTests.map((test) => {
                        const Icon = test.icon;
                        return (
                            <div
                                key={test.id}
                                className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-slate-950 hover:border-red-200 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-900 ${test.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold">{test.name}</h4>
                                        <p className="text-xs text-muted-foreground">{test.description}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isSending !== null}
                                    onClick={() => handleTest(test.name, test.action)}
                                >
                                    {isSending === test.id ? (
                                        <Send className="h-4 w-4 animate-pulse" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> These emails are sent using your live Resend configuration. Make sure you are using a verified domain or your registered Resend test email address if in sandbox mode.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

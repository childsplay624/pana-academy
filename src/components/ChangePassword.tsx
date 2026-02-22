import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';

export function ChangePassword() {
    const { toast } = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Password requirements
    const requirements = [
        { label: 'At least 8 characters', met: newPassword.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
        { label: 'Contains a number', met: /[0-9]/.test(newPassword) },
        { label: 'Passwords match', met: newPassword.length > 0 && newPassword === confirmPassword },
    ];

    const allMet = requirements.every(r => r.met);

    const handleChangePassword = async () => {
        if (!allMet) {
            toast({
                title: 'Invalid Password',
                description: 'Please ensure all password requirements are met.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setSaving(true);

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            toast({
                title: 'Password Updated',
                description: 'Your password has been changed successfully.',
            });

            // Clear form
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to change password. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your account password. You'll use the new password next time you log in.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="new-password"
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowNew(!showNew)}
                            tabIndex={-1}
                        >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowConfirm(!showConfirm)}
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Requirements checklist */}
                {newPassword.length > 0 && (
                    <div className="space-y-2 p-4 rounded-lg border bg-muted/30">
                        <p className="text-sm font-medium mb-2">Password Requirements</p>
                        {requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                {req.met ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                )}
                                <span className={req.met ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                                    {req.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    onClick={handleChangePassword}
                    disabled={saving || !allMet}
                    className="w-full sm:w-auto"
                >
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Lock className="mr-2 h-4 w-4" />
                            Update Password
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

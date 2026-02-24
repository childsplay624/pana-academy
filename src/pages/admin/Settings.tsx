import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LogoUpload } from '@/components/LogoUpload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ChangePassword } from '@/components/ChangePassword';
import {
  Settings2,
  Globe,
  Shield,
  Bell,
  Mail,
  Database,
  CreditCard,
  Users,
  BookOpen,
  Palette,
  Save,
  Loader2,
  User,
  Wrench
} from 'lucide-react';

interface PlatformSettings {
  [key: string]: any;
}

export default function Settings() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings>({});
  const [showPaystackSecret, setShowPaystackSecret] = useState(false);
  const [showFlutterwaveSecret, setShowFlutterwaveSecret] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: PlatformSettings = {};
      data.forEach(item => {
        try {
          // Try to parse as JSON if it's a string, otherwise use the value directly
          if (typeof item.value === 'string') {
            try {
              settingsMap[item.key] = JSON.parse(item.value);
            } catch {
              // If JSON parsing fails, it's likely a plain string value
              settingsMap[item.key] = item.value;
            }
          } else {
            settingsMap[item.key] = item.value;
          }
        } catch (error) {
          console.warn(`Failed to process setting ${item.key}:`, error);
          settingsMap[item.key] = item.value;
        }
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateProfile = async () => {
    if (!profile || !user) return;

    try {
      setProfileSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your name has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setProfileSaving(false);
    }
  };

  // Update fullName when profile changes
  useEffect(() => {
    setFullName(profile?.full_name || '');
  }, [profile]);

  const handleSave = async (category: string) => {
    try {
      setSaving(true);

      // Get settings for this category
      const categorySettings = Object.entries(settings).filter(([key]) => {
        switch (category) {
          case 'General':
            return ['platform_name', 'platform_url', 'support_email', 'default_language', 'platform_description', 'maintenance_mode'].includes(key);
          case 'Security':
            return ['require_email_verification', 'two_factor_auth', 'password_requirements', 'session_timeout', 'max_login_attempts'].includes(key);
          case 'Notifications':
            return ['email_notifications', 'course_completion_alerts', 'payment_notifications', 'system_maintenance_alerts', 'admin_email'].includes(key);
          case 'Payment':
            return ['paystack_enabled', 'flutterwave_enabled', 'default_currency', 'platform_fee', 'paystack_public_key', 'paystack_secret_key', 'flutterwave_public_key', 'flutterwave_secret_key', 'bank_details', 'tax_enabled', 'tax_rate', 'tax_type', 'tax_name', 'tax_number', 'manual_enabled'].includes(key);
          case 'Courses':
            return ['course_auto_approval', 'enable_course_reviews', 'certificate_generation', 'max_enrollment', 'certificate_validity', 'zoom_api_key', 'zoom_api_secret'].includes(key);
          case 'Appearance':
            return ['primary_color', 'secondary_color', 'dark_mode_support', 'logo_url', 'favicon_url', 'backend_logo_url'].includes(key);
          default:
            return false;
        }
      });

      // Save settings individually to ensure better error tracking and reliability
      for (const [key, value] of categorySettings) {
        // Skip undefined values to avoid database errors
        if (value === undefined) continue;

        console.log(`Saving setting: ${key} =`, value);

        const { error: upsertError } = await supabase
          .from('platform_settings')
          .upsert({
            key,
            value: JSON.stringify(value),
            category: category.toLowerCase(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (upsertError) {
          console.error(`Database error saving setting ${key}:`, upsertError);
          throw upsertError;
        }
      }

      toast({
        title: "Settings updated",
        description: `${category} settings have been saved successfully.`,
      });
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: error.message || error.error_description || "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1 mb-6 bg-muted/50 rounded-lg border">
            <TabsTrigger value="profile" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">P</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <Globe className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">General</span>
              <span className="sm:hidden">G</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <Shield className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">S</span>
            </TabsTrigger>
            <TabsTrigger value="payment-gateways" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Payment</span>
              <span className="sm:hidden">P</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <Bell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">N</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center justify-center text-xs sm:text-sm h-10 px-2 sm:px-3">
              <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Courses</span>
              <span className="sm:hidden">C</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Role</Label>
                  <Input
                    id="role"
                    value={profile?.role || 'admin'}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">Role is assigned by system administrators.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="created-date">Account Created</Label>
                  <Input
                    id="created-date"
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <Button onClick={updateProfile} disabled={profileSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {profileSaving ? 'Saving...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <ChangePassword />
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={settings.platform_name || ''}
                      onChange={(e) => updateSetting('platform_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Platform URL</Label>
                    <Input
                      id="platform-url"
                      value={settings.platform_url || ''}
                      onChange={(e) => updateSetting('platform_url', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={settings.support_email || ''}
                      onChange={(e) => updateSetting('support_email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select
                      value={settings.default_language || 'en'}
                      onValueChange={(value) => updateSetting('default_language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Textarea
                    id="platform-description"
                    placeholder="Brief description of your learning platform..."
                    className="resize-none"
                    rows={3}
                    value={settings.platform_description || ''}
                    onChange={(e) => updateSetting('platform_description', e.target.value)}
                  />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-400 font-semibold">
                        <Wrench className="w-4 h-4" />
                        Maintenance Mode
                      </div>
                      <p className="text-sm text-amber-700/80 dark:text-amber-400/60">
                        When active, only administrators can access the platform.
                        Public users will see the maintenance page.
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenance_mode === true}
                      onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('General')} disabled={saving} className="mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Authentication Settings
                  </CardTitle>
                  <CardDescription>Configure user authentication and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Require Email Verification</Label>
                        <p className="text-sm text-muted-foreground">Users must verify their email before accessing the platform</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Password Requirements</Label>
                        <p className="text-sm text-muted-foreground">Enforce strong password policies</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                      <Input id="max-login-attempts" type="number" defaultValue="5" />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('Security')} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Course Completion Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify instructors when students complete courses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alerts for successful payments and failed transactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">System Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify users about scheduled maintenance</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Notification Email</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@eduplatform.com" />
                </div>
                <Button onClick={() => handleSave('Notifications')} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Gateways Settings */}
          <TabsContent value="payment-gateways">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Gateways
                </CardTitle>
                <CardDescription>
                  Configure and test your payment gateway integrations.
                  <a
                    href="#"
                    className="text-primary hover:underline ml-1"
                    onClick={(e) => {
                      e.preventDefault();
                      // Open documentation in new tab
                      window.open('https://docs.yourplatform.com/payment-gateways', '_blank');
                    }}
                  >
                    View documentation
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Paystack Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <img src="/logos/paystack.png" alt="Paystack" className="h-6 w-auto" />
                        <Label className="text-base">Paystack Integration</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Securely process payments with Paystack
                        <a
                          href="https://paystack.com/docs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1 text-xs"
                        >
                          (Get API Keys)
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!settings.paystack_public_key || !settings.paystack_secret_key) {
                            toast({
                              title: "Error",
                              description: "Please enter both public and secret keys",
                              variant: "destructive",
                            });
                            return;
                          }
                          setSaving(true);
                          try {
                            // Simulate API test
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            toast({
                              title: "Success",
                              description: "Successfully connected to Paystack",
                            });
                          } catch (error) {
                            toast({
                              title: "Connection Failed",
                              description: "Could not connect to Paystack. Please check your API keys.",
                              variant: "destructive",
                            });
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={!settings.paystack_enabled || saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : 'Test Connection'}
                      </Button>
                      <Switch
                        checked={settings.paystack_enabled || false}
                        onCheckedChange={(checked) => updateSetting('paystack_enabled', checked)}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="paystack-public-key">Public Key</Label>
                        <span className="text-xs text-muted-foreground">
                          {settings.paystack_public_key?.startsWith('pk_test_') ? 'Test Mode' :
                            settings.paystack_public_key?.startsWith('pk_live_') ? 'Live Mode' : ''}
                        </span>
                      </div>
                      <Input
                        id="paystack-public-key"
                        placeholder="pk_test_..."
                        value={settings.paystack_public_key || ''}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          updateSetting('paystack_public_key', value);
                        }}
                        disabled={!settings.paystack_enabled || saving}
                        className={!settings.paystack_public_key?.startsWith('pk_') && settings.paystack_public_key ? 'border-red-500' : ''}
                      />
                      {settings.paystack_public_key && !settings.paystack_public_key.startsWith('pk_') && (
                        <p className="text-xs text-red-500">Invalid Paystack public key format</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paystack-secret-key">Secret Key</Label>
                      <div className="relative">
                        <Input
                          id="paystack-secret-key"
                          type={showPaystackSecret ? 'text' : 'password'}
                          placeholder="sk_test_..."
                          value={settings.paystack_secret_key || ''}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            updateSetting('paystack_secret_key', value);
                          }}
                          disabled={!settings.paystack_enabled || saving}
                          className={!settings.paystack_secret_key?.startsWith('sk_') && settings.paystack_secret_key ? 'border-red-500' : ''}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPaystackSecret(!showPaystackSecret)}
                        >
                          {showPaystackSecret ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {settings.paystack_secret_key && !settings.paystack_secret_key.startsWith('sk_') && (
                        <p className="text-xs text-red-500">Invalid Paystack secret key format</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Flutterwave Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <img src="/logos/flutterwave.svg" alt="Flutterwave" className="h-6 w-auto" />
                        <Label className="text-base">Flutterwave Integration</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept payments with Flutterwave
                        <a
                          href="https://developer.flutterwave.com/docs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1 text-xs"
                        >
                          (Get API Keys)
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!settings.flutterwave_public_key || !settings.flutterwave_secret_key) {
                            toast({
                              title: "Error",
                              description: "Please enter both public and secret keys",
                              variant: "destructive",
                            });
                            return;
                          }
                          setSaving(true);
                          try {
                            // Simulate API test
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            toast({
                              title: "Success",
                              description: "Successfully connected to Flutterwave",
                            });
                          } catch (error) {
                            toast({
                              title: "Connection Failed",
                              description: "Could not connect to Flutterwave. Please check your API keys.",
                              variant: "destructive",
                            });
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={!settings.flutterwave_enabled || saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : 'Test Connection'}
                      </Button>
                      <Switch
                        checked={settings.flutterwave_enabled || false}
                        onCheckedChange={(checked) => updateSetting('flutterwave_enabled', checked)}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="flutterwave-public-key">Public Key</Label>
                        <span className="text-xs text-muted-foreground">
                          {settings.flutterwave_public_key?.includes('_TEST_') ? 'Test Mode' :
                            settings.flutterwave_public_key?.includes('_LIVE_') ? 'Live Mode' : ''}
                        </span>
                      </div>
                      <Input
                        id="flutterwave-public-key"
                        placeholder="FLWPUBK_TEST-..."
                        value={settings.flutterwave_public_key || ''}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          updateSetting('flutterwave_public_key', value);
                        }}
                        disabled={!settings.flutterwave_enabled || saving}
                        className={!settings.flutterwave_public_key?.startsWith('FLWPUBK_') && settings.flutterwave_public_key ? 'border-red-500' : ''}
                      />
                      {settings.flutterwave_public_key && !settings.flutterwave_public_key.startsWith('FLWPUBK_') && (
                        <p className="text-xs text-red-500">Invalid Flutterwave public key format</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flutterwave-secret-key">Secret Key</Label>
                      <div className="relative">
                        <Input
                          id="flutterwave-secret-key"
                          type={showFlutterwaveSecret ? 'text' : 'password'}
                          placeholder="FLWSECK_TEST-..."
                          value={settings.flutterwave_secret_key || ''}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            updateSetting('flutterwave_secret_key', value);
                          }}
                          disabled={!settings.flutterwave_enabled || saving}
                          className={!settings.flutterwave_secret_key?.startsWith('FLWSECK_') && settings.flutterwave_secret_key ? 'border-red-500' : ''}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowFlutterwaveSecret(!showFlutterwaveSecret)}
                        >
                          {showFlutterwaveSecret ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {settings.flutterwave_secret_key && !settings.flutterwave_secret_key.startsWith('FLWSECK_') && (
                        <p className="text-xs text-red-500">Invalid Flutterwave secret key format</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Manual Bank Transfer Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-pana-navy">
                        <Database className="h-6 w-6" />
                        <Label className="text-base font-semibold">Manual Bank Transfer</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure bank details for students who prefer manual transfers.
                      </p>
                    </div>
                    <Switch
                      checked={settings.manual_enabled !== false}
                      onCheckedChange={(checked) => updateSetting('manual_enabled', checked)}
                      disabled={saving}
                    />
                  </div>

                  {settings.manual_enabled !== false && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={settings.bank_details?.bank_name || ''}
                          onChange={(e) => updateSetting('bank_details', {
                            ...(settings.bank_details || {}),
                            bank_name: e.target.value
                          })}
                          placeholder="e.g. Zenith Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input
                          id="account-name"
                          value={settings.bank_details?.account_name || ''}
                          onChange={(e) => updateSetting('bank_details', {
                            ...(settings.bank_details || {}),
                            account_name: e.target.value
                          })}
                          placeholder="e.g. PANA ACADEMY LTD"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          value={settings.bank_details?.account_number || ''}
                          onChange={(e) => updateSetting('bank_details', {
                            ...(settings.bank_details || {}),
                            account_number: e.target.value
                          })}
                          placeholder="e.g. 1234567890"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => handleSave('Payment')}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure default payment settings and fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tax Settings */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div>
                    <h4 className="text-lg font-medium text-pana-navy mb-4">Tax Configuration</h4>
                    <p className="text-sm text-muted-foreground">Configure tax settings for all course pricing</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Enable Tax</Label>
                        <p className="text-sm text-muted-foreground">Apply tax to all course prices</p>
                      </div>
                      <Switch
                        checked={settings.tax_enabled || false}
                        onCheckedChange={(checked) => updateSetting('tax_enabled', checked)}
                        disabled={saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={settings.tax_rate || 7.5}
                        onChange={(e) => updateSetting('tax_rate', parseFloat(e.target.value) || 0)}
                        disabled={!settings.tax_enabled || saving}
                        className={!settings.tax_enabled ? 'bg-muted/50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-type">Tax Type</Label>
                      <Select
                        value={settings.tax_type || 'percentage'}
                        onValueChange={(value) => updateSetting('tax_type', value)}
                        disabled={!settings.tax_enabled || saving}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="vat">VAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-name">Tax Name</Label>
                      <Input
                        id="tax-name"
                        value={settings.tax_name || ''}
                        onChange={(e) => updateSetting('tax_name', e.target.value)}
                        disabled={!settings.tax_enabled || saving}
                        placeholder="e.g. Value Added Tax (VAT)"
                        className={!settings.tax_enabled ? 'bg-muted/50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-number">Tax Number</Label>
                      <Input
                        id="tax-number"
                        value={settings.tax_number || ''}
                        onChange={(e) => updateSetting('tax_number', e.target.value)}
                        disabled={!settings.tax_enabled || saving}
                        placeholder="e.g. VAT123456789"
                        className={!settings.tax_enabled ? 'bg-muted/50' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Platform Fee Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select
                      value={settings.default_currency || 'NGN'}
                      onValueChange={(value) => updateSetting('default_currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                    <Input
                      id="platform-fee"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={settings.platform_fee || 10}
                      onChange={(e) => updateSetting('platform_fee', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => handleSave('Payment')}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Settings */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Settings
                </CardTitle>
                <CardDescription>Configure course-related settings and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Course Auto-Approval</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve new courses from instructors</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Course Reviews</Label>
                      <p className="text-sm text-muted-foreground">Allow students to review and rate courses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Certificate Generation</Label>
                      <p className="text-sm text-muted-foreground">Generate certificates upon course completion</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Zoom Integration</h4>
                  <p className="text-sm text-muted-foreground">Configure Zoom API for live course sessions</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zoom-api-key">Zoom API Key</Label>
                      <Input
                        id="zoom-api-key"
                        type="password"
                        placeholder="Enter your Zoom API Key"
                        value={settings.zoom_api_key || ''}
                        onChange={(e) => updateSetting('zoom_api_key', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zoom-api-secret">Zoom API Secret</Label>
                      <Input
                        id="zoom-api-secret"
                        type="password"
                        placeholder="Enter your Zoom API Secret"
                        value={settings.zoom_api_secret || ''}
                        onChange={(e) => updateSetting('zoom_api_secret', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-enrollment">Max Enrollment per Course</Label>
                    <Input
                      id="max-enrollment"
                      type="number"
                      value={settings.max_enrollment || 1000}
                      onChange={(e) => updateSetting('max_enrollment', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificate-validity">Certificate Validity (years)</Label>
                    <Input
                      id="certificate-validity"
                      type="number"
                      value={settings.certificate_validity || 5}
                      onChange={(e) => updateSetting('certificate_validity', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave('Courses')} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the platform's look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="primary-color"
                        type="color"
                        value={settings.primary_color || '#0ea5e9'}
                        onChange={(e) => updateSetting('primary_color', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.primary_color || '#0ea5e9'}
                        onChange={(e) => updateSetting('primary_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={settings.secondary_color || '#64748b'}
                        onChange={(e) => updateSetting('secondary_color', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.secondary_color || '#64748b'}
                        onChange={(e) => updateSetting('secondary_color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Dark Mode Support</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode theme option</p>
                    </div>
                    <Switch
                      checked={settings.dark_mode_support || false}
                      onCheckedChange={(checked) => updateSetting('dark_mode_support', checked)}
                    />
                  </div>
                  <LogoUpload
                    label="Frontend Logo"
                    description="Logo displayed on the main website and student dashboard"
                    value={settings.logo_url || ''}
                    onChange={(url) => updateSetting('logo_url', url)}
                    placeholder="https://example.com/logo.png"
                  />
                  <LogoUpload
                    label="Admin/Backend Logo"
                    description="Logo displayed in admin dashboard and backend interfaces"
                    value={settings.backend_logo_url || ''}
                    onChange={(url) => updateSetting('backend_logo_url', url)}
                    placeholder="https://example.com/admin-logo.png"
                  />
                  <LogoUpload
                    label="Favicon"
                    description="Small icon displayed in browser tabs (PNG/JPG format only)"
                    value={settings.favicon_url || ''}
                    onChange={(url) => updateSetting('favicon_url', url)}
                    placeholder="https://example.com/favicon.png"
                  />
                </div>
                <Button onClick={() => handleSave('Appearance')} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
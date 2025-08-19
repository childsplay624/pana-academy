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
import { supabase } from '@/integrations/supabase/client';
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
  Loader2
} from 'lucide-react';

interface PlatformSettings {
  [key: string]: any;
}

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings>({});

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

  const handleSave = async (category: string) => {
    try {
      setSaving(true);
      
      // Get settings for this category
      const categorySettings = Object.entries(settings).filter(([key]) => {
        switch (category) {
          case 'General':
            return ['platform_name', 'platform_url', 'support_email', 'default_language', 'platform_description'].includes(key);
          case 'Security':
            return ['require_email_verification', 'two_factor_auth', 'password_requirements', 'session_timeout', 'max_login_attempts'].includes(key);
          case 'Notifications':
            return ['email_notifications', 'course_completion_alerts', 'payment_notifications', 'system_maintenance_alerts', 'admin_email'].includes(key);
          case 'Payment':
            return ['paystack_enabled', 'flutterwave_enabled', 'default_currency', 'platform_fee', 'paystack_public_key', 'paystack_secret_key', 'flutterwave_public_key', 'flutterwave_secret_key'].includes(key);
          case 'Courses':
            return ['course_auto_approval', 'enable_course_reviews', 'certificate_generation', 'max_enrollment', 'certificate_validity', 'zoom_api_key', 'zoom_api_secret'].includes(key);
          case 'Appearance':
            return ['primary_color', 'secondary_color', 'dark_mode_support', 'logo_url', 'favicon_url', 'backend_logo_url'].includes(key);
          default:
            return false;
        }
      });

      // Update each setting in the database
      for (const [key, value] of categorySettings) {
        const { error } = await supabase
          .from('platform_settings')
          .update({ value: JSON.stringify(value) })
          .eq('key', key);

        if (error) throw error;
      }

      toast({
        title: "Settings updated",
        description: `${category} settings have been saved successfully.`,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

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
                <Button onClick={() => handleSave('General')} disabled={saving}>
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

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Settings
                </CardTitle>
                <CardDescription>Configure payment gateways and pricing</CardDescription>
              </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <Label className="text-base">Paystack Integration</Label>
                       <p className="text-sm text-muted-foreground">Enable Paystack payment gateway</p>
                     </div>
                     <Switch 
                       checked={settings.paystack_enabled || false}
                       onCheckedChange={(checked) => updateSetting('paystack_enabled', checked)}
                     />
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="paystack-public-key">Paystack Public Key</Label>
                       <Input 
                         id="paystack-public-key" 
                         placeholder="pk_test_..."
                         value={settings.paystack_public_key || ''} 
                         onChange={(e) => updateSetting('paystack_public_key', e.target.value)}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="paystack-secret-key">Paystack Secret Key</Label>
                       <Input 
                         id="paystack-secret-key" 
                         type="password"
                         placeholder="sk_test_..."
                         value={settings.paystack_secret_key || ''} 
                         onChange={(e) => updateSetting('paystack_secret_key', e.target.value)}
                       />
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <div>
                       <Label className="text-base">Flutterwave Integration</Label>
                       <p className="text-sm text-muted-foreground">Enable Flutterwave payment gateway</p>
                     </div>
                     <Switch 
                       checked={settings.flutterwave_enabled || false}
                       onCheckedChange={(checked) => updateSetting('flutterwave_enabled', checked)}
                     />
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="flutterwave-public-key">Flutterwave Public Key</Label>
                       <Input 
                         id="flutterwave-public-key" 
                         placeholder="FLWPUBK_TEST-..."
                         value={settings.flutterwave_public_key || ''} 
                         onChange={(e) => updateSetting('flutterwave_public_key', e.target.value)}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="flutterwave-secret-key">Flutterwave Secret Key</Label>
                       <Input 
                         id="flutterwave-secret-key" 
                         type="password"
                         placeholder="FLWSECK_TEST-..."
                         value={settings.flutterwave_secret_key || ''} 
                         onChange={(e) => updateSetting('flutterwave_secret_key', e.target.value)}
                       />
                     </div>
                   </div>
                </div>
                <Separator />
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
                       value={settings.platform_fee || 10} 
                       onChange={(e) => updateSetting('platform_fee', parseFloat(e.target.value))}
                     />
                   </div>
                 </div>
                 <Button onClick={() => handleSave('Payment')} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
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
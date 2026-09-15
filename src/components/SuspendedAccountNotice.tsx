import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function SuspendedAccountNotice() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-amber-500/30 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Account Suspended
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Access to PANA Institute resources is currently restricted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account ({user?.email}) has been suspended by an administrator. While suspended, you cannot access courses, certificates, or dashboard features.
          </p>
          <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            If you believe this suspension was made in error or wish to appeal, please contact the academy administration.
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              asChild
              className="w-full border-primary/20 hover:bg-primary/5"
            >
              <a href="mailto:support@panaholdings.com?subject=Suspended%20Account%20Inquiry">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut()}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

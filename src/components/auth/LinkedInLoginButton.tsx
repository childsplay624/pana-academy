import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';
import { signInWithLinkedIn } from '@/lib/auth-utils';

export function LinkedInLoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error('LinkedIn login error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 bg-[#0077B5] text-white hover:bg-[#006097]"
      onClick={handleLogin}
    >
      <Linkedin className="w-5 h-5" />
      <span>Continue with LinkedIn</span>
    </Button>
  );
}

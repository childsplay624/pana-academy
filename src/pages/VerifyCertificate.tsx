import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useCertificates, Certificate } from '@/hooks/useCertificates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ShieldCheck, 
  Search, 
  Award,
  Download,
  Copy,
  Check,
  ExternalLink,
  Hash,
  BookOpen,
  UserCheck,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Clock,
  Lock,
  ShieldX
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const { verifyCertificate } = useCertificates();
  const { toast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setVerificationCode(code);
      handleVerification(code);
    }
  }, [searchParams]);

  const handleVerification = async (code?: string) => {
    const codeToVerify = code || verificationCode;
    if (!codeToVerify.trim()) {
      toast({
        title: 'Verification Error',
        description: 'Please enter a verification code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await verifyCertificate(codeToVerify.trim());
      setCertificate(result);
      toast({
        title: 'Success',
        description: 'Certificate verified successfully',
      });
    } catch (error: any) {
      setCertificate(null);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Could not verify the certificate',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!verificationCode) return;
    
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    
    toast({
      title: 'Copied!',
      description: 'Verification code copied to clipboard',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow bg-gradient-to-br from-pana-navy/5 to-pana-blue/5 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <div className="bg-pana-blue/10 p-4 rounded-2xl">
              <ShieldCheck className="h-12 w-12 text-pana-blue" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pana-navy to-pana-blue">
              Certificate Verification
            </h1>
            <p className="text-lg text-muted-foreground">
              Verify the authenticity of certificates issued by PANA Academy
            </p>
          </div>
        </motion.div>

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-3xl mx-auto border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-pana-blue/10 rounded-lg">
                  <Search className="h-6 w-6 text-pana-blue" />
                </div>
                Verify Certificate
              </CardTitle>
              <CardDescription>
                Enter the verification code found on your certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                  />
                  {verificationCode && (
                    <button 
                      onClick={handleCopyCode}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Copy verification code"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <Button 
                  onClick={() => handleVerification()}
                  disabled={isLoading || !verificationCode.trim()}
                  className="h-12 px-6 text-base bg-pana-blue hover:bg-pana-navy transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify Now
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                The verification code can be found at the bottom of your certificate
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {certificate ? (
              <>
                {/* Success Banner */}
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                          Certificate Verified Successfully
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mt-1">
                          This is a valid certificate issued by PANA Academy
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button className="gap-2 bg-pana-blue hover:bg-pana-navy">
                        <ExternalLink className="h-4 w-4" />
                        View Full Certificate
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-pana-navy/5 border-b">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">Certificate is valid and verified</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
                      {/* Left Column */}
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            LEARNER INFORMATION
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{certificate.title || 'Professional Certificate'}</h3>
                              <p className="text-muted-foreground">Awarded to {certificate.title || 'the recipient'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Instructor</p>
                              <p className="font-medium">{certificate.instructor_name || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            COURSE DETAILS
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Course Title</p>
                              <p className="font-medium">{certificate.course_title || 'N/A'}</p>
                            </div>
                            {certificate.instructor_name && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Recipient</p>
                                  <p className="text-sm text-muted-foreground">
                                    {certificate.title || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            )}
                            {certificate.course_duration_hours && (
                              <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">{certificate.course_duration_hours} hours</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            CERTIFICATE DETAILS
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Issued On</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(certificate.issued_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Verification Code</p>
                              <p className="font-mono text-sm text-muted-foreground">
                                {certificate.verification_code}
                              </p>
                            </div>
                            {certificate.course_duration_hours && (
                              <div>
                                <p className="text-sm font-medium">Course Duration</p>
                                <p className="text-sm text-muted-foreground">
                                  {certificate.course_duration_hours} hours
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <ShieldX className="h-6 w-6" />
                    Certificate Not Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The verification code you entered is either invalid, expired, or the certificate 
                    has been revoked. Please check the code and try again.
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Common issues:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Verification code was entered incorrectly</li>
                      <li>• Certificate has been revoked or expired</li>
                      <li>• Code is from a different verification system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
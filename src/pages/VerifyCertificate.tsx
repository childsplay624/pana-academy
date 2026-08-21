import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useCertificates } from '@/hooks/useCertificates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Award,
  Download,
  Hash,
  BookOpen,
  UserCheck,
  Calendar,
  ShieldX,
  Check,
  ExternalLink,
  User
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  
  interface VerifiedCertificate {
    id: string;
    user_id: string;
    course_id: string;
    enrollment_id: string;
    certificate_number: string;
    title: string;
    description?: string;
    issued_at: string;
    completion_date: string;
    grade?: string;
    score?: number;
    instructor_name: string;
    course_title: string;
    course_duration_hours?: number;
    certificate_url?: string;
    download_url?: string;
    verification_code: string;
    metadata?: Record<string, any>;
    is_valid: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
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
      const now = new Date().toISOString();
      
      const issuedAt = (result as any)?.issued_at || (result as any)?.issued_date || now;
      const completionDate = (result as any)?.completion_date || now;
      
      const certificateData: VerifiedCertificate = {
        id: result?.id || `cert_${Date.now()}`,
        user_id: result?.user_id || '',
        course_id: result?.course_id || '',
        enrollment_id: result?.enrollment_id || '',
        certificate_number: result?.certificate_number || codeToVerify,
        title: result?.title || result?.course_title || 'Certificate of Competency',
        description: result?.description,
        issued_at: issuedAt,
        completion_date: completionDate,
        grade: result?.grade,
        score: result?.score,
        instructor_name: result?.instructor_name || 'Governing Council Board',
        course_title: result?.course_title || result?.title || 'Professional Training',
        course_duration_hours: result?.course_duration_hours,
        certificate_url: result?.certificate_url,
        download_url: result?.download_url,
        verification_code: codeToVerify,
        metadata: result?.metadata,
        is_valid: result?.is_valid !== undefined ? result.is_valid : true,
        created_at: result?.created_at || now,
        updated_at: result?.updated_at || now,
        ...result
      };

      setCertificate(certificateData);
      toast({
        title: 'Success',
        description: 'Certificate verified successfully',
      });
    } catch (error: any) {
      console.error('Certificate verification error:', error);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink font-serif">
      <Navigation />
      
      <main className="flex-grow w-full">
        {/* Executive Dark Editorial Header */}
        <section className="bg-ink text-paper pt-36 pb-20 border-b border-zinc-800">
          <div className="max-w-[1320px] mx-auto px-7">
            <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
              PUBLIC VERIFICATION PORTAL · ISO STANDARDS & GOVERNANCE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper mb-4">
              Certificate of Competency Verification
            </h1>
            <p className="font-serif text-lg text-zinc-300 max-w-3xl leading-relaxed">
              Verify the official authenticity, validity status, and accredited transcript of credentials issued by PANA Institute.
            </p>
          </div>
        </section>

        {/* Verification Form Body */}
        <section className="py-20 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7 space-y-12">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="max-w-3xl mx-auto bg-paper-soft border border-line rounded-none p-8 md:p-12 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-line">
                  <div className="p-2.5 bg-paper border border-line text-oxblood rounded-none shrink-0">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-ink">Lookup Certificate ID</h2>
                    <p className="font-serif text-xs text-muted-foreground">Enter the unique verification code printed on your official document</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-oxblood" />
                    </div>
                    <Input
                      placeholder="e.g. PANA-2026-EX-8901"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 bg-paper border-line rounded-none focus:outline-none focus:border-oxblood font-mono text-sm uppercase"
                    />
                  </div>
                  <Button 
                    onClick={() => handleVerification()} 
                    disabled={isLoading}
                    className="h-12 bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 rounded-none font-semibold border border-oxblood-light"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Certificate'}
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Verification Results */}
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                {certificate ? (
                  <div className="bg-paper-soft border border-line rounded-none overflow-hidden shadow-xl space-y-6 p-8">
                    {/* Success Banner */}
                    <div className="bg-paper border border-oxblood/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-oxblood text-white rounded-none shrink-0">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-0.5">ACCREDITED REGISTRY RECORD</span>
                          <h3 className="font-serif text-xl font-bold text-ink">
                            Certificate Verified Successfully
                          </h3>
                          <p className="font-serif text-xs text-muted-foreground mt-0.5">
                            This document is an authentic credential officially issued by PANA Institute.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <Card className="bg-paper border border-line rounded-none overflow-hidden">
                      <CardHeader className="bg-paper-soft border-b border-line p-5">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-oxblood" />
                          <span className="font-mono text-xs text-oxblood uppercase tracking-wider font-semibold">VALIDATED IN PANA GOVERNANCE DIRECTORY</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
                          <div className="space-y-3">
                            <span className="font-mono text-[10px] text-brass uppercase font-semibold block">COURSE / PROGRAMME</span>
                            <h4 className="text-xl font-bold text-ink">{certificate.course_title || certificate.title}</h4>
                            <p className="text-xs text-muted-foreground">Issued to Candidate ID: {certificate.user_id || 'REGISTERED FELLOW'}</p>
                          </div>
                          <div className="space-y-3 font-mono text-xs">
                            <span className="text-brass uppercase font-semibold block text-[10px]">DOCUMENT METADATA</span>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">VERIFICATION CODE:</span>
                              <span className="font-semibold text-oxblood">{certificate.verification_code}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">DATE OF ISSUANCE:</span>
                              <span className="font-semibold text-ink">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="border border-oxblood/40 bg-paper-soft rounded-none p-8 text-center space-y-4">
                    <CardHeader className="p-0">
                      <div className="w-12 h-12 bg-oxblood text-white rounded-none flex items-center justify-center mx-auto mb-2">
                        <ShieldX className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-serif text-2xl font-bold text-ink">
                        Certificate Record Not Found
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="font-serif text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        The verification code you entered is invalid or does not match active records in the PANA Institute governance registry. Please check the code and try again.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
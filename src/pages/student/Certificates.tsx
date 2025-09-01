import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Award, 
  Download, 
  Search, 
  Calendar,
  ExternalLink,
  Trophy,
  Share2,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useCertificates } from '@/hooks/useCertificates';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Certificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const { certificates, stats, loading, error, downloadCertificate, shareCertificate, syncMissingCertificates } = useCertificates();
  const { profile } = useAuth();

  // Auto-sync missing certificates if none found after initial load
  const [synced, setSynced] = useState(false);
  useEffect(() => {
    if (!loading && !synced && certificates.length === 0) {
      setSynced(true);
      syncMissingCertificates();
    }
  }, [loading, certificates.length, synced, syncMissingCertificates]);

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (certificateId: string) => {
    downloadCertificate(certificateId);
  };

  const handleShare = (certificateId: string) => {
    shareCertificate(certificateId);
  };

  const handleVerify = (verificationCode: string) => {
    const verifyUrl = `/verify-certificate?code=${verificationCode}`;
    window.open(verifyUrl, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
            <p className="text-muted-foreground">
              Your achievements and course completion certificates
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                const profileUrl = `${window.location.origin}/user-profile`;
                navigator.clipboard.writeText(profileUrl);
                toast.success('Profile link copied to clipboard');
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.totalCertificates}</p>
                  )}
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  {loading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.thisMonth}</p>
                  )}
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold">{stats.averageGrade}</p>
                  )}
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Certificates */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                      <Badge variant="secondary">{cert.grade || 'Completed'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">Awarded to: {cert.student_name || profile?.full_name || 'Student'}</p>
                      <p className="text-sm text-muted-foreground">Course: {cert.course_title}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Issued: {new Date(cert.issued_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Completed: {new Date(cert.completion_date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Certificate: {cert.certificate_number}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verification: {cert.verification_code}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(cert.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(cert.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVerify(cert.verification_code)}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete courses to earn your first certificate
                </p>
                <Button onClick={() => window.location.href = '/courses'}>
                  View Available Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No certificates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
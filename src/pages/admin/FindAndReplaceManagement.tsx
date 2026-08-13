import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Replace, RefreshCw, CheckCircle2, AlertTriangle, FileText, BookOpen, Globe, MessageSquare, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MatchItem {
  id: string;
  table: 'pages' | 'page_sections' | 'page_content' | 'courses' | 'blog_posts' | 'testimonials' | 'site_settings';
  recordTitle: string;
  field: string;
  originalText: string;
  replacedText: string;
  selected: boolean;
  rawRecord: any;
}

export default function FindAndReplaceManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [targets, setTargets] = useState({
    pages: true,
    page_sections: true,
    page_content: true,
    courses: true,
    blog_posts: true,
    testimonials: true,
  });

  const [scanning, setScanning] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [scanExecuted, setScanExecuted] = useState(false);

  const toggleTarget = (key: keyof typeof targets) => {
    setTargets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const executeScan = async () => {
    if (!searchQuery.trim()) {
      toast({ title: 'Error', description: 'Please enter a search keyword.', variant: 'destructive' });
      return;
    }

    setScanning(true);
    setScanExecuted(true);
    const found: MatchItem[] = [];

    try {
      const queryStr = searchQuery.trim();
      const replaceStr = replaceQuery;

      const createRegex = () => {
        const escaped = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(escaped, matchCase ? 'g' : 'gi');
      };

      const checkMatchAndAdd = (item: MatchItem) => {
        const regex = createRegex();
        if (regex.test(item.originalText)) {
          const replacedText = item.originalText.replace(regex, replaceStr);
          found.push({ ...item, replacedText, selected: true });
        }
      };

      // 1. Pages table
      if (targets.pages) {
        const { data: pageRows } = await supabase.from('pages').select('*');
        (pageRows || []).forEach((row: any) => {
          if (row.title) checkMatchAndAdd({ id: row.id, table: 'pages', recordTitle: `Page: ${row.title}`, field: 'title', originalText: row.title, replacedText: '', selected: true, rawRecord: row });
          if (row.meta_title) checkMatchAndAdd({ id: row.id, table: 'pages', recordTitle: `Page: ${row.title}`, field: 'meta_title', originalText: row.meta_title, replacedText: '', selected: true, rawRecord: row });
          if (row.meta_description) checkMatchAndAdd({ id: row.id, table: 'pages', recordTitle: `Page: ${row.title}`, field: 'meta_description', originalText: row.meta_description, replacedText: '', selected: true, rawRecord: row });
          if (row.description) checkMatchAndAdd({ id: row.id, table: 'pages', recordTitle: `Page: ${row.title}`, field: 'description', originalText: row.description, replacedText: '', selected: true, rawRecord: row });
        });
      }

      // 2. Page Sections
      if (targets.page_sections) {
        const { data: sectionRows } = await supabase.from('page_sections').select('*');
        (sectionRows || []).forEach((row: any) => {
          const contentStr = typeof row.content === 'string' ? row.content : JSON.stringify(row.content || {});
          checkMatchAndAdd({
            id: row.id,
            table: 'page_sections',
            recordTitle: `Section Block: ${row.section_type}`,
            field: 'content',
            originalText: contentStr,
            replacedText: '',
            selected: true,
            rawRecord: row
          });
        });
      }

      // 3. Page Content
      if (targets.page_content) {
        const { data: contentRows } = await supabase.from('page_content').select('*');
        (contentRows || []).forEach((row: any) => {
          if (row.content_value) {
            checkMatchAndAdd({
              id: row.id,
              table: 'page_content',
              recordTitle: `Static Key: ${row.page_slug} -> ${row.content_key}`,
              field: 'content_value',
              originalText: row.content_value,
              replacedText: '',
              selected: true,
              rawRecord: row
            });
          }
        });
      }

      // 4. Courses
      if (targets.courses) {
        const { data: courseRows } = await supabase.from('courses').select('*');
        (courseRows || []).forEach((row: any) => {
          if (row.title) checkMatchAndAdd({ id: row.id, table: 'courses', recordTitle: `Course: ${row.title}`, field: 'title', originalText: row.title, replacedText: '', selected: true, rawRecord: row });
          if (row.description) checkMatchAndAdd({ id: row.id, table: 'courses', recordTitle: `Course: ${row.title}`, field: 'description', originalText: row.description, replacedText: '', selected: true, rawRecord: row });
        });
      }

      // 5. Blog Posts
      if (targets.blog_posts) {
        const { data: blogRows } = await supabase.from('blog_posts').select('*');
        (blogRows || []).forEach((row: any) => {
          if (row.title) checkMatchAndAdd({ id: row.id, table: 'blog_posts', recordTitle: `Blog: ${row.title}`, field: 'title', originalText: row.title, replacedText: '', selected: true, rawRecord: row });
          if (row.content) checkMatchAndAdd({ id: row.id, table: 'blog_posts', recordTitle: `Blog: ${row.title}`, field: 'content', originalText: row.content, replacedText: '', selected: true, rawRecord: row });
          if (row.excerpt) checkMatchAndAdd({ id: row.id, table: 'blog_posts', recordTitle: `Blog: ${row.title}`, field: 'excerpt', originalText: row.excerpt, replacedText: '', selected: true, rawRecord: row });
        });
      }

      // 6. Testimonials
      if (targets.testimonials) {
        const { data: testimonialRows } = await supabase.from('testimonials').select('*');
        (testimonialRows || []).forEach((row: any) => {
          if (row.content) checkMatchAndAdd({ id: row.id, table: 'testimonials', recordTitle: `Testimonial by ${row.name || 'User'}`, field: 'content', originalText: row.content, replacedText: '', selected: true, rawRecord: row });
        });
      }

      setMatches(found);
      if (found.length === 0) {
        toast({ title: 'Scan Complete', description: `No occurrences of "${searchQuery}" were found.` });
      } else {
        toast({ title: 'Scan Complete', description: `Found ${found.length} matching occurrences!` });
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      toast({ title: 'Error', description: err.message || 'Failed to scan database', variant: 'destructive' });
    } finally {
      setScanning(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setMatches(prev => prev.map(m => ({ ...m, selected: checked })));
  };

  const toggleSelectItem = (index: number) => {
    setMatches(prev => prev.map((m, idx) => idx === index ? { ...m, selected: !m.selected } : m));
  };

  const executeReplace = async () => {
    const selectedMatches = matches.filter(m => m.selected);
    if (selectedMatches.length === 0) {
      toast({ title: 'No Selection', description: 'Please select at least one match to replace.' });
      return;
    }

    if (!confirm(`Are you sure you want to replace "${searchQuery}" with "${replaceQuery}" in ${selectedMatches.length} items?`)) {
      return;
    }

    setReplacing(true);
    let successCount = 0;

    try {
      for (const match of selectedMatches) {
        if (match.table === 'pages') {
          await supabase.from('pages').update({ [match.field]: match.replacedText }).eq('id', match.id);
        } else if (match.table === 'page_sections') {
          let updatedContent: any = match.replacedText;
          try {
            updatedContent = JSON.parse(match.replacedText);
          } catch (e) {
            // Leave as string if not valid JSON
          }
          await supabase.from('page_sections').update({ content: updatedContent }).eq('id', match.id);
        } else if (match.table === 'page_content') {
          await supabase.from('page_content').update({ content_value: match.replacedText }).eq('id', match.id);
        } else if (match.table === 'courses') {
          await supabase.from('courses').update({ [match.field]: match.replacedText }).eq('id', match.id);
        } else if (match.table === 'blog_posts') {
          await supabase.from('blog_posts').update({ [match.field]: match.replacedText }).eq('id', match.id);
        } else if (match.table === 'testimonials') {
          await supabase.from('testimonials').update({ [match.field]: match.replacedText }).eq('id', match.id);
        }
        successCount++;
      }

      toast({
        title: 'Success!',
        description: `Successfully replaced keyword in ${successCount} record(s).`,
      });

      // Clear scan results after execution
      setMatches([]);
      setScanExecuted(false);
    } catch (err: any) {
      console.error('Replace error:', err);
      toast({ title: 'Error', description: err.message || 'Failed to replace keywords', variant: 'destructive' });
    } finally {
      setReplacing(false);
    }
  };

  const selectedCount = matches.filter(m => m.selected).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight italic">Global Find & Replace</h1>
            <p className="text-sm text-muted-foreground">Search and replace keywords globally across your pages, sections, courses, and content.</p>
          </div>
          <Badge variant="outline" className="w-fit text-xs px-3 py-1 bg-primary/5 text-primary border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary" /> Admin Power Tool
          </Badge>
        </div>

        {/* Form Controls Card */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Configure Search & Replacement
            </CardTitle>
            <CardDescription>Enter the target word/phrase to find and the replacement keyword.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Find Keyword / Phrase</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search" 
                    placeholder="e.g. Academy, PANA Academy" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replace" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Replace With</Label>
                <div className="relative">
                  <Replace className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input 
                    id="replace" 
                    placeholder="e.g. Institute, PANA Institute" 
                    value={replaceQuery}
                    onChange={e => setReplaceQuery(e.target.value)}
                    className="pl-9 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch id="match-case" checked={matchCase} onCheckedChange={setMatchCase} />
                  <Label htmlFor="match-case" className="text-xs font-semibold cursor-pointer">Match Case</Label>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground uppercase mr-2">Target Scopes:</span>
                {[
                  { key: 'pages', label: 'Pages' },
                  { key: 'page_sections', label: 'Page Sections' },
                  { key: 'page_content', label: 'Static Keys' },
                  { key: 'courses', label: 'Courses' },
                  { key: 'blog_posts', label: 'Blog' },
                  { key: 'testimonials', label: 'Testimonials' },
                ].map(target => (
                  <Button
                    key={target.key}
                    type="button"
                    variant={targets[target.key as keyof typeof targets] ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs rounded-full px-3"
                    onClick={() => toggleTarget(target.key as keyof typeof targets)}
                  >
                    {target.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 py-4 flex items-center justify-between border-t">
            <p className="text-xs text-muted-foreground">
              Always review matches below before executing replace.
            </p>
            <Button onClick={executeScan} disabled={scanning || !searchQuery.trim()} className="px-6 font-bold shadow-md">
              {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {scanning ? 'Scanning Database...' : 'Find Occurrences'}
            </Button>
          </CardFooter>
        </Card>

        {/* Results Card */}
        {scanExecuted && (
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Matches Found ({matches.length})
                </CardTitle>
                <CardDescription>Select items to apply the replacement.</CardDescription>
              </div>

              {matches.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSelectAll(selectedCount < matches.length)}
                    className="text-xs"
                  >
                    {selectedCount === matches.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button 
                    onClick={executeReplace} 
                    disabled={replacing || selectedCount === 0} 
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-5 shadow-lg"
                  >
                    {replacing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Replace className="w-4 h-4 mr-2" />}
                    {replacing ? 'Replacing...' : `Replace Selected (${selectedCount})`}
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {matches.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <h3 className="font-bold text-lg">No Occurrences Found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                    No matching records containing <code className="text-primary font-bold">"{searchQuery}"</code> were found in the selected target scopes.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="w-12 text-center">Select</TableHead>
                        <TableHead className="w-48">Record Source</TableHead>
                        <TableHead className="w-32">Field</TableHead>
                        <TableHead>Original Text (Match Highlighted)</TableHead>
                        <TableHead>Replacement Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.map((item, index) => (
                        <TableRow key={`${item.table}-${item.id}-${item.field}-${index}`} className="hover:bg-muted/20">
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={item.selected} 
                              onCheckedChange={() => toggleSelectItem(index)} 
                            />
                          </TableCell>
                          <TableCell className="font-medium text-xs">
                            <Badge variant="outline" className="mb-1 text-[10px]">
                              {item.table}
                            </Badge>
                            <div className="truncate max-w-[180px] font-bold text-foreground" title={item.recordTitle}>
                              {item.recordTitle}
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {item.field}
                            </code>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-xs line-clamp-3 font-mono bg-red-500/5 p-2 rounded border border-red-200/40 leading-relaxed">
                              {item.originalText}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-xs line-clamp-3 font-mono bg-green-500/5 p-2 rounded border border-green-200/40 text-green-900 leading-relaxed">
                              {item.replacedText}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

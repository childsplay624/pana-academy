import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  User,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserX,
  UserCheck,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  full_name: string | null;
  role: 'student' | 'instructor' | 'admin';
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  social_links?: any;
}

export default function UserManagement() {
  const { user: currentAuthUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<UserProfile | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student' as 'student' | 'instructor' | 'admin'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    // Check if we should open the add user dialog automatically
    const params = new URLSearchParams(window.location.search);
    if (params.get('add') === 'true') {
      setIsAddUserOpen(true);
      // Clear the param without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const isUserSuspended = (user: UserProfile) => {
    return Boolean(user.social_links && typeof user.social_links === 'object' && user.social_links.is_suspended);
  };

  const isUserDeleted = (user: UserProfile) => {
    return Boolean(user.social_links && typeof user.social_links === 'object' && user.social_links.is_deleted);
  };

  const updateUserRole = async (userId: string, newRole: 'student' | 'instructor' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const handleToggleSuspend = async (user: UserProfile) => {
    const currentlySuspended = isUserSuspended(user);
    const nextSuspended = !currentlySuspended;

    try {
      setIsActionLoading(true);
      const currentLinks = (user.social_links as Record<string, any>) || {};
      const updatedLinks = {
        ...currentLinks,
        is_suspended: nextSuspended,
        suspended_at: nextSuspended ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('profiles')
        .update({ social_links: updatedLinks })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, social_links: updatedLinks } : u
      ));

      toast({
        title: nextSuspended ? 'User Suspended' : 'User Reactivated',
        description: nextSuspended 
          ? `${user.full_name || user.email || 'User'} has been suspended and restricted from platform access.` 
          : `${user.full_name || user.email || 'User'} has been reactivated successfully.`
      });
    } catch (error: any) {
      console.error('Error updating suspension status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user suspension status',
        variant: 'destructive'
      });
    } finally {
      setIsActionLoading(false);
      setSuspendTarget(null);
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    try {
      setIsActionLoading(true);

      // Attempt direct hard delete on profiles first
      const { error: hardDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (hardDeleteError) {
        console.warn('Direct profile delete failed, applying soft-delete flag:', hardDeleteError);
        // Fallback: flag as deleted in social_links
        const currentLinks = (user.social_links as Record<string, any>) || {};
        const { error: softErr } = await supabase
          .from('profiles')
          .update({
            social_links: {
              ...currentLinks,
              is_deleted: true,
              is_suspended: true,
              deleted_at: new Date().toISOString()
            }
          })
          .eq('id', user.id);

        if (softErr) throw softErr;

        setUsers(prev => prev.map(u => 
          u.id === user.id 
            ? { ...u, social_links: { ...currentLinks, is_deleted: true, is_suspended: true, deleted_at: new Date().toISOString() } }
            : u
        ));
      } else {
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }

      toast({
        title: 'User Deleted',
        description: `${user.full_name || user.email || 'User'} has been removed.`
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      });
    } finally {
      setIsActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleRestoreUser = async (user: UserProfile) => {
    try {
      setIsActionLoading(true);
      const currentLinks = (user.social_links as Record<string, any>) || {};
      const updatedLinks = {
        ...currentLinks,
        is_deleted: false,
        is_suspended: false,
        restored_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update({ social_links: updatedLinks })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, social_links: updatedLinks } : u
      ));

      toast({
        title: 'User Restored',
        description: `${user.full_name || user.email || 'User'} has been restored to active users.`
      });
    } catch (error: any) {
      console.error('Error restoring user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to restore user',
        variant: 'destructive'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: 'Validation Error',
        description: 'Email and password are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          full_name: newUser.full_name,
          role: newUser.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setIsAddUserOpen(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'student' });
      fetchUsers();
      
      toast({
        title: 'Success',
        description: 'User created successfully'
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = user.full_name || '';
    const email = user.email || '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.toLowerCase().includes(search) || 
                         email.toLowerCase().includes(search) ||
                         user.id.toLowerCase().includes(search);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    const userSuspended = isUserSuspended(user);
    const userDeleted = isUserDeleted(user);

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = !userSuspended && !userDeleted;
    } else if (statusFilter === 'suspended') {
      matchesStatus = userSuspended && !userDeleted;
    } else if (statusFilter === 'deleted') {
      matchesStatus = userDeleted;
    } else {
      // 'all' shows active & suspended, excluding deleted unless 'deleted' is explicitly chosen
      matchesStatus = !userDeleted;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'instructor': return <GraduationCap className="h-4 w-4" />;
      case 'student': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'instructor': return 'default';
      case 'student': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const activeUsersCount = users.filter(u => !isUserDeleted(u)).length;
  const studentsCount = users.filter(u => u.role === 'student' && !isUserDeleted(u)).length;
  const instructorsCount = users.filter(u => u.role === 'instructor' && !isUserDeleted(u)).length;
  const adminsCount = users.filter(u => u.role === 'admin' && !isUserDeleted(u)).length;
  const suspendedCount = users.filter(u => isUserSuspended(u) && !isUserDeleted(u)).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, account suspensions, and platform access</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with email and password.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="full_name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addUser} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsersCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instructors</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminsCount}</div>
            </CardContent>
          </Card>

          <Card className={suspendedCount > 0 ? "border-amber-500/40 bg-amber-500/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Suspended</CardTitle>
              <UserX className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{suspendedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="instructor">Instructors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Active & Suspended</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="suspended">Suspended Only</SelectItem>
                  <SelectItem value="deleted">Deleted / Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} {statusFilter === 'deleted' ? 'archived / deleted' : ''} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => {
                      const suspended = isUserSuspended(user);
                      const deleted = isUserDeleted(user);
                      const isSelf = user.id === currentAuthUser?.id;

                      return (
                        <TableRow key={user.id} className={suspended ? "bg-amber-500/[0.02]" : ""}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <span>{user.full_name || 'Unnamed User'}</span>
                                  {isSelf && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary">
                                      You
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                <div className="text-[10px] text-muted-foreground opacity-50">{user.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {deleted ? (
                              <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground bg-muted/20">
                                Deleted
                              </Badge>
                            ) : suspended ? (
                              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-medium flex items-center gap-1 w-fit">
                                <UserX className="h-3 w-3" />
                                Suspended
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-medium flex items-center gap-1 w-fit">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {deleted ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRestoreUser(user)}
                                  disabled={isActionLoading}
                                  className="h-8 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                  Restore User
                                </Button>
                              ) : (
                                <>
                                  <Select
                                    value={user.role}
                                    onValueChange={(value) => updateUserRole(user.id, value as any)}
                                    disabled={isSelf}
                                  >
                                    <SelectTrigger className="w-[110px] h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="student">Student</SelectItem>
                                      <SelectItem value="instructor">Instructor</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {suspended ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-700"
                                      disabled={isSelf || isActionLoading}
                                      onClick={() => setSuspendTarget(user)}
                                      title={isSelf ? "Cannot unsuspend yourself" : "Unsuspend user account"}
                                    >
                                      <UserCheck className="h-3.5 w-3.5 mr-1" />
                                      Unsuspend
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs text-muted-foreground hover:text-amber-600 hover:border-amber-500/30 hover:bg-amber-500/10"
                                      disabled={isSelf || isActionLoading}
                                      onClick={() => setSuspendTarget(user)}
                                      title={isSelf ? "Cannot suspend yourself" : "Suspend user account"}
                                    >
                                      <UserX className="h-3.5 w-3.5 mr-1" />
                                      Suspend
                                    </Button>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    disabled={isSelf || isActionLoading}
                                    onClick={() => setDeleteTarget(user)}
                                    title={isSelf ? "Cannot delete yourself" : "Delete user account"}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No users found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center min-w-[100px] text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <Trash2 className="h-5 w-5" />
                <AlertDialogTitle>Delete User Account</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-2 text-left">
                <span>
                  Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.full_name || deleteTarget?.email}</strong>?
                </span>
                <span className="block text-sm text-muted-foreground">
                  This action removes the user's profile and terminates their platform access. This action cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isActionLoading}
                onClick={(e) => {
                  e.preventDefault();
                  if (deleteTarget) handleDeleteUser(deleteTarget);
                }}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isActionLoading ? 'Deleting...' : 'Delete User'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Suspend / Unsuspend Confirmation Alert Dialog */}
        <AlertDialog open={!!suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle>
                  {suspendTarget && isUserSuspended(suspendTarget) ? 'Reactivate User Account' : 'Suspend User Account'}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-2 text-left">
                <span>
                  {suspendTarget && isUserSuspended(suspendTarget) ? (
                    <>
                      Reactivating will restore full platform and course access for <strong className="text-foreground">{suspendTarget?.full_name || suspendTarget?.email}</strong>.
                    </>
                  ) : (
                    <>
                      Are you sure you want to suspend <strong className="text-foreground">{suspendTarget?.full_name || suspendTarget?.email}</strong>?
                    </>
                  )}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {suspendTarget && !isUserSuspended(suspendTarget) && (
                    'While suspended, this user will be blocked from accessing their account, courses, and certificates until an administrator unsuspends them.'
                  )}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isActionLoading}
                onClick={(e) => {
                  e.preventDefault();
                  if (suspendTarget) handleToggleSuspend(suspendTarget);
                }}
                className={
                  suspendTarget && isUserSuspended(suspendTarget)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }
              >
                {isActionLoading 
                  ? 'Updating...' 
                  : (suspendTarget && isUserSuspended(suspendTarget) ? 'Reactivate Account' : 'Suspend Account')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
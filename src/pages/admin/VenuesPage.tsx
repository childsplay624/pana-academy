import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Plus,
    MapPin,
    Edit2,
    Trash2,
    Loader2,
    ExternalLink,
    Search,
    Building2,
    Users
} from 'lucide-react';

interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    capacity: number | null;
    map_url: string | null;
}

export default function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<Partial<Venue>>({
        name: '',
        address: '',
        city: '',
        country: 'Nigeria',
        capacity: null,
        map_url: '',
    });

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .order('name');

            if (error) throw error;
            setVenues(data || []);
        } catch (error) {
            console.error('Error fetching venues:', error);
            toast({
                title: 'Error',
                description: 'Failed to load venues',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            if (editingVenue) {
                const { error } = await supabase
                    .from('venues')
                    .update(formData)
                    .eq('id', editingVenue.id);
                if (error) throw error;
                toast({ title: 'Success', description: 'Venue updated successfully' });
            } else {
                const { error } = await supabase
                    .from('venues')
                    .insert([formData]);
                if (error) throw error;
                toast({ title: 'Success', description: 'Venue created successfully' });
            }

            setIsDialogOpen(false);
            setEditingVenue(null);
            resetForm();
            fetchVenues();
        } catch (error) {
            console.error('Error saving venue:', error);
            toast({
                title: 'Error',
                description: 'Failed to save venue',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this venue?')) return;

        try {
            const { error } = await supabase
                .from('venues')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast({ title: 'Success', description: 'Venue deleted successfully' });
            fetchVenues();
        } catch (error) {
            console.error('Error deleting venue:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete venue. It might be in use by a course.',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (venue: Venue) => {
        setEditingVenue(venue);
        setFormData({
            name: venue.name,
            address: venue.address,
            city: venue.city,
            country: venue.country,
            capacity: venue.capacity,
            map_url: venue.map_url,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            country: 'Nigeria',
            capacity: null,
            map_url: '',
        });
    };

    const filteredVenues = venues.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">On-Site Venues</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage physical locations for courses
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingVenue(null);
                            resetForm();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Venue
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingVenue ? 'Edit Venue' : 'Create New Venue'}</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the physical training location.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Venue Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., PANA Lagos Office"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Input
                                            id="address"
                                            placeholder="Full street address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                placeholder="Lagos"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="capacity">Capacity (Optional)</Label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                placeholder="e.g., 25"
                                                value={formData.capacity || ''}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : null })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="map_url">Google Maps URL (Optional)</Label>
                                            <Input
                                                id="map_url"
                                                placeholder="Link to location"
                                                value={formData.map_url || ''}
                                                onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={submitting} className="w-full">
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingVenue ? 'Save Changes' : 'Create Venue'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search venues by name, city or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11"
                    />
                </div>

                {/* Venues Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <Card key={n} className="animate-pulse">
                                <CardHeader className="h-24 bg-muted/30" />
                                <CardContent className="h-32" />
                            </Card>
                        ))}
                    </div>
                ) : filteredVenues.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle>No venues found</CardTitle>
                        <CardDescription className="max-w-xs mx-auto mt-2">
                            {searchQuery ? "Try a different search term or add a new venue." : "Get started by adding your first training location."}
                        </CardDescription>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVenues.map((venue) => (
                            <Card key={venue.id} className="group hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleEdit(venue)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(venue.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4 text-xl">{venue.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {venue.city}, {venue.country}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {venue.address}
                                    </p>

                                    <div className="flex items-center gap-4 pt-2 border-t text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{venue.capacity || 'Unlimited'}</span>
                                        </div>
                                        {venue.map_url && (
                                            <a
                                                href={venue.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-primary hover:underline ml-auto"
                                            >
                                                View Map
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

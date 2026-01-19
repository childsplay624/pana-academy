import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleBuilder } from './ScheduleBuilder';
import { ArrowLeft, MapPin, Calendar, Package, Info } from 'lucide-react';
import { OnSiteSession } from '@/types/course.types';

interface OnsiteCourseFormProps {
    initialData: any;
    courseBasics: any;
    onSubmit: (data: any) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function OnsiteCourseForm({
    initialData,
    courseBasics,
    onSubmit,
    onBack,
    isSubmitting
}: OnsiteCourseFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });

    const [onsiteSchedule, setOnsiteSchedule] = React.useState<OnSiteSession[]>(
        initialData.onsiteSchedule || []
    );
    const [materialsList, setMaterialsList] = React.useState<string[]>(
        initialData.materialsList || []
    );

    const requiresMaterials = watch('requiresMaterials');

    const handleFormSubmit = (data: any) => {
        // Validate venue information
        if (!data.venueName || !data.venueAddress || !data.venueCity || !data.venueCountry) {
            alert('Please fill in all required venue information');
            return;
        }

        // Validate schedule
        if (onsiteSchedule.length === 0) {
            alert('Please add at least one session to the schedule');
            return;
        }

        onSubmit({
            ...data,
            onsiteSchedule,
            materialsList: requiresMaterials ? materialsList.filter(m => m.trim() !== '') : [],
        });
    };

    const addMaterial = () => {
        setMaterialsList([...materialsList, '']);
    };

    const removeMaterial = (index: number) => {
        setMaterialsList(materialsList.filter((_, i) => i !== index));
    };

    const updateMaterial = (index: number, value: string) => {
        const updated = [...materialsList];
        updated[index] = value;
        setMaterialsList(updated);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Venue Information Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Venue Information
                    </CardTitle>
                    <CardDescription>
                        Where will this course take place?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Venue Name */}
                    <div className="space-y-2">
                        <Label htmlFor="venueName">Venue Name *</Label>
                        <Input
                            id="venueName"
                            {...register('venueName', { required: 'Venue name is required' })}
                            placeholder="e.g., PANA Academy Training Center"
                        />
                        {errors.venueName && (
                            <p className="text-sm text-red-500">{String(errors.venueName.message)}</p>
                        )}
                    </div>

                    {/* Venue Address */}
                    <div className="space-y-2">
                        <Label htmlFor="venueAddress">Street Address *</Label>
                        <Input
                            id="venueAddress"
                            {...register('venueAddress', { required: 'Address is required' })}
                            placeholder="e.g., 123 Tech Street, Suite 400"
                        />
                        {errors.venueAddress && (
                            <p className="text-sm text-red-500">{String(errors.venueAddress.message)}</p>
                        )}
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="venueCity">City *</Label>
                            <Input
                                id="venueCity"
                                {...register('venueCity', { required: 'City is required' })}
                                placeholder="e.g., Lagos"
                            />
                            {errors.venueCity && (
                                <p className="text-sm text-red-500">{String(errors.venueCity.message)}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="venueCountry">Country *</Label>
                            <Input
                                id="venueCountry"
                                {...register('venueCountry', { required: 'Country is required' })}
                                placeholder="e.g., Nigeria"
                            />
                            {errors.venueCountry && (
                                <p className="text-sm text-red-500">{String(errors.venueCountry.message)}</p>
                            )}
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <Label htmlFor="venueCapacity">Maximum Capacity</Label>
                        <Input
                            id="venueCapacity"
                            type="number"
                            {...register('venueCapacity', {
                                min: { value: 1, message: 'Capacity must be at least 1' },
                            })}
                            placeholder="e.g., 30"
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum number of students for this course
                        </p>
                        {errors.venueCapacity && (
                            <p className="text-sm text-red-500">{String(errors.venueCapacity.message)}</p>
                        )}
                    </div>

                    {/* Google Maps URL */}
                    <div className="space-y-2">
                        <Label htmlFor="venueMapUrl">Google Maps URL</Label>
                        <Input
                            id="venueMapUrl"
                            {...register('venueMapUrl')}
                            placeholder="https://maps.google.com/..."
                        />
                        <p className="text-xs text-muted-foreground">
                            Link to venue location on Google Maps (optional)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Course Schedule
                    </CardTitle>
                    <CardDescription>
                        Add sessions for your course. Use start/end dates from Step 1: {courseBasics.startDate && new Date(courseBasics.startDate).toLocaleDateString()}
                        {courseBasics.endDate && ` - ${new Date(courseBasics.endDate).toLocaleDateString()}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScheduleBuilder
                        sessions={onsiteSchedule}
                        onSessionsChange={setOnsiteSchedule}
                        courseStartDate={courseBasics.startDate}
                        courseEndDate={courseBasics.endDate}
                    />
                </CardContent>
            </Card>

            {/* Logistics Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Logistics & Materials
                    </CardTitle>
                    <CardDescription>
                        What should students know about attending this course?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Materials Required */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="requiresMaterials"
                                checked={requiresMaterials}
                                onCheckedChange={(checked) => setValue('requiresMaterials', !!checked)}
                            />
                            <Label htmlFor="requiresMaterials" className="font-medium">
                                Students need to bring materials
                            </Label>
                        </div>

                        {requiresMaterials && (
                            <div className="ml-6 space-y-2">
                                <Label>Materials List</Label>
                                <div className="space-y-2">
                                    {materialsList.map((material, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={material}
                                                onChange={(e) => updateMaterial(index, e.target.value)}
                                                placeholder={`Material ${index + 1} (e.g., Laptop, Notebook)`}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMaterial(index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addMaterial}
                                    >
                                        + Add Material
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Parking Information */}
                    <div className="space-y-2">
                        <Label htmlFor="parkingInfo">Parking Information</Label>
                        <Textarea
                            id="parkingInfo"
                            {...register('parkingInfo')}
                            placeholder="e.g., Free parking available in Building B. Street parking also available."
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            Let students know about parking options (optional)
                        </p>
                    </div>

                    {/* Accommodation Information */}
                    <div className="space-y-2">
                        <Label htmlFor="accommodationInfo">Accommodation Suggestions</Label>
                        <Textarea
                            id="accommodationInfo"
                            {...register('accommodationInfo')}
                            placeholder="e.g., Nearby hotels: Radisson Blu (2km), Sheraton (3km)"
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            Suggest nearby hotels for multi-day courses (optional)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-4 w-4" />
                        Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>
                        <span className="font-medium">Venue:</span>{' '}
                        {watch('venueName') || 'Not set'}
                    </p>
                    <p>
                        <span className="font-medium">Location:</span>{' '}
                        {watch('venueCity') || '–'}, {watch('venueCountry') || '–'}
                    </p>
                    <p>
                        <span className="font-medium">Capacity:</span>{' '}
                        {watch('venueCapacity') || 'Unlimited'}
                    </p>
                    <p>
                        <span className="font-medium">Sessions:</span>{' '}
                        {onsiteSchedule.length} scheduled
                    </p>
                    <p>
                        <span className="font-medium">Materials Required:</span>{' '}
                        {requiresMaterials ? `Yes (${materialsList.filter(m => m.trim()).length} items)` : 'No'}
                    </p>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Course...' : 'Create On-Site Course'}
                </Button>
            </div>
        </form>
    );
}

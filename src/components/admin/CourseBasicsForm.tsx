import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Loader2 } from 'lucide-react';
import { CourseType } from '@/types/course.types';
import { supabase } from '@/integrations/supabase/client';
import { ImagePicker } from './ImagePicker';
import { useAuth } from '@/hooks/useAuth';

interface CourseBasicsFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

interface Instructor {
    id: string;
    full_name: string | null;
}

export function CourseBasicsForm({ initialData, onSubmit, onCancel }: CourseBasicsFormProps) {
    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin';
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });

    const isFree = watch('isFree');
    const courseType = watch('courseType');
    const thumbnailUrl = watch('thumbnailUrl');
    const instructorId = watch('instructorId');

    useEffect(() => {
        register('instructorId', { required: 'Instructor is required' });
        register('thumbnailUrl');
    }, [register]);

    // Auto-set instructorId for non-admin users (instructors)
    useEffect(() => {
        if (!isAdmin && profile?.id) {
            setValue('instructorId', profile.id);
        }
    }, [isAdmin, profile?.id, setValue]);

    useEffect(() => {
        // Only fetch the instructor list if the user is an admin
        if (!isAdmin) {
            setLoadingInstructors(false);
            return;
        }

        const fetchInstructors = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .or('role.eq.instructor,role.eq.admin')
                    .order('full_name', { ascending: true });

                if (error) throw error;
                setInstructors(data || []);
            } catch (error) {
                console.error('Error fetching instructors:', error);
            } finally {
                setLoadingInstructors(false);
            }
        };

        fetchInstructors();
    }, [isAdmin]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                    id="title"
                    {...register('title', { required: 'Course title is required' })}
                    placeholder="e.g., Advanced React Development"
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{String(errors.title.message)}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Describe what students will learn in this course..."
                    rows={4}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{String(errors.description.message)}</p>
                )}
            </div>

            {/* Course Type - THE KEY SELECTOR */}
            <div className="space-y-2">
                <Label htmlFor="courseType">Course Type *</Label>
                <Select
                    value={courseType}
                    onValueChange={(value) => setValue('courseType', value as CourseType)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select course type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="online">
                            <div className="flex items-center gap-2">
                                <span>💻</span>
                                <div>
                                    <div className="font-medium">Online Course</div>
                                    <div className="text-xs text-muted-foreground">Self-paced or live online</div>
                                </div>
                            </div>
                        </SelectItem>
                        <SelectItem value="onsite">
                            <div className="flex items-center gap-2">
                                <span>🏢</span>
                                <div>
                                    <div className="font-medium">On-Site Course</div>
                                    <div className="text-xs text-muted-foreground">Physical venue, in-person</div>
                                </div>
                            </div>
                        </SelectItem>
                        <SelectItem value="hybrid">
                            <div className="flex items-center gap-2">
                                <span>🔄</span>
                                <div>
                                    <div className="font-medium">Hybrid Course</div>
                                    <div className="text-xs text-muted-foreground">Combination of online and on-site</div>
                                </div>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {courseType === 'online' && 'Students access content online at their own pace'}
                    {courseType === 'onsite' && 'Students attend in-person at a physical location'}
                    {courseType === 'hybrid' && 'Students experience both online and in-person learning'}
                </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                    value={watch('categoryId')}
                    onValueChange={(value) => setValue('categoryId', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="soft_skills">🤝 Soft Skills</SelectItem>
                        <SelectItem value="safety">🦺 Safety</SelectItem>
                        <SelectItem value="sustainability">🌍 Sustainability</SelectItem>
                        <SelectItem value="general_technical">🔧 General Technical</SelectItem>
                        <SelectItem value="flow_drives">⚙️ Flow Drives</SelectItem>
                        <SelectItem value="flow_control">🎛️ Flow Control</SelectItem>
                        <SelectItem value="flow_measurement">📏 Flow Measurement</SelectItem>
                        <SelectItem value="instrumentation_automation">🤖 Instrumentation & Automation</SelectItem>
                    </SelectContent>
                </Select>
                {errors.categoryId && (
                    <p className="text-sm text-red-500">{String(errors.categoryId.message)}</p>
                )}
            </div>

            {/* Level */}
            <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                    value={watch('level')}
                    onValueChange={(value) => setValue('level', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Instructor Selection */}
            <div className="space-y-2">
                <Label htmlFor="instructorId">Instructor *</Label>
                {isAdmin ? (
                    // Admin sees a dropdown to pick any instructor
                    loadingInstructors ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic h-10 border rounded-md px-3 bg-muted/50">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading instructors...
                        </div>
                    ) : (
                        <Select
                            value={instructorId}
                            onValueChange={(value) => setValue('instructorId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                            <SelectContent>
                                {instructors.map((instructor) => (
                                    <SelectItem key={instructor.id} value={instructor.id}>
                                        {instructor.full_name || 'Unnamed Instructor'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                ) : (
                    // Instructors see their own name (auto-assigned)
                    <Input
                        value={profile?.full_name || 'You (Instructor)'}
                        disabled
                        className="bg-muted/50"
                    />
                )}
                {errors.instructorId && (
                    <p className="text-sm text-red-500">{String(errors.instructorId.message)}</p>
                )}
            </div>

            {/* Thumbnail Selection */}
            <div className="space-y-2">
                <ImagePicker
                    value={thumbnailUrl}
                    onSelect={(url) => setValue('thumbnailUrl', url)}
                    category="other"
                    label="Choose Thumbnail"
                />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">
                        Start Date {courseType !== 'online' && '*'}
                    </Label>
                    <Input
                        id="startDate"
                        type="datetime-local"
                        {...register('startDate', {
                            required: courseType !== 'online' ? 'Start date is required for on-site courses' : false,
                        })}
                    />
                    {errors.startDate && (
                        <p className="text-sm text-red-500">{String(errors.startDate.message)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {courseType === 'online' && 'When enrollment opens'}
                        {courseType !== 'online' && 'When the event starts'}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">
                        End Date {courseType === 'onsite' && '(for multi-day)'}
                    </Label>
                    <Input
                        id="endDate"
                        type="datetime-local"
                        {...register('endDate')}
                    />
                    <p className="text-xs text-muted-foreground">
                        {courseType === 'online' ? 'Optional deadline' : 'When the event ends'}
                    </p>
                </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isFree"
                        checked={isFree}
                        onCheckedChange={(checked) => {
                            setValue('isFree', !!checked);
                            if (checked) {
                                setValue('price', 0);
                            }
                        }}
                    />
                    <Label htmlFor="isFree">This is a free course</Label>
                </div>

                {!isFree && (
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (NGN) *</Label>
                        <Input
                            id="price"
                            type="number"
                            {...register('price', {
                                required: !isFree ? 'Price is required' : false,
                                min: { value: 0, message: 'Price must be positive' },
                            })}
                            placeholder="0"
                        />
                        {errors.price && (
                            <p className="text-sm text-red-500">{String(errors.price.message)}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6">
                <Button type="submit">
                    Next: {courseType === 'online' ? 'Online' : courseType === 'onsite' ? 'On-Site' : 'Hybrid'} Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}

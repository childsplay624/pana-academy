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
import { fetchCategoriesWithSubcategories, Category, Subcategory } from '@/services/courseService';
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

const DOMAIN_CODE_MAP: Record<string, string> = {
    'power-and-drives': 'PD',
    'valves-and-actuation': 'VA',
    'integrated-automation-and-digital-operations': 'AD',
    'measurement-and-management': 'MM',
    'field-operations-and-lifecycle-services': 'EX',
    'exploration-oil-gas-and-mining': 'EP',
    'production': 'PR',
    'marine-and-subsea': 'MS',
    'sustainability-solutions-and-services': 'SU',
    'supply-chain-management': 'SC',
};

const getCategoryPrefix = (category?: Category | null): string => {
    if (!category) return '';
    if (category.code_prefix) return category.code_prefix.toUpperCase();
    if (category.slug && DOMAIN_CODE_MAP[category.slug]) return DOMAIN_CODE_MAP[category.slug];
    return category.name.substring(0, 2).toUpperCase();
};

export function CourseBasicsForm({ initialData, onSubmit, onCancel }: CourseBasicsFormProps) {
    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin';
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [generatingCode, setGeneratingCode] = useState(false);

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
    const selectedCategoryId = watch('categoryId');
    const currentCode = watch('code');

    const activeCategory = categories.find(c => c.id === selectedCategoryId);
    const availableSubcategories: Subcategory[] = activeCategory?.subcategories || [];
    const activeCategoryPrefix = getCategoryPrefix(activeCategory);

    // Auto-derive next available course code for a given prefix (e.g. PD -> PD01)
    const generateCodeForPrefix = async (prefix: string) => {
        if (!prefix) return;
        setGeneratingCode(true);
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('code')
                .ilike('code', `${prefix}%`);

            let maxNum = 0;
            if (!error && data && data.length > 0) {
                data.forEach(item => {
                    if (item.code) {
                        const match = item.code.match(new RegExp(`^${prefix}(\\d+)`, 'i'));
                        if (match && match[1]) {
                            const num = parseInt(match[1], 10);
                            if (!isNaN(num) && num > maxNum) {
                                maxNum = num;
                            }
                        }
                    }
                });
            }
            const nextCode = `${prefix}${String(maxNum + 1).padStart(2, '0')}`;
            setValue('code', nextCode);
        } catch (err) {
            console.error('Error generating course code:', err);
            setValue('code', `${prefix}01`);
        } finally {
            setGeneratingCode(false);
        }
    };

    // Category selection handler: updates category, subcategories, and derives course code
    const handleCategoryChange = async (catId: string) => {
        setValue('categoryId', catId);
        const selectedCat = categories.find(c => c.id === catId);
        if (selectedCat) {
            setValue('category', selectedCat.name);
            if (selectedCat.domain_no) {
                setValue('domain_no', selectedCat.domain_no);
            }
            const prefix = getCategoryPrefix(selectedCat);
            if (prefix) {
                await generateCodeForPrefix(prefix);
            }
        }
        setValue('subcategoryId', '');
        setValue('courseArea', '');
    };

    useEffect(() => {
        register('instructorId', { required: 'Instructor is required' });
        register('thumbnailUrl');
        register('subcategoryId');
        register('courseArea');
        register('domain_no');
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

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await fetchCategoriesWithSubcategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Domain & Course Area Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-muted">
                {/* Domain / Category */}
                <div className="space-y-2">
                    <Label htmlFor="categoryId" className="font-bold flex items-center gap-1.5">
                        Domain (Category) *
                    </Label>
                    {loadingCategories ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic h-10 border rounded-md px-3 bg-muted/50">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading domains...
                        </div>
                    ) : (
                        <Select
                            value={watch('categoryId')}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.domain_no ? `${cat.domain_no}. ` : ''}{cat.name} {cat.code_prefix ? `(${cat.code_prefix})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {errors.categoryId && (
                        <p className="text-sm text-red-500">{String(errors.categoryId.message)}</p>
                    )}
                </div>

                {/* Course Area / Sub-category */}
                <div className="space-y-2">
                    <Label htmlFor="subcategoryId" className="font-bold">
                        Course Area (Sub-category)
                    </Label>
                    <Select
                        value={watch('subcategoryId')}
                        disabled={!watch('categoryId') || availableSubcategories.length === 0}
                        onValueChange={(value) => {
                            setValue('subcategoryId', value);
                            const selectedSub = availableSubcategories.find(s => s.id === value);
                            if (selectedSub) {
                                setValue('courseArea', selectedSub.name);
                            }
                        }}
                    >
                        <SelectTrigger className="bg-background">
                            <SelectValue 
                                placeholder={
                                    !watch('categoryId') 
                                        ? "Select domain first" 
                                        : availableSubcategories.length === 0 
                                        ? "No sub-categories" 
                                        : "Select course area"
                                } 
                            />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            {availableSubcategories.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                    {sub.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Step 2: Course Code & Title on the same line */}
            <div className="space-y-1.5">
                <div className="flex items-start gap-3">
                    {/* Course Code with fixed/shrink-0 width */}
                    <div className="w-28 sm:w-36 shrink-0 space-y-1.5">
                        <div className="flex items-center justify-between h-5">
                            <Label htmlFor="code" className="font-bold text-xs sm:text-sm">Course Code</Label>
                            {activeCategoryPrefix && (
                                <button
                                    type="button"
                                    onClick={() => generateCodeForPrefix(activeCategoryPrefix)}
                                    className="text-[10px] font-mono text-red-600 hover:underline"
                                    title="Click to regenerate sequential code"
                                >
                                    {generatingCode ? '...' : 'Refresh'}
                                </button>
                            )}
                        </div>
                        <Input
                            id="code"
                            {...register('code')}
                            placeholder={activeCategoryPrefix ? `${activeCategoryPrefix}01` : "e.g., PD01"}
                            className="font-mono uppercase font-bold text-gray-900 bg-background h-10"
                        />
                    </div>

                    {/* Course Title filling all remaining space on the same line */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center h-5">
                            <Label htmlFor="title" className="font-bold text-xs sm:text-sm">Course Title *</Label>
                        </div>
                        <Input
                            id="title"
                            {...register('title', { required: 'Course title is required' })}
                            placeholder="e.g., Centrifugal compressor operation, performance and surge control"
                            className="h-10"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{String(errors.title.message)}</p>
                        )}
                    </div>
                </div>

                {/* Helper text placed below the row for clean alignment */}
                {activeCategoryPrefix && (
                    <p className="text-[11px] text-muted-foreground">
                        Auto-derived from {activeCategory?.name || 'domain'} ({activeCategoryPrefix})
                    </p>
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

            {/* Level, Award & Class Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                        value={watch('level') || 'intermediate'}
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

                <div className="space-y-2">
                    <Label htmlFor="award">Award / Certification</Label>
                    <Input
                        id="award"
                        {...register('award')}
                        placeholder="e.g., Exam prep, Certificate"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="classSize">Class Size</Label>
                    <Input
                        id="classSize"
                        {...register('classSize')}
                        placeholder="e.g., Up to 16 participants"
                    />
                </div>
            </div>

            {/* Delivery Format Description */}
            <div className="space-y-2">
                <Label htmlFor="deliveryOptions">Delivery Format Description</Label>
                <Input
                    id="deliveryOptions"
                    {...register('deliveryOptions')}
                    placeholder="e.g., Public session, in house at your site, or online for selected titles"
                />
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

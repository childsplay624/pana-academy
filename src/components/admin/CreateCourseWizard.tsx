import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CourseBasicsForm } from './CourseBasicsForm';
import { OnlineCourseForm } from './OnlineCourseForm';
import { OnsiteCourseForm } from './OnsiteCourseForm';
import { HybridCourseForm } from './HybridCourseForm';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CourseType } from '@/types/course.types';
import { createCourse } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';

interface CourseBasics {
    title: string;
    description: string;
    instructorId: string;
    categoryId: string;
    courseType: CourseType;
    price: number;
    isFree: boolean;
    startDate?: string;
    endDate?: string;
    thumbnailUrl?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
}

interface CourseDetails {
    // Online course details
    learningOutcomes?: string[];
    requirements?: string[];

    // Onsite course details
    venueName?: string;
    venueAddress?: string;
    venueCity?: string;
    venueCountry?: string;
    venueCapacity?: number;
    venueMapUrl?: string;
    onsiteSchedule?: Array<{
        date: string;
        startTime: string;
        endTime: string;
        sessionTitle: string;
    }>;
    requiresMaterials?: boolean;
    materialsList?: string[];
    parkingInfo?: string;
    accommodationInfo?: string;
}

export function CreateCourseWizard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [courseBasics, setCourseBasics] = useState<CourseBasics>({
        title: '',
        description: '',
        instructorId: '',
        categoryId: '',
        courseType: 'online',
        price: 0,
        isFree: false,
    });

    const [courseDetails, setCourseDetails] = useState<CourseDetails>({});

    const totalSteps = 2;
    const progress = (currentStep / totalSteps) * 100;

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleBasicsSubmit = (data: CourseBasics) => {
        setCourseBasics(data);
        handleNextStep();
    };

    const handleDetailsSubmit = async (data: CourseDetails) => {
        setCourseDetails(data);

        setIsSubmitting(true);
        try {
            // Combine basics and details
            const courseData = {
                ...courseBasics,
                ...data,
            };

            const result = await createCourse(courseData);

            if (result.error) {
                throw new Error(result.error.message);
            }

            toast({
                title: 'Success!',
                description: `${courseBasics.courseType} course created successfully.`,
            });

            // Navigate to course editor
            navigate(`/course/${result.data.id}/edit`);
        } catch (error) {
            console.error('Error creating course:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create course',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Course</h1>
                <p className="text-muted-foreground">
                    Follow the steps to create your course
                </p>
            </div>

            {/* Progress Bar */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Step {currentStep} of {totalSteps}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        {/* Step Labels */}
                        <div className="flex justify-between text-sm">
                            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                {currentStep > 1 ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-xs">
                                        1
                                    </span>
                                )}
                                <span>Course Basics</span>
                            </div>

                            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-xs">
                                    2
                                </span>
                                <span>Course Details</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step Content */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {currentStep === 1 && 'Step 1: Course Basics'}
                        {currentStep === 2 && `Step 2: ${courseBasics.courseType === 'online' ? 'Online' : courseBasics.courseType === 'onsite' ? 'On-Site' : 'Hybrid'} Course Details`}
                    </CardTitle>
                    <CardDescription>
                        {currentStep === 1 && 'Enter the basic information about your course'}
                        {currentStep === 2 && courseBasics.courseType === 'online' && 'Add learning outcomes and requirements'}
                        {currentStep === 2 && courseBasics.courseType === 'onsite' && 'Add venue information, schedule, and logistics'}
                        {currentStep === 2 && courseBasics.courseType === 'hybrid' && 'Add both online and on-site course details'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {currentStep === 1 && (
                        <CourseBasicsForm
                            initialData={courseBasics}
                            onSubmit={handleBasicsSubmit}
                            onCancel={() => navigate('/dashboard/courses')}
                        />
                    )}

                    {currentStep === 2 && courseBasics.courseType === 'online' && (
                        <OnlineCourseForm
                            initialData={courseDetails}
                            onSubmit={handleDetailsSubmit}
                            onBack={handlePreviousStep}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {currentStep === 2 && courseBasics.courseType === 'onsite' && (
                        <OnsiteCourseForm
                            initialData={courseDetails}
                            courseBasics={courseBasics}
                            onSubmit={handleDetailsSubmit}
                            onBack={handlePreviousStep}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {currentStep === 2 && courseBasics.courseType === 'hybrid' && (
                        <HybridCourseForm
                            initialData={courseDetails}
                            courseBasics={courseBasics}
                            onSubmit={handleDetailsSubmit}
                            onBack={handlePreviousStep}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </CardContent>
            </Card>


        </div>
    );
}

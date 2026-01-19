import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OnlineCourseFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function OnlineCourseForm({ initialData, onSubmit, onBack, isSubmitting }: OnlineCourseFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialData,
    });

    const [learningOutcomes, setLearningOutcomes] = React.useState<string[]>(
        initialData.learningOutcomes || []
    );
    const [requirements, setRequirements] = React.useState<string[]>(
        initialData.requirements || []
    );

    const addLearningOutcome = () => {
        setLearningOutcomes([...learningOutcomes, '']);
    };

    const removeLearningOutcome = (index: number) => {
        setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
    };

    const updateLearningOutcome = (index: number, value: string) => {
        const updated = [...learningOutcomes];
        updated[index] = value;
        setLearningOutcomes(updated);
    };

    const addRequirement = () => {
        setRequirements([...requirements, '']);
    };

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const updateRequirement = (index: number, value: string) => {
        const updated = [...requirements];
        updated[index] = value;
        setRequirements(updated);
    };

    const handleFormSubmit = (data: any) => {
        onSubmit({
            ...data,
            learningOutcomes: learningOutcomes.filter(o => o.trim() !== ''),
            requirements: requirements.filter(r => r.trim() !== ''),
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Learning Outcomes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>What will students learn?</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add learning outcomes (optional)
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLearningOutcome}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Outcome
                    </Button>
                </div>

                <div className="space-y-2">
                    {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={outcome}
                                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                                placeholder={`Learning outcome ${index + 1}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLearningOutcome(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Prerequisites / Requirements</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            What should students know before taking this course? (optional)
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRequirement}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Requirement
                    </Button>
                </div>

                <div className="space-y-2">
                    {requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={req}
                                onChange={(e) => updateRequirement(index, e.target.value)}
                                placeholder={`Requirement ${index + 1}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRequirement(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="text-sm space-y-1">
                    <p>
                        <span className="text-muted-foreground">Learning Outcomes:</span>{' '}
                        {learningOutcomes.filter(o => o.trim()).length || 'None'}
                    </p>
                    <p>
                        <span className="text-muted-foreground">Requirements:</span>{' '}
                        {requirements.filter(r => r.trim()).length || 'None'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Course...' : 'Create Online Course'}
                </Button>
            </div>
        </form>
    );
}

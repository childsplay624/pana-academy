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
    const [standardsInput, setStandardsInput] = React.useState(
        (initialData.standards || []).join(', ')
    );
    const [oemInput, setOemInput] = React.useState(
        (initialData.oemPartners || initialData.oem_partners || []).join(', ')
    );
    const [targetAudience, setTargetAudience] = React.useState<string[]>(
        initialData.targetAudience || initialData.target_audience || []
    );
    const [practicalWork, setPracticalWork] = React.useState<string[]>(
        initialData.practicalWork || initialData.practical_work || []
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

    const addTargetAudience = () => {
        setTargetAudience([...targetAudience, '']);
    };

    const removeTargetAudience = (index: number) => {
        setTargetAudience(targetAudience.filter((_, i) => i !== index));
    };

    const updateTargetAudience = (index: number, value: string) => {
        const updated = [...targetAudience];
        updated[index] = value;
        setTargetAudience(updated);
    };

    const addPracticalWork = () => {
        setPracticalWork([...practicalWork, '']);
    };

    const removePracticalWork = (index: number) => {
        setPracticalWork(practicalWork.filter((_, i) => i !== index));
    };

    const updatePracticalWork = (index: number, value: string) => {
        const updated = [...practicalWork];
        updated[index] = value;
        setPracticalWork(updated);
    };

    const handleFormSubmit = (data: any) => {
        onSubmit({
            ...data,
            learningOutcomes: learningOutcomes.filter(o => o.trim() !== ''),
            requirements: requirements.filter(r => r.trim() !== ''),
            standards: standardsInput.split(',').map((s: string) => s.trim()).filter(Boolean),
            oemPartners: oemInput.split(',').map((s: string) => s.trim()).filter(Boolean),
            targetAudience: targetAudience.filter(t => t.trim() !== ''),
            practicalWork: practicalWork.filter(p => p.trim() !== ''),
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

            {/* Industrial Standards & Recognized References */}
            <div className="space-y-2 border-t pt-4">
                <div>
                    <Label htmlFor="standards">Standards & Recognized References</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated compliance standards (e.g., ISO 18436-2, ISO 20816, ISO 13373, API 670, API 684)
                    </p>
                </div>
                <Input
                    id="standards"
                    value={standardsInput}
                    onChange={(e) => setStandardsInput(e.target.value)}
                    placeholder="e.g., ISO 18436-2, ISO 20816, API 670, API 684"
                />
            </div>

            {/* Technology References & OEM Partners */}
            <div className="space-y-2">
                <div>
                    <Label htmlFor="oemPartners">Technology References & OEM Partners</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated partner equipment & technology (e.g., Baker Hughes, Siemens, ITT Goulds Pumps, GE Vernova)
                    </p>
                </div>
                <Input
                    id="oemPartners"
                    value={oemInput}
                    onChange={(e) => setOemInput(e.target.value)}
                    placeholder="e.g., Baker Hughes, Siemens, ITT Goulds Pumps, GE Vernova"
                />
            </div>

            {/* Who Should Attend / Target Audience */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Who Should Attend (Target Audience)</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add target engineering sectors, disciplines, or job titles
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTargetAudience}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Audience
                    </Button>
                </div>

                <div className="space-y-2">
                    {targetAudience.map((aud, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={aud}
                                onChange={(e) => updateTargetAudience(index, e.target.value)}
                                placeholder={`e.g., Oil and gas operators and service companies`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTargetAudience(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Practical Work & Exercises */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Practical Work & Hands-on Exercises</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Diagnostic workflows, simulation drills, or mock exams completed during the course
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPracticalWork}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Exercise
                    </Button>
                </div>

                <div className="space-y-2">
                    {practicalWork.map((pw, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={pw}
                                onChange={(e) => updatePracticalWork(index, e.target.value)}
                                placeholder={`e.g., Diagnose faults from a library of real turbomachinery datasets`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePracticalWork(index)}
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

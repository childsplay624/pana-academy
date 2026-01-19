import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnlineCourseForm } from './OnlineCourseForm';
import { OnsiteCourseForm } from './OnsiteCourseForm';

interface HybridCourseFormProps {
    initialData: any;
    courseBasics: any;
    onSubmit: (data: any) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function HybridCourseForm({
    initialData,
    courseBasics,
    onSubmit,
    onBack,
    isSubmitting
}: HybridCourseFormProps) {
    const [onlineData, setOnlineData] = React.useState(initialData.online || {});
    const [onsiteData, setOnsiteData] = React.useState(initialData.onsite || {});
    const [currentTab, setCurrentTab] = React.useState('online');

    const handleOnlineNext = (data: any) => {
        setOnlineData(data);
        setCurrentTab('onsite');
    };

    const handleOnsiteSubmit = (data: any) => {
        // Combine online and onsite data
        onSubmit({
            ...onlineData,
            ...data,
        });
    };

    return (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="online" disabled={isSubmitting}>
                    💻 Online Component
                </TabsTrigger>
                <TabsTrigger value="onsite" disabled={isSubmitting}>
                    🏢 On-Site Component
                </TabsTrigger>
            </TabsList>

            <TabsContent value="online" className="space-y-4 mt-6">
                <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20 mb-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Online Component:</strong> Students will access these materials online before or after the on-site sessions.
                    </p>
                </div>
                <OnlineCourseForm
                    initialData={onlineData}
                    onSubmit={handleOnlineNext}
                    onBack={onBack}
                    isSubmitting={false}
                />
            </TabsContent>

            <TabsContent value="onsite" className="space-y-4 mt-6">
                <div className="rounded-lg border p-4 bg-purple-50 dark:bg-purple-950/20 mb-4">
                    <p className="text-sm text-purple-900 dark:text-purple-100">
                        <strong>On-Site Component:</strong> Students will attend these in-person sessions at the venue.
                    </p>
                </div>
                <OnsiteCourseForm
                    initialData={onsiteData}
                    courseBasics={courseBasics}
                    onSubmit={handleOnsiteSubmit}
                    onBack={() => setCurrentTab('online')}
                    isSubmitting={isSubmitting}
                />
            </TabsContent>
        </Tabs>
    );
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'success' | 'warning';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    variant = 'default'
}) => {
    const bgColor = {
        default: 'bg-muted',
        success: 'bg-green-50',
        warning: 'bg-orange-50'
    }[variant];

    const iconColor = {
        default: 'text-muted-foreground',
        success: 'text-green-500',
        warning: 'text-orange-500'
    }[variant];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg">
            <div className={`p-4 rounded-full ${bgColor} mb-4`}>
                <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
};

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Maintenance from '@/pages/Maintenance';

export const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
    const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);
    const { profile, loading: authLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                const { data, error } = await supabase
                    .from('platform_settings')
                    .select('value')
                    .eq('key', 'maintenance_mode')
                    .single();

                if (!error && data) {
                    let value = data.value;
                    if (typeof value === 'string') {
                        try {
                            value = JSON.parse(value);
                        } catch {
                            value = value === 'true';
                        }
                    }
                    const isMaint = value === true;
                    setMaintenanceMode(isMaint);
                    console.log('Maintenance mode fetched:', isMaint);
                } else {
                    setMaintenanceMode(false);
                }
            } catch (err) {
                console.error('Error checking maintenance mode:', err);
                setMaintenanceMode(false);
            }
        };

        checkMaintenance();
    }, [location.pathname]);

    if (maintenanceMode === null || authLoading) {
        return null;
    }

    // Define paths that are always accessible
    const isAuthPage = location.pathname.startsWith('/auth');
    const isAdmin = profile?.role === 'admin';

    console.log('MaintenanceGuard Check:', { maintenanceMode, isAdmin, isAuthPage });

    // If maintenance is ON:
    // - Admins can still see everything (to fix things)
    // - Everyone can see the /auth pages (so admins can log in)
    // - Otherwise, show the maintenance page
    if (maintenanceMode && !isAdmin && !isAuthPage) {
        console.log('REDIRECTING TO MAINTENANCE PAGE');
        return <Maintenance />;
    }

    return <>{children}</>;
};

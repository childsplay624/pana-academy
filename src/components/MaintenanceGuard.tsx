import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Maintenance from '@/pages/Maintenance';

const parseBooleanValue = (val: any): boolean => {
    if (val === true || val === 1) return true;
    if (val === false || val === 0 || val === null || val === undefined) return false;
    if (typeof val === 'string') {
        const cleaned = val.trim().toLowerCase().replace(/^["']|["']$/g, '');
        return cleaned === 'true' || cleaned === '1' || cleaned === 'yes' || cleaned === 'on';
    }
    if (typeof val === 'object') {
        if ('enabled' in val) return parseBooleanValue(val.enabled);
        if ('value' in val) return parseBooleanValue(val.value);
    }
    return false;
};

export const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
    const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);
    const { user, profile, loading: authLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const checkMaintenance = async () => {
            try {
                const { data, error } = await supabase
                    .from('platform_settings')
                    .select('value')
                    .eq('key', 'maintenance_mode')
                    .maybeSingle();

                if (isMounted) {
                    if (!error && data) {
                        const isMaint = parseBooleanValue(data.value);
                        setMaintenanceMode(isMaint);
                        console.log('MaintenanceGuard check maintenance_mode:', isMaint, 'raw:', data.value);
                    } else {
                        if (error) console.error('MaintenanceGuard fetch error:', error);
                        setMaintenanceMode(false);
                    }
                }
            } catch (err) {
                console.error('Error checking maintenance mode:', err);
                if (isMounted) setMaintenanceMode(false);
            }
        };

        checkMaintenance();

        // Subscribe to realtime updates on platform_settings
        const channel = supabase
            .channel('maintenance_mode_guard_channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'platform_settings',
                    filter: 'key=eq.maintenance_mode',
                },
                (payload) => {
                    if (payload.new && 'value' in payload.new) {
                        const isMaint = parseBooleanValue(payload.new.value);
                        console.log('Realtime maintenance_mode updated:', isMaint);
                        if (isMounted) setMaintenanceMode(isMaint);
                    }
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [location.pathname]);

    // Don't render until maintenance status is determined and auth loading is done
    if (maintenanceMode === null || authLoading) {
        return null;
    }

    // Paths always accessible during maintenance
    const isAuthPage = 
        location.pathname.startsWith('/auth') || 
        location.pathname.startsWith('/reset-password') || 
        location.pathname.startsWith('/verify-email');

    // Admin role check (from profile or user metadata fallback)
    const isAdmin = profile?.role === 'admin' || user?.user_metadata?.role === 'admin';

    // If maintenance is active, non-admin, non-auth page, show Maintenance screen
    if (maintenanceMode && !isAdmin && !isAuthPage) {
        console.log('Maintenance Mode Active: Rendering Maintenance Page');
        return <Maintenance />;
    }

    return <>{children}</>;
};


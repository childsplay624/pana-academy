import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePlatformSettings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['platform-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('platform_settings').select('key, value');
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data.forEach(item => {
        let value = item.value;
        
        // If it's a string, try to parse it as JSON
        if (typeof value === 'string') {
          // Handle simple boolean strings that might not be valid JSON if not quoted
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          else {
            try {
              value = JSON.parse(value);
            } catch {
              // Keep as original string
            }
          }
        }
        
        settingsMap[item.key] = value;
      });
      return settingsMap;
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

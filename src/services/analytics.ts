import { supabase } from '@/integrations/supabase/client';

let isInitialized = false;
let isEnabled = false;

export const initAnalytics = async () => {
  if (isInitialized) return;

  // Disable in development mode
  if (import.meta.env.DEV) {
    console.log('[Analytics] Disabled in development mode');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('analytics_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 0 rows error temporarily
      console.error('[Analytics] Failed to fetch settings', error);
      return;
    }

    if (data && data.analytics_enabled && data.ga_measurement_id) {
      isEnabled = true;
      injectGAScript(data.ga_measurement_id);
      isInitialized = true;
    }
  } catch (error) {
    console.error('[Analytics] Error initializing', error);
  }
};

const injectGAScript = (measurementId: string) => {
  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const inlineScript = document.createElement('script');
  inlineScript.id = 'ga-inline-script';
  inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { page_path: window.location.pathname });
  `;
  document.head.appendChild(inlineScript);
};

export const trackPageView = (path: string) => {
  if (!isEnabled || typeof window === 'undefined' || !(window as any).gtag) return;
  
  (window as any).gtag('event', 'page_view', {
    page_path: path,
  });
};

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (!isEnabled || typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', eventName, params);
};

export const trackConversion = (conversionId: string, params: Record<string, any> = {}) => {
  if (!isEnabled || typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'conversion', {
    send_to: conversionId,
    ...params
  });
};

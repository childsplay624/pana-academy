import { supabase } from "@/integrations/supabase/client";

export interface BankDetails {
    bank_name: string;
    account_number: string;
    account_name: string;
}

export const getSiteSetting = async <T>(key: string): Promise<T | null> => {
    try {
        const { data, error } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            console.error(`Error fetching site setting ${key}:`, error);
            return null;
        }

        // Handle case where value might be stored as a stringified JSON
        if (typeof data.value === 'string') {
            try {
                return JSON.parse(data.value) as T;
            } catch {
                return data.value as unknown as T;
            }
        }

        return data?.value as T;
    } catch (error) {
        console.error(`Unexpected error fetching site setting ${key}:`, error);
        return null;
    }
};

export const getBankDetails = async (): Promise<BankDetails | null> => {
    return await getSiteSetting<BankDetails>('bank_details');
};

export const updateSiteSetting = async (key: string, value: any): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('platform_settings')
            .upsert({
                key,
                value: JSON.stringify(value),
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error(`Error updating site setting ${key}:`, error);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Unexpected error updating site setting ${key}:`, error);
        return false;
    }
};

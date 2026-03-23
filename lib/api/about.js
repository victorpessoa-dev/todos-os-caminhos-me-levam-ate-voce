import { supabase } from '../supabaseClient';

export async function getAboutInfo() {
    const { data, error } = await supabase
        .from('about')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        throw error;
    }

    return data;
}
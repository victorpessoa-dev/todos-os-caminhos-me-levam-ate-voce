import { supabase } from "../lib/supabaseClient";

export async function hasActiveSession() {
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session?.user?.id);
}

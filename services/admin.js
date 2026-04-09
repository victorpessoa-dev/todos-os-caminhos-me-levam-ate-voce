import { supabase } from "../lib/supabaseClient";

export async function getIsCurrentUserAdmin() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) return false;

    const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

    return Boolean(data?.user_id);
}
import { supabase } from "../lib/supabaseClient";

export async function getIsCurrentUserAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return false;

    const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (error) {
        console.error("Erro ao verificar admin:", error);
        return false;
    }

    return Boolean(data?.user_id);
}

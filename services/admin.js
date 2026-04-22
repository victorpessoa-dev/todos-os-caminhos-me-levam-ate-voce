import { supabase } from "../lib/supabaseClient";

const adminStatusCache = new Map();

export function clearAdminStatusCache(userId) {
    if (userId) {
        adminStatusCache.delete(userId);
        return;
    }

    adminStatusCache.clear();
}

export async function getIsCurrentUserAdmin(userId) {
    let currentUserId = userId;

    if (!currentUserId) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        currentUserId = session?.user?.id;
    }

    if (!currentUserId) return false;

    if (adminStatusCache.has(currentUserId)) {
        return adminStatusCache.get(currentUserId);
    }

    const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", currentUserId)
        .maybeSingle();

    const isAdmin = Boolean(data?.user_id);
    adminStatusCache.set(currentUserId, isAdmin);

    return isAdmin;
}

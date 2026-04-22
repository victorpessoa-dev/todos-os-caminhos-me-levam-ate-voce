"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    clearAdminStatusCache,
    getIsCurrentUserAdmin,
} from "@/services/admin";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const syncAuthState = async (nextSession) => {
            if (!isMounted) return;

            const nextUser = nextSession?.user ?? null;

            setSession(nextSession);
            setUser(nextUser);

            if (!nextUser) {
                clearAdminStatusCache();
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const admin = await getIsCurrentUserAdmin(nextUser.id);
            if (!isMounted) return;

            setIsAdmin(admin);
            setLoading(false);
        };

        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            await syncAuthState(data.session);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, nextSession) => {
                await syncAuthState(nextSession);
            }
        );

        return () => {
            isMounted = false;
            listener?.subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAdmin,
                loading,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};

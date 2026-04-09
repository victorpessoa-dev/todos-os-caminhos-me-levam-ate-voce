"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getIsCurrentUserAdmin } from "@/services/admin";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncAuthState = async (nextSession) => {
            setSession(nextSession);
            setUser(nextSession?.user ?? null);

            if (!nextSession?.user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            const admin = await getIsCurrentUserAdmin();
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

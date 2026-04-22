"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

function SessionLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-marsala border-t-transparent mb-3" aria-hidden />
                <p className="text-gray-600 animate-pulse">
                    Verificando sessão...
                </p>
            </div>
        </div>
    );
}

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace("/admin/login");
            return;
        }
        if (!isAdmin) {
            router.replace("/");
        }
    }, [isAdmin, loading, user, router]);

    if (loading) {
        return <SessionLoading />;
    }

    if (!user || !isAdmin) {
        return <SessionLoading />;
    }

    return children;
}

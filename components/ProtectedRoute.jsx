"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        router.replace("/login");
        return null;
    }

    if (user === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-marsala mb-3"></div>
                    <p className="text-gray-600 animate-pulse">
                        Verificando sessão...
                    </p>
                </div>
            </div>
        );
    }

    if (user === null) {
        return null;
    }

    return children;
}
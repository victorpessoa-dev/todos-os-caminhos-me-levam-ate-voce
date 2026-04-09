"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();
    const { user, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (!loading && user && isAdmin) {
            router.replace("/admin/dashboard");
        }
    }, [isAdmin, loading, user, router]);

    const handleLogin = useCallback(async () => {
        if (loggingIn) return;

        // 🔥 validação leve (evita request desnecessária)
        if (!email.trim() || !password.trim()) {
            return setErrorMsg("Preencha e-mail e senha.");
        }

        setLoggingIn(true);
        setErrorMsg("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                setErrorMsg("E-mail ou senha inválidos.");
                return;
            }

            // redirecionamento vem do useEffect
        } catch (err) {
            console.error(err);
            setErrorMsg("Erro ao tentar login.");
        } finally {
            setLoggingIn(false);
        }
    }, [email, password, loggingIn]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-marsala border-t-transparent" />
            </div>
        );
    }

    if (user && isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
                    Login
                </h2>

                <div className="space-y-4">
                    {user && !isAdmin && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            Esta conta está autenticada, mas não possui permissão de administrador.
                        </p>
                    )}

                    {errorMsg && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorMsg}
                        </p>
                    )}

                    <div>
                        <label className="label-field">E-mail</label>
                        <input
                            className="input-field"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-field">Senha</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loggingIn}
                        className="btn btn-primary w-full mt-2 disabled:opacity-50"
                    >
                        {loggingIn ? "Entrando..." : "Entrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
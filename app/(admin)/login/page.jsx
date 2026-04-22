"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loginAttempted, setLoginAttempted] = useState(false);

    const router = useRouter();
    const { user, isAdmin, loading, signOut } = useAuth();

    useEffect(() => {
        if (!loading && user && isAdmin) {
            router.replace("/admin/dashboard");
        }
    }, [isAdmin, loading, user, router]);

    const handleLogin = useCallback(async () => {
        if (loggingIn) return;

        setLoginAttempted(true);

        if (!email.trim() || !password.trim()) {
            setErrorMsg("Preencha e-mail e senha.");
            return;
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

            setErrorMsg("");
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-marsala/10 text-marsala">
                        ✓
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Acesso liberado
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">
                        Você já está autenticado como administrador. Redirecionando para o painel.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md">
                <div className="mb-6">
                    <h2 className="text-xs text-center uppercase tracking-[0.24em] text-gray-500 mb-2">
                        Acesso administrativo
                    </h2>
                </div>

                <div className="space-y-4">
                    {loginAttempted && user && !isAdmin && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800 space-y-3">
                            <p>
                                Sua conta está autenticada, mas não tem permissão para acessar o painel.
                            </p>
                            <button
                                type="button"
                                onClick={signOut}
                                className="text-sm font-medium text-amber-900 underline underline-offset-4"
                            >
                                Sair e usar outra conta
                            </button>
                        </div>
                    )}

                    {errorMsg && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errorMsg}
                        </p>
                    )}

                    <div>
                        <label className="label-field">E-mail do admin</label>
                        <input
                            className="input-field"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-field">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="input-field pr-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 transition-colors hover:text-marsala focus-visible:outline-none focus-visible:text-marsala"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loggingIn}
                        className="btn btn-primary w-full mt-2 disabled:opacity-50"
                    >
                        {loggingIn ? "Entrando..." : "Entrar"}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        Apenas contas cadastradas em `admin_users` conseguem entrar.
                    </p>
                </div>
            </div>
        </div>
    );
}

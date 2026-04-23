import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-beige flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-marsala">
                    <Search className="h-7 w-7" />
                </div>

                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-gray-500">
                    Página não encontrada
                </p>

                <h1 className="hero-title mb-4">
                    404
                </h1>

                <p className="hero-lead italic text-gray-600 mb-8">
                    O caminho que você tentou acessar não existe ou foi removido.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/" className="btn-hero w-full sm:w-auto inline-flex items-center justify-center gap-2">
                        <Home className="h-4 w-4" />
                        Voltar para a home
                    </Link>
                </div>
            </div>
        </div>
    );
}

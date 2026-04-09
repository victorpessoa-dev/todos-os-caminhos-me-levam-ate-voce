"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { Menu, X, LogOut } from "lucide-react";

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/posts", label: "Posts" },
    { path: "/admin/gallery", label: "Galeria" },
    { path: "/admin/about", label: "Sobre Mim" },
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="group flex min-w-0 items-center space-x-2 sm:space-x-3">
          <span className="shrink-0 text-xl text-marsala transition-transform group-hover:scale-110 sm:text-3xl">
            ✝
          </span>
          <span className="font-script text-sm leading-tight tracking-wide text-gray-800 sm:text-2xl sm:whitespace-nowrap">
            Todos os Caminhos me levam ate <span className="text-marsala">Voce</span>
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={isActive(link.path) ? "nav-link-active" : "nav-link"}
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <LogOut size={18} />
            Sair
          </button>
        </nav>

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marsala focus-visible:ring-offset-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-md px-2 py-2 ${
                  isActive(link.path) ? "nav-link-active border-b-0 font-semibold" : "nav-link"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              Sair
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

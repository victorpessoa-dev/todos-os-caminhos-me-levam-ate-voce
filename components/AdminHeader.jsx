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
    { path: "/admin/about", label: "Sobre Mim" }
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3 group">
          <span className="text-2xl sm:text-3xl text-marsala transition-transform group-hover:scale-110">
            ✝
          </span>
          <span className="font-script text-lg sm:text-2xl text-gray-800 tracking-wide whitespace-nowrap">
            Todos os Caminhos me levam até <span className="text-marsala">Você</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium ${isActive(link.path)
                ? "text-marsala border-b-2 border-marsala pb-1"
                : "text-gray-700 hover:text-marsala"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            Sair
          </button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block ${isActive(link.path)
                  ? "text-marsala"
                  : "text-gray-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="block text-red-600 mt-4"
            >
              Sair
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
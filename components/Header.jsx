"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/diary", label: "Meu Diario" },
    { path: "/gallery", label: "Galeria" },
    { path: "/about", label: "Sobre" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 sm:h-20">
          <Link
            href="/"
            className="group flex min-w-0 items-center space-x-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marsala focus-visible:ring-offset-2 sm:space-x-3"
          >
            <span className="shrink-0 text-lg text-marsala transition-transform group-hover:scale-105 sm:text-2xl">
              ✝
            </span>
            <span className="font-script text-sm leading-tight tracking-wide text-gray-800 sm:text-xl sm:whitespace-nowrap">
              Todos os Caminhos me levam ate <span className="text-marsala">Voce</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={isActive(link.path) ? "nav-link-active" : "nav-link"}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marsala focus-visible:ring-offset-2 md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="animate-fadeIn border-t border-gray-200 bg-white md:hidden">
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
          </nav>
        </div>
      )}
    </header>
  );
}

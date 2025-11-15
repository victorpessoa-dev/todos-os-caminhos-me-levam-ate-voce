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
    { path: "/diary", label: "Meu Diário" },
    { path: "/gallery", label: "Galeria" },
    { path: "/about", label: "Sobre" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo e frase */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-2xl sm:text-3xl text-marsala transition-transform group-hover:scale-110">
              ✝
            </span>
            <span className="font-script text-lg sm:text-2xl text-gray-800 tracking-wide whitespace-nowrap">
              Todos os Caminhos me levam até <span className="text-marsala">Você</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-base font-medium transition-colors hover:text-marsala ${isActive(link.path)
                  ? "text-marsala border-b-2 border-marsala pb-1"
                  : "text-gray-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-beige transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors hover:text-marsala ${isActive(link.path) ? "text-marsala" : "text-gray-700"
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

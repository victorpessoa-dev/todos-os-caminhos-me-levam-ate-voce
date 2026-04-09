"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-beige to-white"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-9xl">✝</div>
          <div className="absolute bottom-40 right-32 text-9xl">✝</div>
          <div className="absolute top-1/3 right-1/4 text-6xl">✝</div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeIn">
          <Heart className="w-16 h-16 text-marsala mx-auto mb-6 animate-pulse" />

          <h1 className="hero-title">
            Todos os caminhos me levam até{" "}
            <span className="text-marsala">Você</span>
          </h1>

          <p className="hero-lead italic text-gray-600 mb-12">
            Painel do site — gerencie posts, galeria e página sobre.
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link href="/admin/posts" className="btn-hero w-full sm:w-auto">
              Posts
            </Link>
            <Link href="/admin/gallery" className="btn-hero w-full sm:w-auto">
              Galeria
            </Link>
            <Link href="/admin/about" className="btn-hero w-full sm:w-auto">
              Sobre mim
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

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

          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-gray-800 mb-6 leading-tight">
            Todos os caminhos me levam até{" "}
            <span className="text-marsala">Você</span>
          </h1>

          <p className="text-xl italic sm:text-2xl text-gray-600 mb-12 font-light">
            Um diário sobre minha vida com Cristo.
          </p>

          <Link
            href="/admin/posts"
            className="inline-block bg-marsala text-white italic px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Posts
          </Link>

          <Link
            href="/admin/gallery"
            className="inline-block bg-marsala text-white italic px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Galeria
          </Link>

          <Link
            href="/admin/about"
            className="inline-block bg-marsala text-white italic px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Sobre Mim
          </Link>
        </div>
      </section>
    </div>
  );
}
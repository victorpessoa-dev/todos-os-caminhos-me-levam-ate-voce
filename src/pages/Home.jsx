"use client";
import Link from 'next/link';
import { Heart } from 'lucide-react';

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
          <Heart className="w-16 h-16 text-gold mx-auto mb-6 animate-pulse" />

          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-gray-800 mb-6 leading-tight">
            Todos os caminhos me levam até Você.
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 font-light">
            Um diário sobre minha vida com Cristo.
          </p>

          <Link
            href="/diary"
            className="inline-block bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Entrar no Diário
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 animate-fadeIn">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="font-script text-2xl text-gray-800 mb-3">Meu Diário</h3>
              <p className="text-gray-600">
                Reflexões diárias sobre minha caminhada com Cristo e os ensinamentos que Ele me revela.
              </p>
            </div>

            <div className="p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4">📷</div>
              <h3 className="font-script text-2xl text-gray-800 mb-3">Galeria</h3>
              <p className="text-gray-600">
                Momentos capturados em fotos, cada imagem conta uma história de fé e gratidão.
              </p>
            </div>

            <div className="p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="font-script text-2xl text-gray-800 mb-3">Oração</h3>
              <p className="text-gray-600">
                Compartilhe seus pedidos de oração. Juntos, levamos nossas intenções ao Pai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="font-script text-3xl sm:text-4xl text-gray-800 mb-4 leading-relaxed">
            "Confia ao Senhor a tua sorte, espera nele, e ele agirá."
          </blockquote>
          <p className="text-gray-600 italic">Salmo 37, 5</p>
        </div>
      </section>
    </div>
  );
}

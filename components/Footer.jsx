"use client";

import { ArrowUp, Instagram, Share2 } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Todos os Caminhos me levam até Você',
          text: 'Um diário sobre minha vida com Cristo',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    };
  };

  return (
    <footer className="bg-beige py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-script text-2xl sm:text-3xl text-gray-800 mb-2">
            "Eu sou o Caminho, a Verdade e a Vida."
          </p>
          <p className="text-sm text-gray-600 italic">João 14,6</p>
        </div>

        <div className="flex justify-center items-center space-x-6 mb-12">
          <a
            href="https://www.instagram.com/_raianequele/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white hover:bg-marsala hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            title="Visite meu Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-white hover:bg-marsala hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            title="Compartilhar"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white hover:bg-marsala hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Todos os Caminhos me levam até Você</p>
          <p className="mt-2">Feito por <a className="font-bold" href="https://github.com/victorpessoa-dev" target="_blank" rel="noopener noreferrer">Victor Pessoa</a></p>
        </div>
      </div>
    </footer>
  );
}

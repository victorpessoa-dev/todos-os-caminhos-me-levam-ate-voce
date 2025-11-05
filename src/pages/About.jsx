"use client";
import { useState, useEffect } from 'react';
import { Heart, Cross, BookOpen } from 'lucide-react';
import { getAboutInfo } from '@/lib/api';

export default function About() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutInfo() {
      try {
        const data = await getAboutInfo();
        setAboutInfo(data);
      } catch (error) {
        console.error('Error loading about info:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAboutInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            {aboutInfo?.title || 'Sobre Mim'}
          </h1>
          <p className="text-xl text-gray-600">
            Um peregrino em busca de Cristo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-12 animate-fadeIn">
          <div className="relative h-80">
            <img
              src={aboutInfo?.image}
              alt="Peregrino"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: aboutInfo?.description }} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md text-center animate-fadeIn">
            <Cross className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-script text-2xl text-gray-800 mb-3">Fé</h3>
            <p className="text-gray-600">
              A fé é o alicerce desta jornada. Confio no plano de Deus para minha vida.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <BookOpen className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-script text-2xl text-gray-800 mb-3">Palavra</h3>
            <p className="text-gray-600">
              A Bíblia é meu guia diário, fonte de sabedoria e consolo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <Heart className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-script text-2xl text-gray-800 mb-3">Amor</h3>
            <p className="text-gray-600">
              O amor de Cristo me transforma e me move a amar o próximo.
            </p>
          </div>
        </div>

        <div className="bg-gold/10 border-l-4 border-gold p-8 rounded-lg">
          <p className="font-script text-2xl text-gray-800 text-center">
            "Senhor, para onde iremos? Tu tens as palavras da vida eterna."
          </p>
          <p className="text-center text-gray-600 mt-4 italic">João 6, 68</p>
        </div>
      </div>
    </div>
  );
}

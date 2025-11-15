"use client";
import { useState, useEffect } from "react";
import { Heart, Cross, BookOpen } from "lucide-react";


export default function About() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutInfo() {
      try {
        const data = await getAboutInfo();
        setAboutInfo(data);
      } catch (error) {
        console.error("Erro ao carregar informações do 'Sobre':", error);
      } finally {
        setLoading(false);
      }
    }

    loadAboutInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            {aboutInfo?.title || "Sobre Mim"}
          </h1>
          <p className="text-xl italic text-gray-600">
            Uma peregrina em busca de Cristo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-12 animate-fadeIn">
          <div className="relative h-80">
            <img
              src={aboutInfo?.urlImage}
              alt={aboutInfo?.title || "Imagem do autor"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="p-8 sm:p-12">
            {aboutInfo?.description ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutInfo.description }}
              />
            ) : (
              <p className="text-gray-600">
                Nenhuma descrição disponível no momento.
              </p>
            )}
          </div>
        </div>

        {/* Cards de valores */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Cross className="w-12 h-12 text-marsala mx-auto mb-4" />,
              title: "Fé",
              text: "A fé é o alicerce desta jornada. Confio no plano de Deus para minha vida.",
              delay: "0s",
            },
            {
              icon: <BookOpen className="w-12 h-12 text-marsala mx-auto mb-4" />,
              title: "Palavra",
              text: "A Bíblia é meu guia diário, fonte de sabedoria e consolo.",
              delay: "0.1s",
            },
            {
              icon: <Heart className="w-12 h-12 text-marsala mx-auto mb-4" />,
              title: "Amor",
              text: "O amor de Cristo me transforma e me move a amar o próximo.",
              delay: "0.2s",
            },
          ].map(({ icon, title, text, delay }, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg shadow-md text-center animate-fadeIn"
              style={{ animationDelay: delay }}
            >
              {icon}
              <h3 className="font-script text-2xl text-gray-800 mb-3">{title}</h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-70 p-8 rounded-lg">
          <p className="font-script text-2xl text-gray-800 text-center">
            “Senhor, para onde iremos? Tu tens as palavras da vida eterna.”
          </p>
          <p className="text-center text-gray-600 mt-4 italic">João 6, 68</p>
        </div>
      </div>
    </div>
  );
}

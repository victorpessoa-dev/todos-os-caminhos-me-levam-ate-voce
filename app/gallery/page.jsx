"use client";
import { useState, useEffect } from "react";
import GalleryItem from "../components/GalleryItem";
import { getGallery } from "../../lib/api";
export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getGallery();
        setImages(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar galeria:", err);
        setError("Não foi possível carregar a galeria. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-marsala mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando galeria...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-marsala text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            Meus momentos com <span className="text-marsala">Cristo</span>
          </h1>
          <p className="text-xl italic text-gray-600 max-w-2xl mx-auto">
            Momentos que me levam até Ele, vividos com o coração.
          </p>
        </div>

        {images.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            {images.map((item) => (
              <GalleryItem
                key={item.id}
                image={item.urlImage}
                caption={item.title || "Momento com Cristo"}
                reflection={item.title}
              />
            ))}
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-6xl mb-4">📷</div>
            {/* ↑ ÍCONE DE CÂMERA (não livro) */}
            <p className="text-gray-600 text-lg mb-2">
              Ainda não há momentos publicados.
            </p>
            <p className="text-gray-500 text-sm">
              Volte em breve para ver os primeiros registros desta jornada.
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="text-center mt-12 animate-fadeIn">
            <p className="text-gray-600 italic">
              {images.length} {images.length === 1 ? "momento registrado" : "momentos registrados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
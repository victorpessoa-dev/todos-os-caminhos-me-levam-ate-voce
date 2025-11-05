"use client";
import { useState, useEffect } from 'react';
import GalleryItem from '../components/GalleryItem';
import { getGalleryItems } from '@/lib/api';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getGalleryItems();
        setGalleryItems(data);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            Galeria de Caminhos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Momentos capturados, cada imagem conta uma história de fé, gratidão e encontro com o Divino.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <GalleryItem
              key={index}
              image={item.url}
              caption={item.caption}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

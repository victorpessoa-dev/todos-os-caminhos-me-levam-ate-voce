"use client";
import { useState } from 'react';
import { X } from 'lucide-react';

export default function GalleryItem({ image, caption, reflection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn"
      >
        <div className="aspect-square">
          <img
            src={image}
            alt={caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <p className="text-white font-script text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
            {caption}
          </p>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gold hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt={caption}
              className="w-full max-h-[60vh] object-contain bg-gray-100"
            />
            <div className="p-6">
              <h3 className="font-script text-2xl text-gray-800 mb-3">{caption}</h3>
              {reflection && (
                <p className="text-gray-600 leading-relaxed">{reflection}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

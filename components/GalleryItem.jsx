"use client";
import { useState } from 'react';
import { X } from 'lucide-react';


export default function GalleryItem({ image, caption, altText, reflection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-marsala/20 transition-all duration-300 animate-fadeIn"
      >
        <div className="aspect-square">
          <img
            src={image}
            alt={altText || caption || ""}
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-md hover:bg-marsala hover:text-white hover:border-marsala transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt={altText || caption || ""}
              className="w-full max-h-[60vh] object-contain bg-gray-100"
            />
            <div className="p-6">
              <h3 className="font-script text-xl sm:text-2xl text-gray-800 mb-3">{caption}</h3>
              {reflection && (
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{reflection}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

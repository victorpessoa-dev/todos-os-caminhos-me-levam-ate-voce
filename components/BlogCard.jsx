"use client";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function BlogCard({ slug, title, createdAt, updatedAt, description, urlImage }) {
  const dateToUse = updatedAt || createdAt;
  const safeDate = dateToUse ? new Date(dateToUse) : new Date();

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn">
      <div className="relative h-64 overflow-hidden">
        <img
          src={urlImage || "/placeholder.jpg"}
          alt={title || "Imagem do post"}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <time dateTime={safeDate.toISOString()}>
            {safeDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>

        <h3 className="font-script text-2xl text-gray-800 mb-3 hover:text-gold transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {description?.length > 0 ? description : "Sem descrição disponível."}
        </p>

        <Link
          href={`/diary/${slug}`}
          className="inline-block text-gold hover:text-gray-800 font-medium transition-colors group"
        >
          Ler mais
          <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

"use client";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { sanitizeImageUrl } from "../lib/content";

export default function BlogCard({
    slug,
    title,
    description,
    cover_image,
    cover_image_alt,
    published_at,
    created_at,
    updated_at,
}) {
    const dateToUse = published_at || updated_at || created_at;
    const safeDate = new Date(dateToUse || Date.now());
    const safeCoverImage = sanitizeImageUrl(cover_image) || "/placeholder.jpg";

    return (
        <article className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-marsala/20 transition-all duration-300 hover:-translate-y-0.5 animate-fadeIn">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={safeCoverImage}
                    alt={cover_image_alt || title || "Imagem do post"}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="p-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <time dateTime={safeDate.toISOString()}>
                        {safeDate.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </time>
                </div>

                <h3 className="font-script text-xl sm:text-2xl text-gray-800 mb-3 hover:text-marsala transition-colors">
                    {title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {description?.length > 0 ? description : "Sem descrição disponível."}
                </p>

                <Link
                    href={`/diary/${slug}`}
                    className="inline-flex items-center text-sm font-medium text-marsala hover:text-marsala-dark transition-colors group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marsala focus-visible:ring-offset-2"
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

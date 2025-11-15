"use client";
import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";

export default function Diary() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            Meu Diário com <span className="text-marsala">Cristo</span>
          </h1>
          <p className="text-xl italic text-gray-600 max-w-2xl mx-auto">
            Reflexões sobre os caminhos que me levam até Ele, escritas com o coração.
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Carregando reflexões...</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const dateToUse = post.dateUpdated || post.dateCreated;

              const formattedDate = dateToUse
                ? new Date(dateToUse).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
                : "Data desconhecida";

              return (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  date={formattedDate}
                  description={post.description}
                  image={post.urlImage}
                />
              );
            })}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              Ainda não há reflexões publicadas. Volte em breve para ler os primeiros caminhos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

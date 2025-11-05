"use client";
import { useState } from 'react';
import { Send, Heart } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="font-script text-5xl sm:text-6xl text-gray-800 mb-4">
            Contato & Pedidos de Oração
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compartilhe sua intenção de oração ou envie uma mensagem. Levarei seus pedidos ao Pai em oração.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12 animate-fadeIn">
          {submitted ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gold mx-auto mb-6 animate-pulse" />
              <h2 className="font-script text-3xl text-gray-800 mb-4">
                Mensagem enviada com fé!
              </h2>
              <p className="text-gray-600 text-lg">
                Obrigado por compartilhar. Que Deus abençoe você abundantemente. ✝
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem / Pedido de Oração
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Compartilhe seu pedido de oração ou mensagem..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                <span>Enviar com Fé</span>
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 bg-gold/10 border-l-4 border-gold p-8 rounded-lg">
          <p className="font-script text-2xl text-gray-800 mb-4 text-center">
            "Onde dois ou três estiverem reunidos em meu nome, eu estou aí, no meio deles."
          </p>
          <p className="text-center text-gray-600 italic">Mateus 18, 20</p>
        </div>
      </div>
    </div>
  );
}

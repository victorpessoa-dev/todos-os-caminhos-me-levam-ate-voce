"use client";


export default function AdminFooter() {
  return (
    <footer className="bg-beige py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-script text-2xl sm:text-3xl text-gray-800 mb-2">
            "Eu sou o Caminho, a Verdade e a Vida."
          </p>
          <p className="text-gray-600 italic">João 14,6</p>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Todos os Caminhos me levam até Você</p>
          <p className="mt-2">Feito por <a className="font-bold text-marsala" href="https://github.com/victorpessoa-dev" target="_blank" rel="noopener noreferrer">Victor Pessoa</a></p>
        </div>
      </div>
    </footer>
  );
}

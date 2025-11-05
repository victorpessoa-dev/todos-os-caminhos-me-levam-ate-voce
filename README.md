# todos-os-caminhos-me-levam-ate-voce

Aplicação Next.js (App Router) consumindo um backend Express/Prisma separado em `backend/`.

## Frontend (Next.js)

```bash
# entrar na raiz do projeto
cd /mnt/c/Users/victo/Documents/Pessoal/Jose.Pessoa/Projetos/todos-os-caminhos-me-levam-ate-voce

# instalar dependências
npm install

# configurar a URL da API (opcional; default http://localhost:3001/api)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# rodar em desenvolvimento
npm run dev
```

Rotas principais em `app/` (ex.: `/`, `/diary`, `/diary/[slug]`).

## Backend (API Express + Prisma)

Veja `backend/README.md` para instruções completas.

Passos rápidos:

```bash
cd backend
npm install
cp .env.example .env   # configure DATABASE_URL (MongoDB)
npm run prisma:generate
npm run prisma:seed
npm run dev
```

## Notas
- Projeto usa apenas Next.js na raiz; Vite/legacy removidos.
- Não comitar `.next/`.
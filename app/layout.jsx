import "./globals.css";

export const metadata = {
    title: "Todos os Caminhos me levam até Você",
    description: "Um diário sobre minha vida com Cristo.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
import './globals.css';

import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

export const metadata = {
    title: 'Todos os Caminhos me levam até Você',
    description: 'Um diário sobre minha vida com Cristo.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <Header />
                <main className="pt-20">{children}</main>
                <Footer />
            </body>
        </html>
    );
}

import "./globals.css";
import Providers from "../components/Providers";
import { buildMetadata, getSiteUrl, siteConfig } from "../lib/site";

export const metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    robots: {
        index: true,
        follow: true,
    },
    ...buildMetadata({
        title: siteConfig.name,
        description: siteConfig.description,
        path: "/",
    }),
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

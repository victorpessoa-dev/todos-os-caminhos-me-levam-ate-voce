const DEFAULT_SITE_URL = "http://localhost:3000";
const SITE_NAME = "Todos os Caminhos me levam até Você";
const DEFAULT_DESCRIPTION = "Um diário sobre minha vida com Cristo.";

export function getSiteUrl() {
    const raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        process.env.VERCEL_URL ||
        DEFAULT_SITE_URL;

    const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
    return withProtocol.replace(/\/+$/, "");
}

export function getAbsoluteUrl(path = "/") {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalizedPath, `${getSiteUrl()}/`).toString();
}

export function buildMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    path = "/",
    image,
    type = "website",
}) {
    const canonical = getAbsoluteUrl(path);
    const imageUrl = image || getAbsoluteUrl("/og-default.jpg");

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            type,
            url: canonical,
            title,
            description,
            siteName: SITE_NAME,
            locale: "pt_BR",
            images: [
                {
                    url: imageUrl,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export const siteConfig = {
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
};

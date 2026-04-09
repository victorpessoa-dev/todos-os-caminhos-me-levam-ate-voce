import { getSiteUrl } from "../lib/site";

export default function robots() {
    const siteUrl = getSiteUrl();

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/login"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}

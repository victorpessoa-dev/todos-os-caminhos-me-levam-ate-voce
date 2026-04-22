const ALLOWED_HTML_TAGS = new Set([
    "a",
    "blockquote",
    "br",
    "code",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "ul",
]);

const ALLOWED_ATTRIBUTES = {
    a: new Set(["href", "title", "target", "rel"]),
    img: new Set(["src", "alt", "title"]),
};

function getUrlBase() {
    return typeof window !== "undefined" ? window.location.origin : "https://example.com";
}

export function isSafeUrl(value, options = {}) {
    if (!value || typeof value !== "string") return false;

    const { allowRelative = true, allowMailto = false, allowTel = false } = options;
    const trimmed = value.trim();
    if (!trimmed) return false;

    if (allowRelative && (/^\/(?!\/)/.test(trimmed) || /^\.{1,2}\//.test(trimmed) || trimmed.startsWith("#"))) {
        return true;
    }

    try {
        const parsed = new URL(trimmed, getUrlBase());
        if (allowRelative && parsed.origin === new URL(getUrlBase()).origin && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
            return true;
        }

        if (parsed.protocol === "http:" || parsed.protocol === "https:") return true;
        if (allowMailto && parsed.protocol === "mailto:") return true;
        if (allowTel && parsed.protocol === "tel:") return true;
        return false;
    } catch {
        return false;
    }
}

export function sanitizeImageUrl(value) {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return isSafeUrl(trimmed, { allowRelative: true }) ? trimmed : "";
}

export function normalizeImageUrlInput(value, options = {}) {
    const { required = false } = options;
    const trimmed = typeof value === "string" ? value.trim() : "";

    if (!trimmed) {
        if (required) throw new Error("Informe uma URL de imagem válida.");
        return null;
    }

    const sanitized = sanitizeImageUrl(trimmed);
    if (!sanitized) {
        throw new Error("Informe uma URL de imagem válida.");
    }

    return sanitized;
}

export function normalizeSlugInput(value) {
    const normalized = String(value || "")
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return normalized;
}

function sanitizeHtmlFallback(input) {
    return String(input || "")
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/\son\w+="[^"]*"/gi, "")
        .replace(/\son\w+='[^']*'/gi, "")
        .replace(/\sjavascript:/gi, " ");
}

function sanitizeElement(node, documentRef) {
    if (node.nodeType === 3) {
        return documentRef.createTextNode(node.textContent || "");
    }

    if (node.nodeType !== 1) {
        return documentRef.createDocumentFragment();
    }

    const tagName = node.tagName.toLowerCase();
    const fragment = documentRef.createDocumentFragment();

    if (!ALLOWED_HTML_TAGS.has(tagName)) {
        Array.from(node.childNodes).forEach((child) => {
            fragment.appendChild(sanitizeElement(child, documentRef));
        });
        return fragment;
    }

    const element = documentRef.createElement(tagName);
    const allowedAttributes = ALLOWED_ATTRIBUTES[tagName] || new Set();

    Array.from(node.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.trim();

        if (!allowedAttributes.has(attrName)) return;

        if (tagName === "a" && attrName === "href") {
            if (!isSafeUrl(attrValue, { allowRelative: true, allowMailto: true, allowTel: true })) return;
        }

        if (tagName === "img" && attrName === "src") {
            if (!isSafeUrl(attrValue, { allowRelative: true })) return;
        }

        if (tagName === "a" && attrName === "target") {
            if (!["_blank", "_self"].includes(attrValue)) return;
        }

        element.setAttribute(attrName, attrValue);
    });

    if (tagName === "a") {
        const href = element.getAttribute("href");
        if (!href) return fragment;

        if (element.getAttribute("target") === "_blank") {
            element.setAttribute("rel", "noopener noreferrer");
        } else {
            element.removeAttribute("target");
            element.removeAttribute("rel");
        }
    }

    if (tagName === "img" && !element.getAttribute("src")) {
        return fragment;
    }

    Array.from(node.childNodes).forEach((child) => {
        element.appendChild(sanitizeElement(child, documentRef));
    });

    return element;
}

export function sanitizeHtml(input) {
    const html = String(input || "");
    if (!html.trim()) return "";

    if (typeof DOMParser === "undefined" || typeof document === "undefined") {
        return sanitizeHtmlFallback(html);
    }

    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, "text/html");
    const container = document.createElement("div");

    Array.from(parsed.body.childNodes).forEach((node) => {
        container.appendChild(sanitizeElement(node, document));
    });

    return container.innerHTML;
}

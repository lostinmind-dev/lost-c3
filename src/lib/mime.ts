const mimeTypes = {
    TS: {
        id: 'text/x.typescript',
        extensions: ['.ts']
    },
    HTML: {
        id: 'text/html',
        extensions: ['.html']
    },
    JS: {
        id: 'application/javascript',
        extensions: ['.js']
    },
    JSON: {
        id: 'application/json',
        extensions: ['.json', '.scon']
    },
    CSS: {
        id: 'text/css',
        extensions: ['.css']
    },
    WASM: {
        id: 'application/wasm',
        extensions: ['.wasm']
    },
    PNG: {
        id: 'image/png',
        extensions: ['.png']
    },
    JPEG: {
        id: 'image/jpeg',
        extensions: ['.jpg', 'jpeg']
    },
    WEBP: {
        id: 'image/webp',
        extensions: ['.webp']
    },
    AVIF: {
        id: 'image/avif',
        extensions: ['.avif']
    },
    WEBM: {
        id: 'video/webm',
        extensions: ['.webm']
    },
    AUDIO_MP4: {
        id: 'audio/mp4',
        extensions: ['.mp4']
    },
    MPEG: {
        id: 'audio/mpeg',
        extensions: ['.mp3']
    },
    OGG: {
        id: 'audio/ogg',
        extensions: ['.ogg']
    },
    VIDEO_MP4: {
        id: 'video/mp4',
        extensions: ['.mp4']
    },
    FONT_WOFF: {
        id: 'application/font-woff',
        extensions: ['.woff']
    },
    WOFF2: {
        id: 'font/woff2',
        extensions: ['.woff2']
    },
    TXT: {
        id: 'text/plain',
        extensions: ['.txt']
    },
    CSV: {
        id: 'text/csv',
        extensions: ['.csv']
    },
    XML: {
        id: 'text/xml',
        extensions: ['.xml', 'scml']
    },
    SVG: {
        id: 'image/svg+xml',
        extensions: ['.svg']
    },
    ZIP: {
        id: 'application/zip',
        extensions: ['.c3p']
    },
    GIF: {
        id: 'image/gif',
        extensions: ['.gif']
    }
} as const;

export type MimeType = keyof typeof mimeTypes;
export type MimeId = typeof mimeTypes[MimeType]['id'];
export type MimeExtension<T extends MimeType> = typeof mimeTypes[T]['extensions'][number];

export function getFileType(fileName: string) {
    let mime: MimeId | null = null;

    for (const _ of Object.entries(mimeTypes)) {
        const info = _[1];

        for (const extension of info.extensions) {
            if (!fileName.endsWith(extension)) continue;
            mime = info.id;
        }
    }

    return mime;
}
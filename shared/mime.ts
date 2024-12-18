export enum MimeType {
    TS = 'text/x.typescript',
    HTML = 'text/html',
    JS = 'application/javascript',
    JSON = 'application/json',
    CSS = 'text/css',
    WASM = 'application/wasm',
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    WEBP = 'image/webp',
    AVIF = 'image/avif',
    WEBM = 'video/webm',
    AUDIO_MP4 = 'audio/mp4',
    MPEG = 'audio/mpeg',
    OGG = 'audio/ogg',
    VIDEO_MP4 = 'video/mp4',
    FONT_WOFF = 'application/font-woff',
    WOFF2 = 'font/woff2',
    TXT = 'text/plain',
    CSV = 'text/csv',
    XML = 'text/xml',
    SVG = 'image/svg+xml',
    ZIP = 'application/zip',
    GIF = 'image/gif'
}

type MimeTypesCollection = Record<MimeType, string[]>

export abstract class Mime {
    static readonly #collection: MimeTypesCollection = {
        [MimeType.TS]: ['.ts'],
        [MimeType.HTML]: ['.html'],
        [MimeType.JS]: ['.js'],
        [MimeType.JSON]: ['.json', '.scon'],
        [MimeType.CSS]: ['.css'],
        [MimeType.WASM]: ['.wasm'],
        [MimeType.PNG]: ['.png'],
        [MimeType.JPEG]: ['.jpg', 'jpeg'],
        [MimeType.WEBP]: ['.webp'],
        [MimeType.AVIF]: ['.avif'],
        [MimeType.WEBM]: ['.webm'],
        [MimeType.AUDIO_MP4]: ['.m4a'],
        [MimeType.MPEG]: ['.mp3'],
        [MimeType.OGG]: ['.ogg'],
        [MimeType.VIDEO_MP4]: ['.mp4'],
        [MimeType.FONT_WOFF]: ['.woff'],
        [MimeType.WOFF2]: ['.woff2'],
        [MimeType.TXT]: ['.txt'],
        [MimeType.CSV]: ['.csv'],
        [MimeType.XML]: ['.xml', '.scml'],
        [MimeType.SVG]: ['.svg'],
        [MimeType.ZIP]: ['.c3p'],
        [MimeType.GIF]: ['.gif']
    }

    static getFileType(fileName: string): MimeType | null {
        let _mimeType: MimeType | null = null;
        for (const [mimeType, extensions] of Object.entries(this.#collection)) {
            extensions.forEach(ex => {
                if (
                    fileName.endsWith(ex) &&
                    !fileName.endsWith('.d.ts')
                ) {
                    _mimeType = mimeType as MimeType;
                }
            })
        }

        return _mimeType;
    }

    static getCollection(): MimeTypesCollection {
        return this.#collection;
    }
}

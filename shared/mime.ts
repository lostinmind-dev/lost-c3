import { MimeType } from './types/addon-file.ts'

type MimeFileCollection = Record<MimeType, string[]>

export abstract class MIME {
    static readonly #collection: MimeFileCollection = {
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
        [MimeType.ZIP]: ['.c3p']
    }

    static getFileType(fileName: string): MimeType | null {
        let _mimeType: MimeType | null = null;
        for (const [mimeType, extensions] of Object.entries(this.#collection)) {
            extensions.forEach(ex => {
                if (fileName.endsWith(ex)) {
                    _mimeType = mimeType as MimeType;
                }
            })
        }

        return _mimeType;
    }
}

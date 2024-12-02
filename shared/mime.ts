
type MimeFileCollection = Record<MIMEFileType, string[]>

export abstract class MIME {
    private static readonly Collection: MimeFileCollection = {
        'text/html': ['.html'],
        'application/javascript': ['.js'],
        'application/json': ['.json', '.scon'],
        'text/css': ['.css'],
        'application/wasm': ['.wasm'],
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', 'jpeg'],
        'image/webp': ['.webp'],
        'image/avif': ['.avif'],
        'video/webm': ['.webm'],
        'audio/mp4': ['.m4a'],
        'audio/mpeg': ['.mp3'],
        'audio/ogg': ['.ogg'],
        'video/mp4': ['.mp4'],
        'application/font-woff': ['.woff'],
        'font/woff2': ['.woff2'],
        'text/plain': ['.txt'],
        'text/csv': ['.csv'],
        'text/xml': ['.xml', '.scml'],
        'image/svg+xml': ['.svg'],
        'application/zip': ['.c3p']
    }

    static getFileType(fileName: string): MIMEFileType | null {
        let _mimeType: MIMEFileType | null = null;
        for (const [mimeType, extensions] of Object.entries(this.Collection)) {
            extensions.forEach(ex => {
                if (fileName.endsWith(ex)) {
                    _mimeType = mimeType as MIMEFileType;
                }
            })
        }

        return _mimeType;
    }
}

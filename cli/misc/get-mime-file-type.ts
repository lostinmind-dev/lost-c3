export type FileMIMEType = 
    | 'application/json'
    | 'application/javascript'
    | 'application/pdf'
    | 'application/xml'
    | 'application/zip'
    | 'application/x-www-form-urlencoded'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/vnd.ms-powerpoint'
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    | 'application/msword'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/webm'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/bmp'
    | 'image/webp'
    | 'image/svg+xml'
    | 'text/plain'
    | 'text/html'
    | 'text/css'
    | 'text/javascript'
    | 'text/csv'
    | 'text/xml'
    | 'video/mp4'
    | 'video/mpeg'
    | 'video/ogg'
    | 'video/webm'
    | 'video/quicktime'
    | 'application/wasm';

export function getMIMEFileType(filename: string): FileMIMEType | undefined {
    if (filename.endsWith('.json')) {
        return 'application/json';
    }
    if (filename.endsWith('.js')) {
        return 'application/javascript';
    }
    if (filename.endsWith('.pdf')) {
        return 'application/pdf';
    }
    if (filename.endsWith('.xml')) {
        return 'application/xml';
    }
    if (filename.endsWith('.zip')) {
        return 'application/zip';
    }
    if (filename.endsWith('.urlencoded')) {
        return 'application/x-www-form-urlencoded';
    }
    if (filename.endsWith('.xls')) {
        return 'application/vnd.ms-excel';
    }
    if (filename.endsWith('.xlsx')) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    if (filename.endsWith('.ppt')) {
        return 'application/vnd.ms-powerpoint';
    }
    if (filename.endsWith('.pptx')) {
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    }
    if (filename.endsWith('.doc')) {
        return 'application/msword';
    }
    if (filename.endsWith('.docx')) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    if (filename.endsWith('.mp3')) {
        return 'audio/mpeg';
    }
    if (filename.endsWith('.wav')) {
        return 'audio/wav';
    }
    if (filename.endsWith('.ogg')) {
        return 'audio/ogg';
    }
    if (filename.endsWith('.webm')) {
        return 'audio/webm';
    }
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
        return 'image/jpeg';
    }
    if (filename.endsWith('.png')) {
        return 'image/png';
    }
    if (filename.endsWith('.gif')) {
        return 'image/gif';
    }
    if (filename.endsWith('.bmp')) {
        return 'image/bmp';
    }
    if (filename.endsWith('.webp')) {
        return 'image/webp';
    }
    if (filename.endsWith('.svg')) {
        return 'image/svg+xml';
    }
    if (filename.endsWith('.txt')) {
        return 'text/plain';
    }
    if (filename.endsWith('.html') || filename.endsWith('.htm')) {
        return 'text/html';
    }
    if (filename.endsWith('.css')) {
        return 'text/css';
    }
    if (filename.endsWith('.mjs')) {
        return 'text/javascript';
    }
    if (filename.endsWith('.csv')) {
        return 'text/csv';
    }
    if (filename.endsWith('.xml')) {
        return 'text/xml';
    }
    if (filename.endsWith('.mp4')) {
        return 'video/mp4';
    }
    if (filename.endsWith('.mpeg')) {
        return 'video/mpeg';
    }
    if (filename.endsWith('.ogv')) {
        return 'video/ogg';
    }
    if (filename.endsWith('.webm')) {
        return 'video/webm';
    }
    if (filename.endsWith('.mov')) {
        return 'video/quicktime';
    }
    if (filename.endsWith('.wasm')) {
        return 'application/wasm';
    }
    // Если расширение не найдено, возвращаем undefined
    return undefined;
}

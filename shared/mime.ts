type MimeFile = {
    readonly type: MIMEFileType,
    readonly extensions: string[]
}

export abstract class MIME {
    private static readonly Collection: MimeFile[] = [
        /**
         * @Application
         */
        {type: 'application/wasm', extensions: ['.wasm']},
        {type: 'application/javascript', extensions: ['.js']},
        {type: 'application/json', extensions: ['.json']},
        {type: 'application/pdf', extensions: ['.pdf']},
        {type: 'application/xml', extensions: ['.xml']},
        {type: 'application/zip', extensions: ['.zip']},
        {type: 'application/x-www-form-urlencoded', extensions: ['.urlencoded']},
        {type: 'application/vnd.ms-excel', extensions: ['.xls']},
        {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extensions: ['.xlsx']},
        {type: 'application/vnd.ms-powerpoint', extensions: ['.ppt']},
        {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extensions: ['.pptx']},
        {type: 'application/msword', extensions: ['.doc']},
        {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extensions: ['.docx']},
        /**
         * @Audio
         */
        {type: 'audio/mpeg', extensions: ['.mp3']},
        {type: 'audio/wav', extensions: ['.wav']},
        {type: 'audio/ogg', extensions: ['.ogg']},
        {type: 'audio/webm', extensions: ['.webm']},
        /**
         * @Image
         */
        {type: 'image/jpeg', extensions: ['.jpg', '.jpeg']},
        {type: 'image/png', extensions: ['.png']},
        {type: 'image/gif', extensions: ['.gif']},
        {type: 'image/bmp', extensions: ['.bmp']},
        {type: 'image/webp', extensions: ['.webp']},
        {type: 'image/svg+xml', extensions: ['.svg']},
        /**
         * @Text
         */
        {type: 'text/plain', extensions: ['.txt']},
        {type: 'text/html', extensions: ['.html', '.htm']},
        {type: 'text/css', extensions: ['.css']},
        {type: 'text/javascript', extensions: ['.mjs']},
        {type: 'text/csv', extensions: ['.csv']},
        {type: 'text/xml', extensions: ['.xml']},
        /**
         * @Video
         */
        {type: 'video/mp4', extensions: ['.mp4']},
        {type: 'video/mpeg', extensions: ['.mpeg']},
        {type: 'video/ogg', extensions: ['.ogv']},
        {type: 'video/webm', extensions: ['.webm']},
        {type: 'video/quicktime', extensions: ['.mov']},
    ]

    static getFileType(fileName: string): MIMEFileType {
        let mimeType: MIMEFileType = 'unknown';

        MIME.Collection.forEach(mime => {
            mime.extensions.forEach(ex => {
                if (fileName.endsWith(ex)) {
                    mimeType = mime.type;
                }
            })
        })
        return mimeType;
    }
}

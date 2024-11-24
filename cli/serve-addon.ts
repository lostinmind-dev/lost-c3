import { Logger, Colors, join } from "../deps.ts";
import { Paths } from "../shared/paths.ts";

export default async function serveAddon(port: number) {
    Logger.Line();
    Logger.Log('🌐', 'Starting addon server...');

    const getContentType = (filePath: string): string | undefined => {
        const extension = filePath.split('.').pop();
        const contentTypes: { [key: string]: string } = {
            "js": "application/javascript",
            "css": "text/css",
            "json": "application/json",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "svg": "image/svg+xml",
            "txt": "text/plain",
        };
        return contentTypes[extension || ""];
    }

    const handler = async (req: Request): Promise<Response> => {
        try {
            const url = new URL(req.url);
            // let filePath = url.pathname;
            let filePath = join(Paths.Build, url.pathname);

            try {
                const fileInfo = await Deno.stat(filePath);
                if (fileInfo.isDirectory) {
                    filePath = `${filePath}/index.html`;
                }
            } catch {
                return new Response("File not found", { status: 404 });
            }

            const file = await Deno.readFile(filePath);
            const contentType = getContentType(filePath) || 'application/octet-stream';

            return new Response(file, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": '*',
                },
            });
        } catch (err) {
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    Deno.serve({
        port,
        onListen() {
            Logger.Log(
                '✅',
                `${Colors.bold('Server running!')} ${Colors.magenta(Colors.bold(`--> http://localhost:${port}/addon.json <--`))}`
            )
        }
    }, handler)
}
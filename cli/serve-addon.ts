import { Colors } from "../deps.ts";
import { LOGGER } from "./misc.ts";
import { BUILD_PATH } from "./paths.ts";

export async function serveAddon(port: number) {
    LOGGER.Line();
    LOGGER.Process('Starting addon server');

    const getContentType = (filePath: string): string | undefined => {
        const extension = filePath.split(".").pop();
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
            let filePath = `${BUILD_PATH}${url.pathname}`;
    
            try {
                const fileInfo = await Deno.stat(filePath);
                if (fileInfo.isDirectory) {
                    filePath = `${filePath}/index.html`;
                }
            } catch {
                return new Response("File not found", { status: 404 });
            }
    
            const file = await Deno.readFile(filePath);
            const contentType = getContentType(filePath) || "application/octet-stream";
    
            return new Response(file, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (err) {
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    Deno.serve({
        port,
        onListen() {
            console.log(`${Colors.bold('Addon server started!')} ${Colors.magenta(Colors.bold(`--> http://localhost:${port}/addon.json <--`))}`)
        }
    }, handler)
}
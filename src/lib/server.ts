import { PATHS } from './main.ts';
import { 
    colors, 
    path 
} from "./deps.ts";
import { getFileType } from "./mime.ts";
import { Logger } from "./logger.ts";

export type ServeOptions = {
    /** 
     * Server port
     * @example 65432
     */
    readonly port?: number;
    readonly onStart?: () => void;
}

const DEFAULT_PORT = 65432;

const logger = new Logger();

export function serve(opts?: ServeOptions) {
    const port = opts?.port || DEFAULT_PORT;

    const handler = async (req: Request) => {
        try {
            const url = new URL(req.url);

            const filePath = path.join(PATHS.BUILD, url.pathname);
            const file = await Deno.readFile(filePath);
            const mimeType = getFileType(filePath) || 'application/octet-stream';

            logger.log(
                `📃 Sent file from path: "${colors.yellow(url.pathname)}"`
            )
            logger.info(`${colors.magenta(colors.bold(`--> http://localhost:${port}/addon.json <--`))}`);

            return new Response(file, {
                status: 200,
                headers: {
                    "Content-Type": mimeType,
                    "Access-Control-Allow-Origin": '*',
                }
            })
        } catch (e) {
            return new Response('Internal server error', { status: 500 })
        }
    }

    Deno.serve({
        port,
        onListen: () => {
            logger.clear();
            //${Colors.magenta(Colors.bold(`--> http://localhost:${opts.port}/addon.json <--`))}
            logger.log(
                '🌐', `${colors.bold('Development server started!')}`
            )
            logger.info(`${colors.magenta(colors.bold(`--> http://localhost:${port}/addon.json <--`))}`)
                /** */ logger.line();
            logger.log(colors.italic(`1. Click on "Menu" > "View" > "Addon manager"`));
            logger.log(colors.italic(`2. Click on "Add dev addon". `));
                /** */ logger.line();
            logger.info(`How to enable Developer Mode:\nhttps://www.construct.net/br/make-games/manuals/addon-sdk/guide/using-developer-mode`);

            opts?.onStart?.()
        }
    }, handler);
}
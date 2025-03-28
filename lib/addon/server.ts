import { buildPath } from './builder.ts';
import { colors, join } from "../deps.ts";
import { getFileType } from "../utils/mime.ts";
import { Logger } from "../utils/logger.ts";

export function serve(opts?: ServeOptions) {
    Server.start(opts);
}
type ServeOptions = {
    /** 
     * Server port
     * @example 65432
     */
    readonly port?: number;
    readonly onStart?: () => void;
}

const DEFAULT_PORT = 65432;

abstract class Server {
    private static opts: ServeOptions;

    static start(opts?: ServeOptions) {
        this.opts = opts || {
            port: DEFAULT_PORT
        };

        const handler = async (req: Request) => {
            try {
                const url = new URL(req.url);

                const filePath = join(Deno.cwd(), ...buildPath, url.pathname);
                const file = await Deno.readFile(filePath);
                const mimeType = getFileType(filePath) || 'application/octet-stream';
                
                Logger.log(
                    `📃 Sent file from path: "${colors.yellow(url.pathname)}"`
                )
                Logger.info(`${colors.magenta(colors.bold(`--> http://localhost:${this.opts.port}/addon.json <--`))}`);

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
            port: this.opts.port,
            onListen: () => { 
                Logger.clear();
                //${Colors.magenta(Colors.bold(`--> http://localhost:${opts.port}/addon.json <--`))}
                Logger.log(
                    '🌐', `${colors.bold('Development server started!')}`
                )
                Logger.info(`${colors.magenta(colors.bold(`--> http://localhost:${this.opts.port}/addon.json <--`))}`)
                /** */ Logger.line();
                Logger.log(colors.italic(`1. Click on "Menu" > "View" > "Addon manager"`));
                Logger.log(colors.italic(`2. Click on "Add dev addon". `));
                /** */ Logger.line();
                Logger.info(`How to enable Developer Mode:\nhttps://www.construct.net/br/make-games/manuals/addon-sdk/guide/using-developer-mode`);

                this.opts?.onStart?.() 
            }
        }, handler);
    }
}
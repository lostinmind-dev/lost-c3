// deno-lint-ignore-file no-explicit-any
import { Colors } from "../deps.ts";

export abstract class Logger {
    static readonly #DefaultLineLength = 20;
    
    static Line(length?: number) {
        const line = this.GetLineString(length);
        console.log(line);
    };

    static GetLineString(length?: number) {
        const enteredLenght = (length) ? length : this.#DefaultLineLength;
        let line = '';
        for (let i = 0; i < enteredLenght; i++) {
            line += '----'
        }
        return line;
    }

    static Clear() {
        console.clear();
    };

    /**
     * ⏱️
     */
    static Timer(...data: any[]) {
        console.log('⏱️', ...data);
    }

    static Log(...data: any[]) {
        console.log(...data);
    };

    static LogBetweenLines(...data: any[]) {
        this.Line();
        console.log(...data);
        this.Line();
    }

    /**
     * ⏳
     */
    static Process(...data: any[]) {
        data.forEach(entry => {
            console.log('⏳', (typeof entry === 'string') ? Colors.bold(Colors.yellow((Colors.italic(entry)))) : entry, '...');
        })
    };

    /**
     * 🔃
     */
    static Loading(...data: any[]) {
        data.forEach(entry => {
            console.log('🔃', entry, '...');
        })
    }

    /**
     * 🔎
     */
    static Searching(...data: any[]) {
        data.forEach(entry => {
            console.log('🔎', (typeof entry === 'string') ? Colors.bold(Colors.blue(Colors.italic(entry))) : entry, '...');
        })
    };

    static Error(type: 'serve' |'build' | 'cli' | 'bundle', errorMessage: string, ...data: any[]) {
        this.Line();
        console.log('⛔', Colors.bold(Colors.red(`Lost [${type}] error.`)));
        this.Info(Colors.italic(errorMessage));
        data.forEach(entry => {
            this.Info(entry)
        })
        this.Line();
    };

    /**
     * 📃
     */
    static Info(...data: any[]) {
        data.forEach(entry => {
            console.log('📃', (typeof entry === 'object') ? entry : Colors.italic(entry));
        })
    };

    /**
     * ⚠️
     */
    static Warning(...data: any[]) {
        this.Line();
        data.forEach(entry => {
            console.log('⚠️ ', Colors.bold(Colors.yellow('Warning:')), (typeof entry === 'string') ? Colors.italic(entry) : entry);
        })
        this.Line();
    };

    /**
     * ✅
     */
    static Success(...data: any[]) {
        data.forEach(entry => {
            console.log('✅', entry, '!');
        })
    }
}
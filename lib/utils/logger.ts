// deno-lint-ignore-file no-explicit-any
import { colors } from "../deps.ts";

export abstract class Logger {
    static readonly #DefaultLineLength = 20;

    static line(length?: number) {
        const line = this.getLineString(length);
        console.log(line);
    };

    static getLineString(length?: number) {
        const enteredLenght = (length) ? length : this.#DefaultLineLength;
        let line = '';
        for (let i = 0; i < enteredLenght; i++) {
            line += '----'
        }
        return line;
    }

    static clear() {
        console.clear();
    };

    /**
     * ⏱️
     */
    static timer(...data: any[]) {
        console.log('⏱️', ...data);
    }

    static log(...data: any[]) {
        console.log(...data);
    };

    static logBetweenLines(...data: any[]) {
        this.line();
        console.log(...data);
        this.line();
    }

    /**
     * ⏳
     */
    static process(...data: any[]) {
        data.forEach(entry => {
            console.log('⏳', (typeof entry === 'string') ? colors.bold(colors.yellow((colors.italic(entry)))) : entry, '...');
        })
    };

    /**
     * 🔃
     */
    static load(...data: any[]) {
        data.forEach(entry => {
            console.log('🔃', entry, '...');
        })
    }

    /**
     * 🔎
     */
    static search(...data: any[]) {
        data.forEach(entry => {
            console.log('🔎', (typeof entry === 'string') ? colors.bold(colors.blue(colors.italic(entry))) : entry, '...');
        })
    };

    static error(type: 'serve' | 'build' | 'cli' | 'bundle', errorMessage: string, ...data: any[]) {
        this.line();
        console.log('⛔', colors.bold(colors.red(`Lost [${type}] error.`)));
        this.info(colors.italic(errorMessage));
        data.forEach(entry => {
            this.info(entry)
        })
        this.line();
    };

    /**
     * 📃
     */
    static info(...data: any[]) {
        data.forEach(entry => {
            console.log('📃', (typeof entry === 'object') ? entry : colors.italic(entry));
        })
    };

    /**
     * ⚠️
     */
    static warn(...data: any[]) {
        this.line();
        data.forEach(entry => {
            console.log('⚠️ ', colors.bold(colors.yellow('Warning:')), (typeof entry === 'string') ? colors.italic(entry) : entry);
        })
        this.line();
    };

    /**
     * ✅
     */
    static success(...data: any[]) {
        data.forEach(entry => {
            console.log('✅', entry, '!');
        })
    }
}
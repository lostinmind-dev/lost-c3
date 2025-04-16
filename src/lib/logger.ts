// deno-lint-ignore-file no-explicit-any
import { colors } from "./deps.ts";

const defaultLineLength = 20;

export class Logger {
    line(length?: number) {
        const line = this.getLineString(length);
        console.log(line);
    };

    getLineString(length?: number) {
        const enteredLenght = (length) ? length : defaultLineLength;
        let line = '';
        for (let i = 0; i < enteredLenght; i++) {
            line += '----'
        }
        return line;
    }

    clear() {
        console.clear();
    };

    /**
     * ⏱️
     */
    timer(...data: any[]) {
        console.log('⏱️', ...data);
    }

    log(...data: any[]) {
        console.log(...data);
    };

    logBetweenLines(...data: any[]) {
        this.line();
        console.log(...data);
        this.line();
    }

    /**
     * ⏳
     */
    process(...data: any[]) {
        data.forEach(entry => {
            console.log('⏳', (typeof entry === 'string') ? colors.bold(colors.yellow((colors.italic(entry)))) : entry, '...');
        })
    };

    /**
     * 🔃
     */
    load(...data: any[]) {
        data.forEach(entry => {
            console.log('🔃', entry, '...');
        })
    }

    /**
     * 🔎
     */
    search(...data: any[]) {
        data.forEach(entry => {
            console.log('🔎', (typeof entry === 'string') ? colors.bold(colors.blue(colors.italic(entry))) : entry, '...');
        })
    };

    error(type: 'serve' | 'build' | 'cli' | 'bundle', errorMessage: string, ...data: any[]) {
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
    info(...data: any[]) {
        data.forEach(entry => {
            console.log('📃', (typeof entry === 'object') ? entry : colors.italic(entry));
        })
    };

    /**
     * ⚠️
     */
    warn(...data: any[]) {
        this.line();
        data.forEach(entry => {
            console.log('⚠️ ', colors.bold(colors.yellow('Warning:')), (typeof entry === 'string') ? colors.italic(entry) : entry);
        })
        this.line();
    };

    /**
     * ✅
     */
    success(...data: any[]) {
        data.forEach(entry => {
            console.log('✅', entry, '!');
        })
    }
}
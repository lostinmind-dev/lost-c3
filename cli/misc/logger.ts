// deno-lint-ignore-file no-explicit-any
import { Colors } from "../../deps.ts";

class Logger {
    private readonly DEFAULT_LINE_LENGTH = 20;
    
    Line(length?: number) {
        const line = this.GetLineString(length);
        console.log(line);
    };

    GetLineString(length?: number) {
        const enteredLenght = (length) ? length : this.DEFAULT_LINE_LENGTH;
        let line = '';
        for (let i = 0; i < enteredLenght; i++) {
            line += '----'
        }
        return line;
    }

    Clear() {
        console.clear();
    };

    Log(...data: any[]) {
        console.log(...data);
    };

    LogBetweenLines(...data: any[]) {
        this.Line();
        console.log(...data);
        this.Line();
    }

    /**
     * ⏳
     */
    Process(...data: any[]) {
        data.forEach(entry => {
            console.log('⏳', (typeof entry === 'string') ? Colors.bold(Colors.yellow((Colors.italic(entry)))) : entry, '...');
        })
    };

    /**
     * 🔃
     */
    Loading(...data: any[]) {
        data.forEach(entry => {
            console.log('🔃', entry, '...');
        })
    }

    /**
     * 🔎
     */
    Searching(...data: any[]) {
        data.forEach(entry => {
            console.log('🔎', (typeof entry === 'string') ? Colors.bold(Colors.blue(Colors.italic(entry))) : entry, '...');
        })
    };

    Error(step: 'build' | 'serve', errorMessage: string, ...data: any[]) {
        this.Line();
        switch (step) {
            case 'build':
                console.log('⛔', Colors.bold(Colors.red('Addon build error.')));
                this.Info(Colors.italic(errorMessage));
                data.forEach(entry => {
                    this.Info(entry)
                })
                break;
            case 'serve':
                break;
        }
        this.Line();
    };

    /**
     * 📃
     */
    Info(...data: any[]) {
        data.forEach(entry => {
            console.log('📃', (typeof entry === 'object') ? entry : Colors.italic(entry));
        })
    };

    /**
     * ⚠️
     */
    Warning(...data: any[]) {
        this.Line();
        data.forEach(entry => {
            console.log('⚠️ ', Colors.bold(Colors.yellow('Warning:')), (typeof entry === 'string') ? Colors.italic(entry) : entry);
        })
        this.Line();
    };

    /**
     * ✅
     */
    Success(...data: any[]) {
        data.forEach(entry => {
            console.log('✅', (typeof entry === 'string') ? Colors.bold(entry) : entry, '!');
        })
    }
}

export const LOGGER = new Logger();
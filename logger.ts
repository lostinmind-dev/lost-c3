// deno-lint-ignore-file no-explicit-any
import { blue, bold, italic, red, yellow } from "./deps.ts";

export enum ErrorMessage {
    ICON_NOT_FOUNDED_OR_INCORRECT_FORMAT = `Addon icon file was not founded. Icon must be on the path: Addon/{file_name}.{png/svg}!`,
    CATEGORY_ID_EMPTY = `'Id' field in the category must not be empty!`,
    CATEGORY_NAME_EMPTY = `'Name' field in the category must not be empty!`,
    CATEGORY_ID_DUPLICATED = `Categories with the same 'Id' was detected`,

    ACTIONS_ID_DUPLICATED = `Actions with the same 'Id' was detected!`,
    CONDITIONS_ID_DUPLICATED = `Conditions with the same 'Id' was detected!`,
    EXPRESSIONS_ID_DUPLICATED = `Expressions with the same 'Id' was detected!`,

    ACTION_ID_EMPTY = `Action 'Id' field must not be empty!`,
    CONDITION_ID_EMPTY = `Action 'Id' field must not be empty!`,
    EXPRESSION__ID_EMPTY = `Expression 'Id' field must not be empty!`
}

export enum WarningMessage {
    CATEGORY_DEPRECATED = `Сategory has Deprecated mode enabled. All Actions/Conditions/Expressions will not be available but added to the addon!`,
    CATEGORY_IN_DEVELOPMENT = `Сategory has InDevelopment mode enabled. All Actions/Conditions/Expressions was not added to the addon!`
}

export class Logger {
    private readonly DEFAULT_LINE_LENGTH = 20;
    
    // private Space() {
    //     console.log('\n')
    // };

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
            console.log('⏳', (typeof entry === 'string') ? bold(yellow((italic(entry)))) : entry, '...');
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
            console.log('🔎', (typeof entry === 'string') ? bold(blue(italic(entry))) : entry, '...');
        })
    };

    Error(step: 'build' | 'serve', errorMessage: string, ...data: any[]) {
        this.Line();
        switch (step) {
            case 'build':
                console.log('⛔', bold(red('Addon build error.')));
                this.Info(italic(errorMessage));
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
            console.log('📃', (typeof entry === 'object') ? entry : italic(entry));
        })
    };

    /**
     * ⚠️
     */
    Warning(...data: any[]) {
        this.Line();
        data.forEach(entry => {
            console.log('⚠️ ', bold(yellow('Warning:')), (typeof entry === 'string') ? italic(entry) : entry);
        })
        this.Line();
    };

    /**
     * ✅
     */
    Success(...data: any[]) {
        data.forEach(entry => {
            console.log('✅', (typeof entry === 'string') ? bold(entry) : entry, '!');
        })
    }
}
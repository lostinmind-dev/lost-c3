type DebuggerPropertyValue = string | number | boolean;

interface IDebuggerProperty {
    readonly name: string;
    readonly value: DebuggerPropertyValue;
}

// export class Debugger<T extends ISDKInstanceBase_> {
//     readonly _title: string;
//     readonly _properties: IDebuggerProperty[] = [];
//     constructor(title: string) {
//         this._title = title;
//     }

//     addProperty<I extends DebuggerPropertyValue>(name: string, value: I, onEdit: (this: T, newValue: I) => void) {

//     }
// }

export function Debugger(title: string) {
    return function (target: any) {
        target.prototype
    }
}

export function DebuggerProperty<I>(): any {
    return function (
        value: (this: any, ...args: any[]) => void,
        context: ClassMethodDecoratorContext<I, (this: any, ...args: any[]) => void>
    ) {
        context.addInitializer(function (this: any) {

            // Инициализация массива действий
            if (!this.constructor.prototype._actions) {
                this.constructor.prototype._actions = [];
            }

            // Добавление нового действия
            this.constructor.prototype._actions.push(
                //new ActionEntity(id, name, displayText, description, value, options)
            );
        });
    };
}
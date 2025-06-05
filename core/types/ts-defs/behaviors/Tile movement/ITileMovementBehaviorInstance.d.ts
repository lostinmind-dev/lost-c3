
type SimulateControlTypeTile = "left" | "right" | "up" | "down";

/** Represents the Tile Movement behavior.
 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/tile-movement | ITileMovementBehaviorInstance documentation } */
declare class ITileMovementBehaviorInstance<InstType> extends IBehaviorInstance<InstType>
{
	isIgnoringInput: boolean;
	isEnabled: boolean;
	isDefaultControls: boolean;
	simulateControl(dir: SimulateControlTypeTile): void;

	setSpeed(x: number, y: number): void;
	getSpeed(): number[];
	setGridPosition(x: number, y: number, immediate?: boolean): void;
	getGridPosition(): number[];
	modifyGridDimensions(width: number, height: number, x: number, y: number): void;
	isMoving(): boolean;
	isMovingDirection(dir: SimulateControlTypeTile): boolean;
	canMoveTo(x: number, y: number): boolean;
	canMoveDirection(dir: SimulateControlTypeTile, distance: number): boolean;
	getTargetPosition(): number[];
	getGridTargetPosition(): number[];
	toGridSpace(x: number, y: number): number[];
	fromGridSpace(x: number, y: number): number[];
}

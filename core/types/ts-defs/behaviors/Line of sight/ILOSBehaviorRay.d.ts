
/** Represents the result of casting a ray with the Line-of-sight behavior.
 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/line-of-sight | ILOSBehaviorInstance documentation } */
declare class ILOSBehaviorRay
{
	readonly didCollide: boolean;
	readonly hitX: number;
	readonly hitY: number;
	getHitPosition(): number[];
	readonly hitDistance: number;
	readonly hitUid: number;
	getNormalX(length: number): number;
	getNormalY(length: number): number;
	getNormal(length: number): number[];
	readonly normalAngle: number;
	getReflectionX(length: number): number;
	getReflectionY(length: number): number;
	getReflection(length: number): number[];
	readonly reflectionAngle: number;
}

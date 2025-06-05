
/** Represents the Tiled Background object.
 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/tiled-background | ITiledBackgroundInstance documentation } */
declare class ITiledBackgroundInstance extends IWorldInstance
{
	imageOffsetX: number;
	imageOffsetY: number;
	setImageOffset(x: number, y: number): void;
	getImageOffset(): number[];

	imageScaleX: number;
	imageScaleY: number;
	setImageScale(x: number, y: number): void;
	getImageScale(): number[];

	imageAngle: number;
	imageAngleDegrees: number;

	readonly imageWidth: number;
	readonly imageHeight: number;
	getImageSize(): number[];

	enableTileRandomization: number;
	tileXRandom: number;
	tileYRandom: number;
	setTileRandom(x: number, y: number): void;
	getTileRandom(): number[];
	tileAngleRandom: number;
	tileBlendMarginX: number;
	tileBlendMarginY: number;
	setTileBlendMargin(x: number, y: number): void;
	getTileBlendMargin(): number[];

	replaceImage(blob: Blob): Promise<void>;
}

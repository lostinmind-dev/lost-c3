export { }
declare global {

	/** I8DirectionBehaviorInstance.d.ts */
	type SimulateControlType8Direction = "left" | "right" | "up" | "down";

	/** Represents the 8 Direction behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/direction | I8DirectionBehaviorInstance documentation } */
	class I8DirectionBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		stop(): void;
		reverse(): void;
		simulateControl(ctrl: SimulateControlType8Direction): void;
		speed: number;
		maxSpeed: number;
		acceleration: number;
		deceleration: number;
		vectorX: number;
		vectorY: number;
		setVector(x: number, y: number): void;
		getVector(): number[];
		isDefaultControls: boolean;
		isIgnoringInput: boolean;
		isAllowSliding: boolean;
		isEnabled: boolean;
	}

	/** IAnchorBehaviorInstance.d.ts */
	/** Represents the Anchor behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/anchor | IAnchorBehaviorInstance documentation } */
	class IAnchorBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		isEnabled: boolean;
	}

	/** IBulletBehaviorInstance.d.ts */
	/** Represents the Bullet behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/bullet | IBulletBehaviorInstance documentation } */
	class IBulletBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		speed: number;
		acceleration: number;
		gravity: number;
		angleOfMotion: number;
		bounceOffSolids: boolean;
		distanceTravelled: number;
		isEnabled: boolean;
	}

	/** ICarBehaviorInstance.d.ts */
	type SimulateControlTypeCar = "left" | "right" | "up" | "down";

	/** Represents the Car behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/car | ICarBehaviorInstance documentation } */
	class ICarBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		stop(): void;
		simulateControl(ctrl: SimulateControlTypeCar): void;
		speed: number;
		maxSpeed: number;
		acceleration: number;
		deceleration: number;
		readonly vectorX: number;
		readonly vectorY: number;
		getVector(): number[];
		readonly angleOfMotion: number;
		steerSpeed: number;
		driftRecover: number;
		friction: number;
		turnWhileStopped: boolean;
		isDefaultControls: boolean;
		isIgnoringInput: boolean;
		isEnabled: boolean;
	}

	/** IDragDropBehaviorInstance.d.ts */
	type DragDropBehaviorAxes = "both" | "horizontal" | "vertical";

	interface DragDropBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"dragstart": BehaviorInstanceEvent<InstType, BehInstType>;
		"drop": BehaviorInstanceEvent<InstType, BehInstType>;
	}

	/** Represents the Car behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/drag-drop | IDragDropBehaviorInstance documentation } */
	class IDragDropBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof DragDropBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: DragDropBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof DragDropBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: DragDropBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		axes: DragDropBehaviorAxes;
		drop(): void;
		readonly isDragging: boolean;
		isEnabled: boolean;
	}

	/** IFadeBehaviorInstance.d.ts */
	interface FadeBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"fadeinend": BehaviorInstanceEvent<InstType, BehInstType>;
		"waitend": BehaviorInstanceEvent<InstType, BehInstType>;
		"fadeoutend": BehaviorInstanceEvent<InstType, BehInstType>;
	}

	/** Represents the Fade behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/fade | IFadeBehaviorInstance documentation } */
	class IFadeBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof FadeBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: FadeBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof FadeBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: FadeBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		startFade(): void;
		restartFade(): void;
		fadeInTime: number;
		waitTime: number;
		fadeOutTime: number;
	}

	/** IFlashBehaviorInstance.d.ts */
	interface FlashBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"flashend": BehaviorInstanceEvent<InstType, BehInstType>;
	}

	/** Represents the Flash behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/flash | IFlashBehaviorInstance documentation } */
	class IFlashBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof FlashBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: FlashBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof FlashBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: FlashBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		flash(on: number, off: number, dur: number): void;
		stop(): void;
		readonly isFlashing: boolean;
	}

	/** IFollowBehaviorInstance.d.ts */
	type FollowBehaviorMode = "time" | "distance";
	type FollowBehaviorInterpolationType = "step" | "linear" | "angular";
	type FollowBehaviorPropertyType = "x" | "y" | "z-elevation" | "width" | "height" | "angle" | "opacity" | "visibility" | "destroyed";

	/** Represents the Follow behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/follow | IFollowBehaviorInstance documentation } */
	class IFollowBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		followInstance: IInstance;
		mode: FollowBehaviorMode;
		delay: number;
		maxDelay: number;
		historyRate: number;
		clearHistory(): void;
		rewindHistory(time: number): void;
		setFollowingProperty(prop: FollowBehaviorPropertyType, isEnabled: boolean): void;
		isFollowingProperty(prop: FollowBehaviorPropertyType): boolean;
		setPropertyInterpolation(prop: FollowBehaviorPropertyType, interp: FollowBehaviorInterpolationType): void;
		getPropertyInterpolation(prop: FollowBehaviorPropertyType): FollowBehaviorInterpolationType;

		startFollowingCustomProperty(customProp: string, interp: FollowBehaviorInterpolationType): void;
		stopFollowingCustomProperty(customProp: string): void;
		isFollowingCustomProperty(customProp: string): boolean;
		setCustomPropertyValue(customProp: string, value: number | string): void;
		getDelayedCustomPropertyValue(customProp: string): number | string;

		saveHistoryToJSON(maxDelay?: number): JSONValue;
		loadHistoryFromJSON(json: JSONValue): void;

		isEnabled: boolean;
	}

	/** IJumpthruBehaviorInstance.d.ts */
	/** Represents the Jump-thru behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/jump-thru | IJumpthruBehaviorInstance documentation } */
	class IJumpthruBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		isEnabled: boolean;
	}

	/** ILOSBehaviorInstance.d.ts */
	/** Represents the Line-of-sight behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/line-of-sight | ILOSBehaviorInstance documentation } */
	class ILOSBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		ray: ILOSBehaviorRay;

		range: number;
		coneOfView: number;
		hasLOStoPosition(x: number, y: number): boolean;
		hasLOSBetweenPositions(fromX: number, fromY: number, fromAngle: number, toX: number, toY: number): boolean;
		castRay(fromX: number, fromY: number, toX: number, toY: number, useCollisionCells?: boolean): ILOSBehaviorRay;

		addObstacle<InstType2 extends IInstance>(objectClass: IObjectClass<InstType2>): void;
		clearObstacles(): void;
	}

	/** ILOSBehaviorRay.d.ts */
	/** Represents the result of casting a ray with the Line-of-sight behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/line-of-sight | ILOSBehaviorInstance documentation } */
	class ILOSBehaviorRay {
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

	/** IMoveToBehaviorInstance.d.ts */
	interface MoveToBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"arrived": BehaviorInstanceEvent<InstType, BehInstType>;
		"hitsolid": BehaviorInstanceEvent<InstType, BehInstType>;
	}

	/** Represents the Move To behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/move | IMoveToBehaviorInstance documentation } */
	class IMoveToBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof MoveToBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: MoveToBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof MoveToBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: MoveToBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		moveToPosition(x: number, y: number, isDirect?: boolean): void;
		getTargetX(): number;
		getTargetY(): number;
		getTargetPosition(): number[];
		getWaypointCount(): number;
		getWaypointX(index: number): number;
		getWaypointY(index: number): number;
		getWaypoint(index: number): number;
		stop(): void;
		readonly isMoving: boolean;
		speed: number;
		maxSpeed: number;
		acceleration: number;
		deceleration: number;
		angleOfMotion: number;
		rotateSpeed: number;
		isStopOnSolids: boolean;
		isEnabled: boolean;
	}

	/** IOrbitBehaviorInstance.d.ts */
	/** Represents the Orbit behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/orbit | IOrbitBehaviorInstance documentation } */
	class IOrbitBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		setTargetPosition(x: number, y: number): void;
		getTargetPosition(): number[];
		pin(inst: IWorldInstance): void;
		speed: number;
		acceleration: number;
		rotation: number;
		offsetAngle: number;
		primaryRadius: number;
		secondaryRadius: number;
		isMatchRotation: boolean;
		totalRotation: number;
		totalAbsoluteRotation: number;
		getDistanceToTarget(): number;
		isEnabled: boolean;
	}

	/** IPathfindingBehaviorInstance.d.ts */
	type PathfindingDirectMovementMode = "none" | "to-destination" | "anywhere-along-path";

	interface PathfindingBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"arrived": BehaviorInstanceEvent<InstType, BehInstType>;
	}

	/** Represents the Pathfinding behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/pathfinding | IPathfindingBehaviorInstance documentation } */
	class IPathfindingBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof PathfindingBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: PathfindingBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof PathfindingBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: PathfindingBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		readonly map: IPathfindingMap;

		findPath(x: number, y: number): Promise<boolean>;
		calculatePath(fromX: number, fromY: number, toX: number, toY: number): Promise<boolean>;
		startMoving(): void;
		stop(): void;
		maxSpeed: number;
		speed: number;
		acceleration: number;
		deceleration: number;
		rotateSpeed: number;
		readonly isCalculatingPath: boolean;
		readonly isMoving: boolean;
		readonly currentNode: number;

		getNodeCount(): number;
		getNodeXAt(index: number): number;
		getNodeYAt(index: number): number;
		getNodeAt(index: number): number[];
		nodes(): Iterable<number[]>;

		directMovementMode: PathfindingDirectMovementMode;
		isEnabled: boolean;
	}

	/** IPathfindingMap.d.ts */
	/** Represents a shared pathfinding obstacle map for the Pathfinding behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/pathfinding | IPathfindingBehaviorInstance documentation } */
	class IPathfindingMap {
		readonly cellSize: number;
		readonly cellBorder: number;
		readonly widthInCells: number;
		readonly heightInCells: number;
		isCellObstacle(x: number, y: number): boolean;
		moveCost: number;
		isDiagonalsEnabled: boolean;
		regenerateMap(): Promise<void>;
		regenerateRegion(startX: number, startY: number, endX: number, endY: number): Promise<void>;
		regenerateObjectRegion<InstanceType extends IInstance>(objectClass: IObjectClass<InstanceType>): Promise<void>;
		startPathGroup(baseCost?: number, cellSpread?: number, maxWorkers?: number): void;
		endPathGroup(): void;
	}

	/** IPhysicsBehavior.d.ts */
	type PhysicsSteppingMode = "fixed" | "variable";

	/** Represents global settings with the Physics behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/physics | IPhysicsBehaviorInstance documentation } */
	class IPhysicsBehavior extends IBehavior_ {
		worldGravity: number;
		steppingMode: PhysicsSteppingMode;
		velocityIterations: number;
		positionIterations: number;
		setCollisionsEnabled<InstType1 extends IInstance, InstType2 extends IInstance>(objectClassA: IObjectClass<InstType1>, objectClassB: IObjectClass<InstType2>, state: boolean): void;
	}

	/** IPhysicsBehaviorInstance.d.ts */
	/** Represents the Physics behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/physics | IPhysicsBehaviorInstance documentation } */
	class IPhysicsBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		readonly behavior: IPhysicsBehavior;

		isEnabled: boolean;
		angularVelocity: number;
		density: number;
		friction: number;
		elasticity: number;
		linearDamping: number;
		angularDamping: number;
		isImmovable: boolean;
		isPreventRotation: boolean;
		isBullet: boolean;
		readonly mass: number;

		/**
		 * @deprecated Use isAwake (which also has a setter) instead of isSleeping
		 */
		readonly isSleeping: boolean;
		isAwake: boolean;

		applyForce(fx: number, fy: number, imgPt?: ImagePointParameter): void;
		applyForceTowardPosition(f: number, px: number, py: number, imgPt?: ImagePointParameter): void;
		applyForceAtAngle(f: number, a: number, imgPt?: ImagePointParameter): void;

		applyImpulse(ix: number, iy: number, imgPt?: ImagePointParameter): void;
		applyImpulseTowardPosition(i: number, px: number, py: number, imgPt?: ImagePointParameter): void;
		applyImpulseAtAngle(i: number, a: number, imgPt?: ImagePointParameter): void;

		applyTorque(m: number): void;
		applyTorqueToAngle(m: number, a: number): void;
		applyTorqueToPosition(m: number, px: number, py: number): void;

		setVelocity(vx: number, vy: number): void;
		getVelocityX(): number;
		getVelocityY(): number;
		getVelocity(): number[];

		teleport(x: number, y: number): void;

		getCenterOfMassX(): number;
		getCenterOfMassY(): number;
		getCenterOfMass(): number[];

		getContactCount(): number;
		getContactX(): number;
		getContactY(): number;
		getContact(): number[];

		createDistanceJoint(imgPt: ImagePointParameter, otherInst: IWorldInstance, otherImgPt: ImagePointParameter, damping: number, freq: number): void;
		createRevoluteJoint(imgPt: ImagePointParameter, otherInst: IWorldInstance): void;
		createLimitedRevoluteJoint(imgPt: ImagePointParameter, otherInst: IWorldInstance, lower: number, upper: number): void;
		createPrismaticJoint(imgPt: ImagePointParameter, otherInst: IWorldInstance, axisAngle: number, enableLimit: boolean, lowerTranslation: number, upperTranslation: number, enableMotor: boolean, motorSpeed: number, maxMotorForce: number): void;
		removeAllJoints(): void;
	}

	/** IPlatformBehaviorInstance.d.ts */
	type SimulateControlTypePlatform = "left" | "right" | "jump";
	type PlatformCeilingCollisionMode = "stop" | "preserve-momentum";
	type PlatformWallSide = "left" | "right";

	/** Represents the Platform behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/platform | IPlatformBehaviorInstance documentation } */
	class IPlatformBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		fallThrough(): void;
		resetDoubleJump(d: boolean): void;
		simulateControl(ctrl: SimulateControlTypePlatform): void;
		speed: number;
		maxSpeed: number;
		acceleration: number;
		deceleration: number;
		jumpStrength: number;
		maxFallSpeed: number;
		gravity: number;
		gravityAngle: number;
		isDoubleJumpEnabled: boolean;
		jumpSustain: number;
		ceilingCollisionMode: PlatformCeilingCollisionMode;
		isByWall(side: PlatformWallSide): boolean;
		readonly isOnFloor: boolean;
		readonly isMoving: boolean;
		readonly isJumping: boolean;
		readonly isFalling: boolean;
		vectorX: number;
		vectorY: number;
		setVector(x: number, y: number): void;
		getVector(): number[];
		isDefaultControls: boolean;
		isIgnoringInput: boolean;
		isEnabled: boolean;
	}

	/** IRotateBehaviorInstance.d.ts */
	/** Represents the Rotate behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/rotate | IRotateBehaviorInstance documentation } */
	class IRotateBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		speed: number;
		acceleration: number;
		isEnabled: boolean;
	}

	/** IShadowCasterBehaviorInstance.d.ts */
	/** Represents the Shadow Caster behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/shadow-caster | IShadowCasterBehaviorInstance documentation } */
	class IShadowCasterBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		height: number;
		tag: string;
		isEnabled: boolean;
	}

	/** ISineBehaviorInstance.d.ts */
	type SineBehaviorMovementType = "horizontal" | "vertical" | "size" | "width" | "height" | "angle" | "opacity" | "value-only" | "forwards-backwards" | "z-elevation";
	type SineBehaviorWaveType = "sine" | "triangle" | "sawtooth" | "reverse-sawtooth" | "square";

	/** Represents the Sine behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/sine | ISineBehaviorInstance documentation } */
	class ISineBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		period: number;
		magnitude: number;
		phase: number;
		movement: SineBehaviorMovementType;
		wave: SineBehaviorWaveType;
		readonly value: number;
		updateInitialState(): void;
		isEnabled: boolean;
	}

	/** ISolidBehaviorInstance.d.ts */
	/** Represents the Solid behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/solid | ISolidBehaviorInstance documentation } */
	class ISolidBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		tags: string;
		isEnabled: boolean;
	}

	/** ITileMovementBehaviorInstance.d.ts */
	type SimulateControlTypeTile = "left" | "right" | "up" | "down";

	/** Represents the Tile Movement behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/tile-movement | ITileMovementBehaviorInstance documentation } */
	class ITileMovementBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
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

	/** ITimerBehaviorInstance.d.ts */
	type TimerBehaviorTimerType = "once" | "regular";

	class TimerBehaviorEvent<InstType, BehInstType> extends BehaviorInstanceEvent<InstType, BehInstType> {
		tag: string;
	}

	interface TimerBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"timer": TimerBehaviorEvent<InstType, BehInstType>;
	}

	/** Represents the Timer behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/timer | ITimerBehaviorInstance documentation } */
	class ITimerBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof TimerBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: TimerBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof TimerBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: TimerBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		startTimer(duration: number, name: string, type?: TimerBehaviorTimerType): void;
		setTimerPaused(name: string, isPaused: boolean): void;
		setAllTimersPaused(isPaused: boolean): void;
		stopTimer(name: string): void;
		stopAllTimers(): void;
		isTimerRunning(name: string): boolean;
		isTimerPaused(name: string): boolean;
		getCurrentTime(name: string): number;
		getTotalTime(name: string): number;
		getDuration(name: string): number;
		hasFinished(name: string): boolean;
	}

	/** ITurretBehaviorInstance.d.ts */
	type TurretBehaviorTargetMode = "first" | "nearest";

	class TurretBehaviorEvent<InstType, BehInstType> extends BehaviorInstanceEvent<InstType, BehInstType> {
		targetInst: IWorldInstance;
	}

	interface TurretBehaviorInstanceEventMap<InstType, BehInstType> extends BehaviorInstanceEventMap<InstType, BehInstType> {
		"targetacquired": TurretBehaviorEvent<InstType, BehInstType>;
		"shoot": TurretBehaviorEvent<InstType, BehInstType>;
	}

	/** Represents the Turret behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/turret | ITurretBehaviorInstance documentation } */
	class ITurretBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		addEventListener<K extends keyof TurretBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: TurretBehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof TurretBehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: TurretBehaviorInstanceEventMap<InstType, this>[K]) => any): void;

		currentTarget: IWorldInstance | null;
		range: number;
		rateOfFire: number;
		isRotateEnabled: boolean;
		rotateSpeed: number;
		targetMode: TurretBehaviorTargetMode;
		isPredictiveAimEnabled: boolean;
		projectileSpeed: number;
		isEnabled: boolean;
	}

	/** ITweenBehaviorInstance.d.ts */
	type TweenPropertyType = "x" | "y" | "width" | "height" | "angle" | "opacity" | "color" | "z-elevation" | "x-scale" | "y-scale" | "position" | "size" | "scale" | "value";
	type TweenEndValueType = number | number[];

	interface StartTweenOpts {
		tags?: string | string[];
		destroyOnComplete?: boolean;
		loop?: boolean;
		pingPong?: boolean;
		repeatCount?: number;
		startValue?: number;
	}

	/** Represents the Tween behavior.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/behavior-interfaces/tween | ITweenBehaviorInstance documentation } */
	class ITweenBehaviorInstance<InstType> extends IBehaviorInstance<InstType> {
		startTween(prop: TweenPropertyType, endValue: TweenEndValueType, time: number, ease: string, opts?: StartTweenOpts): ITweenState;

		allTweens(): Iterable<ITweenState>;
		tweensByTags(tags: string | string[]): Iterable<ITweenState>;
		isEnabled: boolean;
	}

/** IDrawParams.d.ts */ namespace SDK.Gfx {
		class IDrawParams {
			GetDt(): number;
			GetLayoutView(): SDK.UI.ILayoutView;
		}
	}
	/** IWebGLRenderer.d.ts */// Note types like TextureCreateOptions are taken from the runtime type
	// definitions as they match the same types used by the editor

	namespace SDK.Gfx {
		class IWebGLRenderer {
			SetAlphaBlend(): void;

			SetColorFillMode(): void;
			SetTextureFillMode(): void;
			SetSmoothLineFillMode(): void;

			SetColor(color: SDK.Color): void;
			SetColorRgba(r: number, g: number, b: number, a: number): void;
			SetOpacity(opacity: number): void;
			ResetColor(): void;

			SetCurrentZ(z: number): void;
			GetCurrentZ(): number;

			Rect(r: SDK.Rect): void;
			Rect2(left: number, top: number, right: number, bottom: number): void;


			Quad(q: SDK.Quad): void;
			Quad2(tlx: number, tly: number, trx: number, try_: number, brx: number, bry: number, blx: number, bly: number): void;
			Quad3(q: SDK.Quad, r: SDK.Rect): void;
			Quad4(q: SDK.Quad, uv: SDK.Quad): void;
			Quad3D(tlx: number, tly: number, tlz: number, trx: number, try_: number, trz: number, brx: number, bry: number, brz: number, blx: number, bly: number, blz: number, r: SDK.Rect): void;
			Quad3D2(tlx: number, tly: number, tlz: number, trx: number, try_: number, trz: number, brx: number, bry: number, brz: number, blx: number, bly: number, blz: number, uv: SDK.Quad): void;

			DrawMesh(posArr: Float32Array, uvArr: Float32Array, indexArr: Uint16Array): void;

			ConvexPoly(pts: number[]): void;
			Line(x1: number, y1: number, x2: number, y2: number): void;
			TexturedLine(x1: number, y1: number, x2: number, y2: number, u: number, v: number): void;

			LineRect(left: number, top: number, right: number, bottom: number): void;
			LineRect2(r: SDK.Rect): void;
			LineQuad(q: SDK.Quad): void;

			PushLineWidth(w: number): void;
			PopLineWidth(): void;
			PushLineCap(type: RendererLineCapMode): void;
			PopLineCap(): void;

			SetTexture(tex: SDK.Gfx.IWebGLTexture): void;
			CreateDynamicTexture(width: number, height: number, opts?: TextureCreateOptions): SDK.Gfx.IWebGLTexture;
			UpdateTexture(data: TextureUpdateDataType, tex: SDK.Gfx.IWebGLTexture, opts?: TextureUpdateOptions): void;
			DeleteTexture(tex: SDK.Gfx.IWebGLTexture): void;

			CreateRendererText(): SDK.Gfx.IWebGLText;
		}
	}
	/** IWebGLText.d.ts */// Note types like TextAlignHorizontalMode are taken from the runtime type
	// definitions as they match the same types used by the editor

	namespace SDK.Gfx {
		class IWebGLText {
			Release(): void;

			SetFontName(fontName: string): void;
			SetFontSize(fontSize: number): void;
			SetLineHeight(h: number): void;
			SetBold(b: boolean): void;
			SetItalic(i: boolean): void;
			SetColor(color: SDK.Color): void;
			SetColorRgb(r: number, g: number, b: number): void;
			SetHorizontalAlignment(h: TextAlignHorizontalMode): void;
			SetVerticalAlignment(v: TextAlignVerticalMode): void;
			SetWordWrapMode(mode: TextWordWrapMode): void;

			SetText(text: string): void;
			SetSize(width: number, height: number, zoomScale: number): void;

			GetTexture(): SDK.Gfx.IWebGLTexture | null;
			GetTexRect(): SDK.Rect;
			SetTextureUpdateCallback(callback: () => void): void;
			ReleaseTexture(): void;

			GetTextWidth(): number;
			GetTextHeight(): number;
		}
	}
/** IWebGLTexture.d.ts */ namespace SDK.Gfx {
		class IWebGLTexture {
			GetWidth(): number;
			GetHeight(): number;
		}
	}
/** IBehaviorBase.d.ts */ namespace SDK {
		class IBehaviorBase {

			constructor(id: string);

			_info: SDK.IBehaviorInfo;

			Release(): void;

			static Register(id: string, class_: new () => SDK.IBehaviorBase): void;
		}
	}
	/** IBehaviorInfo.d.ts */
	type BehaviorInfoCategory = "attributes" | "general" | "movements" | "other";

	namespace SDK {
		class IBehaviorInfo {
			SetName(v: string): void;
			SetDescription(v: string): void;
			SetVersion(v: string): void;
			SetCategory(v: BehaviorInfoCategory): void;
			SetAuthor(v: string): void;
			SetHelpUrl(v: string): void;
			SetIcon(url: string, type: string): void;

			SetIsOnlyOneAllowed(o: boolean): void;
			SetIsDeprecated(d: boolean): void;
			SetCanBeBundled(b: boolean): void;

			SetProperties(arr: SDK.PluginProperty[]): void;

			AddCordovaPluginReference(o: PluginInfoCordovaPluginReference): void;
			AddFileDependency(o: PluginInfoFileDependency): void;
			AddRemoteScriptDependency(url: string, type?: PluginInfoScriptType): void;

			SetRuntimeModuleMainScript(path: string): void;
			AddC3RuntimeScript(path: string): void;
			SetC3RuntimeScripts(arr: string[]): void;
			SetTypeScriptDefinitionFiles(arr: string[]): void;
			SetScriptInterfaceNames(o: { instance?: string, behaviorType?: string, behavior?: string }): void;
		}
	}
/** IBehaviorInstanceBase.d.ts */ namespace SDK {
		class IBehaviorInstanceBase {

			constructor(sdkBehaviorType: SDK.IBehaviorTypeBase, iBehaviorInstance: SDK.IBehaviorInstance);

			_sdkBehaviorType: SDK.IBehaviorTypeBase;
			_behaviorInstance: SDK.IBehaviorInstance;

			GetBehaviorInstance(): SDK.IBehaviorInstance;
			GetSdkBehaviorType(): SDK.IBehaviorTypeBase;

			Release(): void;
			OnCreate(): void;

			OnPropertyChanged(id: string, value: EditorPropertyValueType): void;
		}
	}
/** IBehaviorTypeBase.d.ts */ namespace SDK {
		class IBehaviorTypeBase {
			constructor(sdkBehavior: SDK.IBehaviorBase, iBehaviorType: SDK.IBehaviorType);

			_sdkBehavior: SDK.IBehaviorBase;
			_behaviorType: SDK.IBehaviorType;
		}
	}
/** IInstanceBase.d.ts */ namespace SDK {
		class IInstanceBase {

			constructor(sdkType: SDK.ITypeBase, iInstance: SDK.IObjectInstance);

			_sdkType: SDK.ITypeBase;
			_inst: SDK.IObjectInstance;

			Release(): void;
			OnCreate(): void;
			OnAfterCreate(): void;
			OnPropertyChanged(id: string, value: EditorPropertyValueType): void;
			OnTimelinePropertyChanged(id: string, value: number | string, detail: { resultMode: "relative" | "absolute" }): void;
			OnExitTimelineEditMode(): void;

			LoadC2Property(name: string, valueString: string): boolean;
			GetObjectType(): SDK.IObjectType;
			GetProject(): SDK.IProject;
			GetInstance(): SDK.IObjectInstance;
		}
	}

	/** IPluginBase.d.ts */

	namespace SDK {
		class IPluginBase {

			constructor(id: string);

			_info: SDK.IPluginInfo;

			Release(): void;

			static Register(id: string, class_: new () => SDK.IPluginBase): void;
		}
	}

	/** IPluginInfo.d.ts */
	type PluginInfoCategory = "3d" | "data-and-storage" | "html-elements" | "general" | "input" | "media" | "monetisation" | "platform-specific" | "web" | "other" | 'form-controls';
	type PluginInfoPluginType = "object" | "world";
	type PluginInfoScriptType = "" | "module";

	interface PluginInfoCordovaPluginReference {
		id: string,
		version?: string,
		platform?: "all" | "ios" | "android",
		plugin?: SDK.IPluginBase,
		variables?: Array<[string, SDK.PluginProperty]>
	}

	interface PluginInfoCordovaResourceFile {
		src: string,
		target?: string,
		platform?: "all" | "ios" | "android"
	}

	interface PluginInfoFileDependency {
		filename: string,
		fileType?: string,
		scriptType?: PluginInfoScriptType,
		type: "copy-to-output" | "external-dom-script" | "external-runtime-script" | "external-css" | "wrapper-extension",
		platform?: "all" | "windows-x86" | "windows-x64" | "windows-arm64" | "xbox-uwp-x64" | "linux-x64" | "linux-arm" | "linux-arm64"
	}

	namespace SDK {
		class IPluginInfo {
			SetName(v: string): void;
			SetDescription(v: string): void;
			SetVersion(v: string): void;
			SetCategory(v: PluginInfoCategory): void;
			SetAuthor(v: string): void;
			SetHelpUrl(v: string): void;
			SetPluginType(v: PluginInfoPluginType): void;
			SetIcon(url: string, type: string): void;

			SetIsResizable(v: boolean): void;
			SetIsRotatable(v: boolean): void;
			SetSupportsZElevation(v: boolean): void;
			SetHasImage(v: boolean): void;
			SetDefaultImageURL(v: string): void;
			SetHasAnimations(v: boolean): void;
			SetIsTiled(v: boolean): void;
			SetIsFont(v: boolean): void;
			SetHasTilemap(v: boolean): void;
			SetIsDeprecated(v: boolean): void;
			SetIsSingleGlobal(v: boolean): void;
			SetSupportsEffects(v: boolean): void;
			SetMustPreDraw(v: boolean): void;
			SetIs3D(v: boolean): void;
			SetSupportsColor(v: boolean): void;
			SetCanBeBundled(v: boolean): void;
			SetSupportsColor(v: boolean): void;

			AddCommonPositionACEs(): void;
			AddCommonSizeACEs(): void;
			AddCommonAngleACEs(): void;
			AddCommonAppearanceACEs(): void;
			AddCommonZOrderACEs(): void;
			AddCommonSceneGraphACEs(): void;

			SetProperties(arr: SDK.PluginProperty[]): void;

			AddCordovaPluginReference(o: PluginInfoCordovaPluginReference): void;
			AddCordovaResourceFile(o: PluginInfoCordovaResourceFile): void;
			AddFileDependency(o: PluginInfoFileDependency): void;
			AddRemoteScriptDependency(url: string, type?: PluginInfoScriptType): void;
			SetGooglePlayServicesEnabled(e: boolean): void;

			SetRuntimeModuleMainScript(path: string): void;
			AddC3RuntimeScript(path: string): void;
			SetC3RuntimeScripts(arr: string[]): void;
			SetDOMSideScripts(arr: string[]): void;
			SetTypeScriptDefinitionFiles(arr: string[]): void;
			SetScriptInterfaceNames(o: { instance?: string, objectType?: string, plugin?: string }): void;
		}
	}
	/** IPluginProperty.d.ts */
	type PluginPropertyInitialValueType = number | number[] | string | boolean;

	type PluginPropertyType = "integer" | "float" | "percent" | "text" | "longtext" | "check" | "font" | "combo" | "color" | "object" | "group" | "link" | "info";

	type PluginPropertyCallbackType = "for-each-instance" | "once-for-type";

	interface PluginPropertyOptions {
		initialValue?: PluginPropertyInitialValueType,
		minValue?: number,
		maxValue?: number,
		items?: string[],
		dragSpeedMultiplier?: number,
		allowedPluginIds?: string[],
		linkCallback?: (p: SDK.IWorldInstanceBase | SDK.ITypeBase) => void,
		infoCallback?: (inst: SDK.IInstanceBase) => string,
		callbackType?: PluginPropertyCallbackType,
		interpolatable?: boolean
	}

	namespace SDK {
		class PluginProperty {
			constructor(type: PluginPropertyType, id: string, initialValue_or_options?: PluginPropertyOptions | PluginPropertyInitialValueType);
		}
	}
	/** ITypeBase.d.ts */
	namespace SDK {
		class ITypeBase {

			constructor(sdkPlugin: SDK.IPluginBase, iObjectType: SDK.IObjectType);

			_sdkPlugin: SDK.IPluginBase;
			_objectType: SDK.IObjectType;

			GetObjectType(): SDK.IObjectType;
		}
	}
	/** IWorldInstanceBase.d.ts */
	namespace SDK {
		class IWorldInstanceBase extends SDK.IInstanceBase {

			constructor(sdkType: SDK.ITypeBase, iInstance: SDK.IWorldInstance);

			_inst: SDK.IWorldInstance;

			Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams): void;
			OnPlacedInLayout(): void;

			GetTexture(animationFrame: SDK.IAnimationFrame): SDK.Gfx.IWebGLTexture | null;
			GetTexRect(): SDK.Rect;
			HadTextureError(): boolean;

			IsOriginalSizeKnown(): boolean;
			GetOriginalWidth(): number;
			GetOriginalHeight(): number;

			HasDoubleTapHandler(): boolean;
			OnDoubleTap(): void;
		}
	}
/** IColor.d.ts */ namespace SDK {
		class Color {
			constructor(r?: number, g?: number, b?: number, a?: number);

			setRgb(r: number, g: number, b: number): void;
			setRgba(r: number, g: number, b: number, a: number): void;

			copy(c: SDK.Color): void;
			copyRgb(c: SDK.Color): void;
			clone(): SDK.Color;

			setR(r: number): void;
			getR(): number;
			setG(g: number): void;
			getG(): number;
			setB(b: number): void;
			getB(): number;
			setA(a: number): void;
			getA(): number;

			equals(c: SDK.Color): boolean;
			equalsIgnoringAlpha(c: SDK.Color): boolean;
			equalsRgb(r: number, b: number, g: number): boolean;
			equalsRgba(r: number, b: number, g: number, a: number): boolean;

			premultiply(): void;
			unpremultiply(): void;
		}
	}
	/** ILang.d.ts */
	namespace SDK.Lang {
		function PushContext(str: string): void;
		function PopContext(): void;
		function Get(s: string): string;
	}

	// Global lang() method
	function lang(s: string): string;

/** IQuad.d.ts */ namespace SDK {
		class Quad {
			constructor(tlx?: number, tly?: number, trx?: number, try_?: number, brx?: number, bry?: number, blx?: number, bly?: number);

			set(tlx: number, tly: number, trx: number, try_: number, brx: number, bry: number, blx: number, bly: number): void;
			setRect(left: number, top: number, right: number, bottom: number): void;

			copy(q: SDK.Quad): void;

			setTlx(v: number): void;
			getTlx(): number;
			setTly(v: number): void;
			getTly(): number;
			setTrx(v: number): void;
			getTrx(): number;
			setTry(v: number): void;
			getTry(): number;
			setBrx(v: number): void;
			getBrx(): number;
			setBry(v: number): void;
			getBry(): number;
			setBlx(v: number): void;
			getBlx(): number;
			setBly(v: number): void;
			getBly(): number;

			midX(): number;
			midY(): number;

			offset(x: number, y: number): void;

			setFromRect(r: SDK.Rect): void;
			setFromRotatedRect(r: SDK.Rect, a: number): void;
			getBoundingBox(r: SDK.Rect): void;

			containsPoint(x: number, y: number): boolean;
			intersectsSegment(x1: number, y1: number, x2: number, y2: number): boolean;
			intersectsQuad(q: SDK.Quad): boolean;
		}
	}
/** IRect.d.ts */ namespace SDK {
		class Rect {
			constructor(left?: number, top?: number, right?: number, bottom?: number);

			set(left: number, top: number, right: number, bottom: number): void;
			copy(r: SDK.Rect): void;
			clone(): SDK.Rect;

			setLeft(left: number): void;
			getLeft(): number;
			setTop(top: number): void;
			getTop(): number;
			setRight(right: number): void;
			getRight(): number;
			setBottom(bottom: number): void;
			getBottom(): number;

			width(): number;
			height(): number;
			midX(): number;
			midY(): number;

			offset(x: number, y: number): void;
			inflate(x: number, y: number): void;
			deflate(x: number, y: number): void;
			multiply(x: number, y: number): void;
			divide(x: number, y: number): void;
			clamp(left: number, top: number, right: number, bottom: number): void;
			normalize(): void;
			intersectsRect(r: SDK.Rect): boolean;
			containsPoint(x: number, y: number): boolean;
		}
	}
/** IZipFile.d.ts */ namespace SDK {
		class IZipFile {
			PathExists(path: string): boolean;
			GetFileList(): string[];
			GetFirstEntryWithExtension(ext: string): SDK.IZipFileEntry | null;
			GetEntry(path: string): SDK.IZipFileEntry | null;

			ReadText(entry: SDK.IZipFileEntry): Promise<string>;
			ReadJson(entry: SDK.IZipFileEntry): Promise<JSONValue>;
			ReadBlob(entry: SDK.IZipFileEntry): Promise<Blob>;
		}
	}
/** IZipFileEntry.d.ts */ namespace SDK {
		class IZipFileEntry {

		}
	}
/** IEventBlock.d.ts */type EditorACParameterType = number | string | SDK.IObjectClass;

	namespace SDK {
		class IEventBlock extends IEventParentRow {
			AddCondition(iObjectClass: SDK.IObjectClass, iBehaviorType: null, cndId: string, params?: EditorACParameterType[]): void;
			AddAction(iObjectClass: SDK.IObjectClass, iBehaviorType: null, actId: string, params?: EditorACParameterType[]): void;
		}
	}
/** IEventParentRow.d.ts */ namespace SDK {
		class IEventParentRow {
			AddEventBlock(): Promise<SDK.IEventBlock>;
		}
	}
/** IEventSheet.d.ts */ namespace SDK {
		class IEventSheet {
			GetName(): string;
			GetProject(): SDK.IProject;
			GetRoot(): SDK.IEventParentRow;
		}
	}
/** ILayer.d.ts */ namespace SDK {
		class ILayer {
			GetName(): string;
			GetLayout: SDK.ILayout;
		}
	}
/** ILayout.d.ts */ namespace SDK {
		class ILayout {
			GetName(): string;
			GetProject(): SDK.IProject;
			GetEventSheet(): SDK.IEventSheet;
			GetAllLayers(): SDK.ILayer[];
		}
	}
/** IProject.d.ts */type EditorProjectFileKind = "general" | "sound" | "music" | "video" | "font" | "icon";

	namespace SDK {
		class IProject {
			GetName(): string;

			GetSystemType(): SDK.IObjectType;
			GetSingleGlobalObjectType(pluginId: string): SDK.IObjectType | null;
			CreateObjectType(pluginId: string, name: string): Promise<SDK.IObjectType>;
			CreateFamily(name: string, members: SDK.IObjectType[]): SDK.IFamily;
			GetObjectTypeByName(name: string): SDK.IObjectType | null;
			GetFamilyByName(name: string): SDK.IFamily | null;
			GetObjectClassByName(name: string): SDK.IObjectClass | null;
			GetObjectClassBySID(sid: number): SDK.IObjectClass | null;
			GetInstanceByUID(uid: number): SDK.IObjectInstance | null;

			AddOrReplaceProjectFile(blob: Blob, filename: string, kind?: EditorProjectFileKind): void;
			GetProjectFileByName(name: string): SDK.IProjectFile | null;
			GetProjectFileByExportPath(path: string): SDK.IProjectFile | null;

			ShowImportAudioDialog(fileList: Blob[]): void;
			EnsureFontLoaded(fontName: string): Promise<void>;

			UndoPointChangeObjectInstancesProperty(instances: SDK.IObjectInstance | SDK.IObjectInstance[], propertyId: string): void;
		}
	}
/** IProjectFile.d.ts */ namespace SDK {
		class IProjectFile {
			GetName(): string;
			GetProject(): SDK.IProjectFile;
			GetBlob(): Blob;
		}
	}
/** IAnimation.d.ts */ namespace SDK {
		class IAnimation {
			GetName(): string;
			GetObjectType(): SDK.IObjectType;
			GetFrames(): SDK.IAnimationFrame[];

			AddFrame(blob: Blob, width: number, height: number): Promise<SDK.IAnimationFrame>;

			SetSpeed(s: number): void;
			GetSpeed(): number;
			SetLooping(l: boolean): void;
			IsLooping(): boolean;
			SetPingPong(p: boolean): void;
			IsPingPong(): boolean;
			SetRepeatCount(r: number): void;
			GetRepeatCount(): number;
			SetRepeatTo(f: number): void;
			GetRepeatTo(): number;

			Delete(): void;
		}
	}
/** IAnimationFrame.d.ts */ namespace SDK {
		class IAnimationFrame {
			GetObjectType(): SDK.IObjectType;
			GetWidth(): number;
			GetHeight(): number;
			GetCachedWebGLTexture(): SDK.Gfx.IWebGLTexture | null;
			GetTexRect(): SDK.Rect;

			LoadWebGLTexture(): Promise<SDK.Gfx.IWebGLTexture>;
			GetBlob(): Blob;
			ReplaceBlobAndDecode(blob: Blob): Promise<void>;

			SetDuration(d: number): void;
			GetDuration(): number;
			SetOriginX(x: number): void;
			GetOriginX(): number;
			SetOriginY(y: number): void;
			GetOriginY(): number;

			AddImagePoint(name: string, x: number, y: number): SDK.IImagePoint;
			GetImagePoints(): SDK.IImagePoint[];
			GetCollisionPoly(): SDK.ICollisionPoly;

			Delete(): void;
		}
	}
/** IBehaviorInstance.d.ts */ namespace SDK {
		class IBehaviorInstance {
			GetProject(): SDK.IProject;

			GetPropertyValue(id: string): EditorPropertyValueType;
			SetPropertyValue(id: string, value: EditorPropertyValueType): void;

			GetObjectInstance(): SDK.IObjectInstance;

			GetExternalSdkInstance(): SDK.IBehaviorInstanceBase | null;
		}
	}
/** IBehaviorType.d.ts */ namespace SDK {
		class IBehaviorType {
			GetProject(): SDK.IProject;
			GetName(): string;
		}
	}
/** ICollisionPoly.d.ts */ namespace SDK {
		class ICollisionPoly {
			Reset(): void;
			IsDefault(): boolean;

			GetPoints(): number[];
			SetPoints(arr: number[]): void;
		}
	}
	/** IContainer.d.ts */
	type EditorContainerSelectMode = "normal" | "all" | "wrap";

	namespace SDK {
		class IContainer {
			IsActive(): boolean;

			GetMembers(): SDK.IObjectType[];
			RemoveObjectType(iObjectType: SDK.IObjectType): void;

			SetSelectMode(mode: EditorContainerSelectMode): void;
			GetSelectMode(): EditorContainerSelectMode;
		}
	}
/** IFamily.d.ts */ namespace SDK {
		class IFamily extends IObjectClass {
			GetMembers(): SDK.IObjectType[];
			SetMembers(memberS: SDK.IObjectType[]): void;
		}
	}
/** IImagePoint.d.ts */ namespace SDK {
		class IImagePoint {
			GetAnimationFrame(): SDK.IAnimationFrame;
			GetName(): string;
			SetName(name: string): void;
			SetX(x: number): void;
			GetX(): number;
			SetY(y: number): void;
			GetY(): number;
		}
	}
/** IObjectClass.d.ts */ namespace SDK {
		class IObjectClass {
			GetProject(): SDK.IProject;
			GetName(): string;
			Delete(): void;
		}
	}
/** IObjectInstance.d.ts */ namespace SDK {
		class IObjectInstance {
			GetProject(): SDK.IProject;
			GetObjectType(): SDK.IObjectType;

			GetUID(): number;

			SetPropertyValue(id: string, value: EditorPropertyValueType): void;
			GetPropertyValue(id: string): EditorPropertyValueType;

			GetTimelinePropertyValue(id: string): EditorPropertyValueType;

			GetExternalSdkInstance(): SDK.IInstanceBase | null;
		}
	}
/** IObjectType.d.ts */ namespace SDK {
		class IObjectType extends IObjectClass {
			GetImage(): SDK.IAnimationFrame;
			EditImage(): void;

			GetAnimations(): SDK.IAnimation[];
			EditAnimations(): void;

			AddAnimation(animName: string, frameBlob: Blob, frameWidth: number, frameHeight: number): Promise<SDK.IAnimation>;

			CreateWorldInstance(layer: SDK.ILayer): SDK.IWorldInstance;
			GetAllInstances(): SDK.IWorldInstance[];

			IsInContainer(): boolean;
			GetContainer(): SDK.IContainer | null;
			CreateContainer(initialObjectTypes: SDK.IObjectType[]): SDK.IContainer;
		}
	}
/** IWorldInstance.d.ts */ namespace SDK {
		class IWorldInstance extends IObjectInstance {
			GetBoundingBox(): SDK.Rect;
			GetQuad(): SDK.Quad;
			GetColor(): SDK.Color;

			SetOpacity(o: number): void;
			GetOpacity(): number;

			SetX(x: number): void;
			GetX(): number;
			SetY(y: number): void;
			GetY(): number;
			SetXY(x: number, y: number): void;

			SetZElevation(z: number): void;
			GetZElevation(): number;
			GetTotalZElevation(): number;

			SetWidth(w: number): void;
			GetWidth(): number;
			SetHeight(h: number): void;
			GetHeight(): number;
			SetSize(w: number, h: number): void;

			SetOriginX(x: number): void;
			GetOriginX(): number;
			SetOriginY(y: number): void;
			GetOriginY(): number;
			SetOrigin(x: number, y: number): void;

			SetAngle(a: number): void;
			GetAngle(): number;

			GetLayer(): SDK.ILayer;
			GetLayout(): SDK.ILayout;

			ApplyBlendMode(iRenderer: SDK.Gfx.IWebGLRenderer): void;
		}
	}

	type EditorPropertyValueType = number | string | boolean | SDK.Color;
/** ILayoutView.d.ts */ namespace SDK.UI {
		class ILayoutView {
			GetProject(): SDK.IProject;
			GetZoomFactor(): number;

			LayoutToClientDeviceX(x: number): number;
			LayoutToClientDeviceY(y: number): number;

			SetDeviceTransform(iRenderer: SDK.Gfx.IWebGLRenderer): void;
			SetDefaultTransform(iRenderer: SDK.Gfx.IWebGLRenderer): void;

			Refresh(): void;

			GetLayout(): SDK.ILayout;
			GetActiveLayer(): SDK.ILayer;
		}
	}
	/** Util.d.ts */
	namespace SDK.UI {

		interface DragDropFileImportHandlerOpts {
			isZipFormat: boolean;
			toLayoutView: boolean;
		}

		interface DragDropFileImportHandlerCallbackOpts {
			layoutView: SDK.UI.ILayoutView;
			clientX: number;
			clientY: number;
			layoutX: number;
			layoutY: number;
		}

		class Util {
			static ShowLongTextPropertyDialog(initText: string, caption: string): Promise<string | null>;

			static AddDragDropFileImportHandler(callback: (filename: string, file: SDK.IZipFile | Blob, opts: DragDropFileImportHandlerCallbackOpts) => Promise<boolean>, opts?: DragDropFileImportHandlerOpts): void;
		}
	}
	/** I3DCameraObjectType.d.ts */
	type Camera3DLayoutAxes = "x" | "y" | "z";
	type Camera3DCameraAxes = "forward" | "up" | "right";
	type Camera3DMoveType = "both" | "camera" | "look";

	/** Represents the 3D Camera object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/3d-camera | I3DCameraObjectType documentation } */
	class I3DCameraObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		lookAtPosition(camX: number, camY: number, camZ: number, lookX: number, lookY: number, lookZ: number, upX: number, upY: number, upZ: number): void;
		lookParallelToLayout(camX: number, camY: number, camZ: number, lookAngle: number): void;
		restore2DCamera(): void;
		moveAlongLayoutAxis(distance: number, axisStr: Camera3DLayoutAxes, whichStr: Camera3DMoveType): void;
		moveAlongCameraAxis(distance: number, axisStr: Camera3DCameraAxes, whichStr: Camera3DMoveType): void;
		rotateCamera(rotateX: number, rotateY: number, minPolar: number, maxPolar: number): void;
		fieldOfView: number;

		getCameraPosition(): number[];
		getLookPosition(): number[];
		getUpVector(): number[];
		getRightVector(): number[];
		getForwardVector(): number[];
		getLookVector(): number[];
		readonly zScale: number;
	}

	/** I3DShapeInstance.d.ts */
	type Shape3DShapeType = "box" | "prism" | "wedge" | "pyramid" | "corner-out" | "corner-in";
	type Shape3DFaceType = "back" | "front" | "left" | "right" | "top" | "bottom";

	/** Represents the 3D Shape object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/3d-shape | I3DShapeInstance documentation } */
	class I3DShapeInstance extends IWorldInstance {
		zHeight: number;
		shape: Shape3DFaceType;
		zTilingFactor: number;

		getImagePointCount(): number;
		getImagePointX(nameOrIndex: ImagePointParameter): number;
		getImagePointY(nameOrIndex: ImagePointParameter): number;
		getImagePointZ(nameOrIndex: ImagePointParameter): number;
		getImagePoint(nameOrIndex: ImagePointParameter): number[];

		getFaceImagePointCount(face: Shape3DFaceType): number;
		getFaceImagePointX(face: Shape3DFaceType, nameOrIndex: ImagePointParameter): number;
		getFaceImagePointY(face: Shape3DFaceType, nameOrIndex: ImagePointParameter): number;
		getFaceImagePointZ(face: Shape3DFaceType, nameOrIndex: ImagePointParameter): number;
		getFaceImagePoint(face: Shape3DFaceType, nameOrIndex: ImagePointParameter): number[];

		setFaceVisible(face: Shape3DFaceType, isVisible: boolean): void;
		isFaceVisible(face: Shape3DFaceType): boolean;
		setFaceImage(face: Shape3DFaceType, image: Shape3DFaceType): void;
		setFaceObject<InstType extends IInstance>(face: Shape3DFaceType, objectClass: IObjectClass<InstType>): void;
	}

	/** IAdvancedRandomObjectType.d.ts */
	type AdvancedRandomGradientMode = "rgb" | "float";
	type AdvancedRandomProbabilityTableEntry = number | string;

	/** Represents the Advanced Random object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/advanced-random | IAdvancedRandomObjectType documentation } */
	class IAdvancedRandomObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		seed: string;
		octaves: number;

		classic2d(x: number, y: number): number;
		classic3d(x: number, y: number, z: number): number;
		billow2d(x: number, y: number): number;
		billow3d(x: number, y: number, z: number): number;
		ridged2d(x: number, y: number): number;
		ridged3d(x: number, y: number, z: number): number;
		cellular2d(x: number, y: number): number;
		cellular3d(x: number, y: number, z: number): number;
		voronoi2d(x: number, y: number): number;
		voronoi3d(x: number, y: number, z: number): number;

		createGradient(name: string, mode: AdvancedRandomGradientMode): void;
		setCurrentGradient(name: string): void;
		addGradientStop(position: number, value: number): void;
		sampleGradient(name: string | null, value: number): number;

		createProbabilityTable(name: string): void;
		createProbabilityTableFromJSON(name: string, jsonStr: string): void;
		getProbabilityTableAsJSON(): string;
		setCurrentProbabilityTable(name: string): void;
		addProbabilityTableEntry(weight: number, value: AdvancedRandomProbabilityTableEntry): void;
		removeProbabilityTableEntry(weight: number, value: AdvancedRandomProbabilityTableEntry): void;
		sampleProbabilityTable(name?: string): AdvancedRandomProbabilityTableEntry;

		createPermutationTable(length: number, offset: number): void;
		shufflePermutationTable(): void;
		getPermutation(index: number): number;
	}

	/** IArrayInstance.d.ts */
	type ArrayValueType = string | number;

	/** Represents the Array object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/array | IArrayInstance documentation } */
	class IArrayInstance extends IWorldInstance {
		readonly width: number;
		readonly height: number;
		readonly depth: number;

		setSize(w: number, h?: number, d?: number): void;

		getAt(x: number, y?: number, z?: number): ArrayValueType;
		setAt(val: ArrayValueType, x: number, y?: number, z?: number): void;
	}

	/** IAudioObjectType.d.ts */
	/** Represents the Audio object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/audio | IAudioObjectType documentation } */
	class IAudioObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		readonly audioContext: AudioContext;
		readonly destinationNode: AudioDestinationNode;

		isSilent: boolean;
		masterVolume: number;

		stopAll(): void;
	}

	/** IBinaryDataInstance.d.ts */
	/** Represents the Binary Data object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/binary-data | IBinaryDataInstance documentation } */
	class IBinaryDataInstance extends IWorldInstance {
		/** Set the content of the Binary Data by copying the provided ArrayBuffer
		 * or typed array.	 */
		setArrayBufferCopy(viewOrBuffer: ArrayBuffer | TypedArray): void;

		/** Set the content of the Binary Data by assuming ownership of the
		 * provided ArrayBuffer. This does not require copying the data, but
		 * nothing else must use the provided ArrayBuffer beyond this call.	 */
		setArrayBufferTransfer(arrayBuffer: ArrayBuffer): void;

		/** Get the content of the Binary Data object by copying its internal
		 * ArrayBuffer. The returned data is safe to modify.  */
		getArrayBufferCopy(): ArrayBuffer;

		/** Get the content of the Binary Data object by returning a reference
		 * to its internal ArrayBuffer. This is only safe to read - it must not
		 * be modified in any way. If modification is necessary, use getArrayBufferCopy().	 */
		getArrayBufferReadOnly(): ArrayBuffer;
	}

	/** IButtonInstance.d.ts */
	interface ButtonInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": InstanceEvent<InstType>;
	}

	/** Represents the Button object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/button | IButtonInstance documentation } */
	class IButtonInstance extends IDOMInstance {
		addEventListener<K extends keyof ButtonInstanceEventMap<this>>(type: K, listener: (ev: ButtonInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof ButtonInstanceEventMap<this>>(type: K, listener: (ev: ButtonInstanceEventMap<this>[K]) => any): void;

		text: string;
		tooltip: string;
		isEnabled: boolean;
		isChecked: boolean;
	}

	/** ICSVObjectType.d.ts */
	type CsvDataType = "auto" | "string" | "number";

	/** Represents the CSV object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/csv | ICSVObjectType documentation } */
	class ICSVObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		parseCsv(str: string, delimiter?: string, dataType?: CsvDataType): any[];

		generateCsv(arr: any[], delimiter?: string): string;
	}

	/** IDictionaryInstance.d.ts */
	type DictionaryValueType = string | number;

	/** Represents the Dictionary object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/dictionary | IDictionaryInstance documentation } */
	class IDictionaryInstance extends IWorldInstance {
		getDataMap(): Map<string, DictionaryValueType>;
	}

	/** IDrawingCanvasInstance.d.ts */
	type DrawingCanvasGradientDirection = "horizontal" | "vertical";
	type DrawingCanvasLineCap = "butt" | "square";
	type DrawingCanvasColor = number[];
	type DrawingCanvasPoly = Array<Array<number>>;

	interface DrawingCanvasInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"resolutionchange": InstanceEvent<InstType>;
	}

	/** Represents the Drawing Canvas object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/drawing-canvas | IDrawingCanvasInstance documentation } */
	class IDrawingCanvasInstance extends IWorldInstance {
		addEventListener<K extends keyof DrawingCanvasInstanceEventMap<this>>(type: K, listener: (ev: DrawingCanvasInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof DrawingCanvasInstanceEventMap<this>>(type: K, listener: (ev: DrawingCanvasInstanceEventMap<this>[K]) => any): void;

		readonly pixelScale: number;
		readonly surfaceDeviceWidth: number;
		readonly surfaceDeviceHeight: number;
		getSurfaceDeviceSize(): number[];
		setFixedResolutionMode(fixedWidth: number, fixedHeight: number): void;
		setAutoResolutionMode(): void;

		clearCanvas(color: DrawingCanvasColor): void;
		clearRect(left: number, top: number, right: number, bottom: number, color: DrawingCanvasColor): void;
		fillRect(left: number, top: number, right: number, bottom: number, color: DrawingCanvasColor): void;
		fillLinearGradient(left: number, top: number, right: number, bottom: number, color1: DrawingCanvasColor, color2: DrawingCanvasColor, dirStr?: DrawingCanvasGradientDirection): void;
		fillEllipse(x: number, y: number, radiusX: number, radiusY: number, color: DrawingCanvasColor, isSmooth?: boolean): void;
		outlineEllipse(x: number, y: number, radiusX: number, radiusY: number, color: DrawingCanvasColor, thickness: number, isSmooth?: boolean): void;

		outlineRect(left: number, top: number, right: number, bottom: number, color: DrawingCanvasColor, thickness: number): void;
		line(x1: number, y1: number, x2: number, y2: number, color: DrawingCanvasColor, thickness: number, capStr?: DrawingCanvasLineCap): void;
		lineDashed(x1: number, y1: number, x2: number, y2: number, color: DrawingCanvasColor, thickness: number, dashLength: number, capStr?: DrawingCanvasLineCap): void;
		linePoly(polyArr: DrawingCanvasPoly, color: DrawingCanvasColor, thickness: number, capStr?: DrawingCanvasLineCap): void;
		lineDashedPoly(polyArr: DrawingCanvasPoly, color: DrawingCanvasColor, thickness: number, dashLength: number, capStr?: DrawingCanvasLineCap): void;
		fillPoly(polyArr: DrawingCanvasPoly, color: DrawingCanvasColor, isConvex?: boolean): void;
		setDrawBlend(blendMode: BlendModeParameter): void;

		pasteInstances(instances: IWorldInstance[], includeFx?: boolean): Promise<void>;
		getImagePixelData(): Promise<ImageData>;
		loadImagePixelData(imageData: ImageData, premultiplyAlpha?: boolean): void;
	}

	/** IHTMLElementInstance.d.ts */
	type HTMLContentType = "html" | "bbcode" | "text";
	type HTMLSetClassMode = "add" | "toggle" | "remove";
	type HTMLSetAttributeMode = "set" | "remove";
	type HTMLInsertAtType = "start" | "end" | "replace";
	type HTMLScrollDirectionType = "left" | "top";

	interface HTMLInstanceElementEvent<InstType> extends InstanceEvent<InstType> {
		targetId: string;
		targetClass: string;
	}

	interface HTMLInstanceAnimationEvent<InstType> extends HTMLInstanceElementEvent<InstType> {
		animationName: string;
	}

	interface HTMLInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": HTMLInstanceElementEvent<InstType>;
		"animationend": HTMLInstanceAnimationEvent<InstType>;
	}

	/** Represents the HTML Element object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/html-element | IHTMLElementInstance documentation } */
	class IHTMLElementInstance extends IDOMInstance {
		addEventListener<K extends keyof HTMLInstanceEventMap<this>>(type: K, listener: (ev: HTMLInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof HTMLInstanceEventMap<this>>(type: K, listener: (ev: HTMLInstanceEventMap<this>[K]) => any): void;

		setContent(str: string, type?: HTMLContentType, selector?: string, isAll?: boolean): Promise<void>;
		insertContent(str: string, type?: HTMLContentType, atEnd?: boolean, selector?: string, isAll?: boolean): Promise<void>;
		setContentClass(mode: HTMLSetClassMode, classArr: string | string[], selector: string, isAll?: boolean): Promise<void>;
		setContentAttribute(mode: HTMLSetAttributeMode, attrib: string, value: string, selector: string, isAll?: boolean): Promise<void>;
		setContentCssStyle(propName: string, value: string, selector: string, isAll?: boolean): Promise<void>;

		positionInstanceAtElement(inst: IWorldInstance, selector: string): Promise<void>;
		createSpriteImgElement(spriteInst: ISpriteInstance, selector: string, insertAt: HTMLInsertAtType, id?: string, class_?: string): Promise<void>;
		setScrollPosition(selector: string, direction: HTMLScrollDirectionType, position: number): Promise<void>;

		htmlContent: string;
		textContent: string;
	}

	/** IIframeInstance.d.ts */
	class IIframeInstance extends IDOMInstance {
		// no own methods/properties yet
	}

	/** IJSONInstance.d.ts */
	/** Represents the JSON object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/json | IJSONInstance documentation } */
	class IJSONInstance extends IWorldInstance {
		getJsonDataCopy(): any;
		setJsonDataCopy(o: any): void;
		setJsonString(str: string): void;

		toCompactString(): string;
		toBeautifiedString(): string;
	}

	/** IKeyboardObjectType.d.ts */
	type KeyboardKeyOrCode = number | string;

	/** Represents the Keyboard object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/keyboard | IKeyboardObjectType documentation } */
	class IKeyboardObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		isKeyDown(keyOrCode: KeyboardKeyOrCode): boolean;
	}

	/** IListInstance.d.ts */
	interface ListInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": InstanceEvent<InstType>;
		"dblclick": InstanceEvent<InstType>;
		"selectionchange": InstanceEvent<InstType>;
	}

	/** Represents the List object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/list | IListInstance documentation } */
	class IListInstance extends IDOMInstance {
		addEventListener<K extends keyof ListInstanceEventMap<this>>(type: K, listener: (ev: ListInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof ListInstanceEventMap<this>>(type: K, listener: (ev: ListInstanceEventMap<this>[K]) => any): void;

		tooltip: string;
		readonly itemCount: number;

		addItem(text: string): void;
		insertItem(index: number, text: string): void;
		setItemText(index: number, text: string): void;
		getItemText(index: number): string;
		removeItem(index: number): void;
		clear(): void;

		selectedIndex: number;
		readonly selectedCount: number;
		getSelectedIndexAt(index: number): number;
		getSelectedTextAt(index: number): string;
	}

	/** IMouseObjectType.d.ts */
	/** Represents the Mouse object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/mouse | IMouseObjectType documentation } */
	class IMouseObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		getMouseX(layerNameOrNumber?: LayerParameter): number;
		getMouseY(layerNameOrNumber?: LayerParameter): number;
		getMousePosition(layerNameOrNumber?: LayerParameter): number[];
		isMouseButtonDown(button: number): boolean;

		setCursorStyle(cursorStyle: string): void;
		setCursorObjectClass<InstType extends IInstance>(objectClass: IObjectClass<InstType>): void;
	}

	/** IMultiplayerObjectType.d.ts */
	type MultiplayerTransmissionMode = "o" | "r" | "u";
	type MultiplayerMessageType = string | JSONValue | ArrayBuffer;

	interface MultiplayerPeerEvent extends ConstructEvent {
		peerId: string;
		peerAlias: string;
	}

	interface MultiplayerPeerDisconnectEvent extends MultiplayerPeerEvent {
		leaveReason: string;
	}

	interface MultiplayerMessageEvent extends ConstructEvent {
		fromId: string;
		fromAlias: string;
		message: JSONValue | ArrayBuffer;
		transmissionMode: MultiplayerTransmissionMode;
	}

	interface MultiplayerObjectEventMap<InstanceType> {
		"peerconnect": MultiplayerPeerEvent;
		"peerdisconnect": MultiplayerPeerDisconnectEvent;
		"message": MultiplayerMessageEvent;
		"kicked": ConstructEvent;
	}

	/** Represents the Multiplayer object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/multiplayer | IMultiplayerObjectType documentation } */
	class IMultiplayerObjectType<InstType extends IInstance> extends IObjectType<InstType, MultiplayerObjectEventMap<InstType>> {
		readonly signalling: MultiplayerSignallingState;
		readonly stats: MultiplayerStats;

		readonly isHost: boolean;
		readonly myAlias: string;
		readonly myId: string;
		readonly hostAlias: string;
		readonly hostId: string;
		readonly currentGame: string;
		readonly currentGameInstance: string;
		readonly currentRoom: string;

		readonly peerCount: number;
		getAllPeers(): IMultiplayerPeer[];
		getPeerById(id: string): IMultiplayerPeer | null;
		sendPeerMessage(peerId: string, message: MultiplayerMessageType, transmissionMode?: MultiplayerTransmissionMode): void;
		hostBroadcastMessage(fromId: string | null, message: MultiplayerMessageType, transmissionMode?: MultiplayerTransmissionMode): void;

		disconnectRoom(): void;
		simulateLatency(latency: number, pdv: number, loss: number): void;
	}

	/** IMultiplayerPeer.d.ts */
	/** Represents a peer in the Multiplayer object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/multiplayer | IMultiplayerObjectType documentation } */
	class IMultiplayerPeer {
		readonly id: string;
		readonly alias: string;
		readonly isHost: boolean;
		readonly isMe: boolean;

		readonly latency: number;
		readonly pdv: number;

		send(message: MultiplayerMessageType, transmissionMode?: MultiplayerTransmissionMode): void;
	}

	/** MultiplayerSignallingState.d.ts */
	type MultiplayerRoomListType = "all" | "unlocked" | "available";
	type MultiplayerRoomState = "available" | "locked" | "full";

	interface MultiplayerSignallingServerState {
		myId: string;
		serverVersion: string;
		serverName: string;
		serverOperator: string;
		serverMOTD: string;
	}

	interface MultiplayerSignallingLoginResult {
		myAlias: string;
	}

	interface MultiplayerSignallingJoinResult {
		isHost: boolean;
		hostId: string;
		hostAlias: string;
	}

	interface MultiplayerSignallingAutoJoinResult {
		isHost: boolean;
		hostId: string;
		hostAlias: string;
		room: string;
	}

	interface MultiplayerSignallingGameInstanceEntry {
		name: string;
		peerCount: number;
	}

	interface MultiplayerSignallingRoomEntry {
		name: string;
		peerCount: number;
		maxPeerCount: number;
		state: MultiplayerRoomState;
	}

	interface MultiplayerErrorEvent extends ConstructEvent {
		message: string;
	}

	interface MultiplayerSignallingEventMap {
		"connected": MultiplayerSignallingServerState;
		"login": MultiplayerSignallingLoginResult;
		"join": MultiplayerSignallingAutoJoinResult;
		"leave": ConstructEvent;
		"disconnected": ConstructEvent;
		"kicked": ConstructEvent;
		"error": MultiplayerErrorEvent;
	}

	/** Represents the signalling state for the Multiplayer object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/multiplayer | IMultiplayerObjectType documentation } */
	class MultiplayerSignallingState extends ConstructEventTarget<MultiplayerSignallingEventMap> {
		addICEServer(url: string, username?: string, credential?: string): void;
		connect(url?: string): Promise<MultiplayerSignallingServerState>;
		readonly isConnected: boolean;
		disconnect(): void;

		login(alias: string): Promise<MultiplayerSignallingLoginResult>;
		readonly isLoggedIn: boolean;

		joinRoom(game: string, instance: string, room: string, maxClients?: number): Promise<MultiplayerSignallingJoinResult>;
		autoJoinRoom(game: string, instance: string, room: string, maxClients?: number, isLocking?: boolean): Promise<MultiplayerSignallingAutoJoinResult>;
		leaveRoom(): Promise<void>;

		requestGameInstanceList(game: string): Promise<MultiplayerSignallingGameInstanceEntry[]>;
		requestRoomList(game: string, instance: string, type: MultiplayerRoomListType): Promise<MultiplayerSignallingRoomEntry[]>;
	}

	/** MultiplayerStats.d.ts */
	/** Represents statistics for the Multiplayer object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/multiplayer | IMultiplayerObjectType documentation } */
	class MultiplayerStats {
		readonly outboundCount: number;
		readonly outboundBandwidth: number;
		readonly outboundDecompressedBandwidth: number;

		readonly inboundCount: number;
		readonly inboundBandwidth: number;
		readonly inboundDecompressedBandwidth: number;
	}

	/** IParticlesInstance.d.ts */
	/** Represents the Particles object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/particles | IParticlesInstance documentation } */
	class IParticlesInstance extends IWorldInstance {
		isSpraying: boolean;
		rate: number;
		sprayCone: number;
		initSpeed: number;
		initSize: number;
		initOpacity: number;
		initXRandom: number;
		initYRandom: number;
		initSpeedRandom: number;
		initSizeRandom: number;
		initGrowRate: number;
		initGrowRandom: number;
		acceleration: number;
		gravity: number;
		lifeAngleRandom: number;
		lifeSpeedRandom: number;
		lifeOpacityRandom: number;
		timeout: number;
		fastForward(time: number): void;
		setParticleObjectClass<InstType extends IInstance>(objectClass?: IObjectType<InstType>): void;
	}

	/** IProgressBarInstance.d.ts */
	interface ProgressInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": InstanceEvent<InstType>;
	}
	/** Represents the Progress Bar object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/progress-bar | IProgressBarInstance documentation } */
	class IProgressBarInstance extends IDOMInstance {
		addEventListener<K extends keyof ProgressInstanceEventMap<this>>(type: K, listener: (ev: ProgressInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof ProgressInstanceEventMap<this>>(type: K, listener: (ev: ProgressInstanceEventMap<this>[K]) => any): void;

		progress: number;
		maximum: number;
		tooltip: string;
		setIndeterminate(): void;
	}

	/** IQRCodeInstance.d.ts */
	type QRCodeCorrectionLevel = "l" | "m" | "q" | "h";

	class IQRCodeInstance extends IWorldInstance {
		text: string;
		correctionLevel: QRCodeCorrectionLevel;
	}

	/** IShadowLightInstance.d.ts */
	type ShadowLightCastFromMode = "all" | "same-tag" | "different-tag";

	/** Represents the Shadow Light object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/shadow-light | IShadowLightInstance documentation } */
	class IShadowLightInstance extends IWorldInstance {
		lightX: number;
		lightY: number;
		lightHeight: number;
		shadowColor: number[];
		tag: string;
		castFrom: ShadowLightCastFromMode;
	}

	/** ISliderBarInstance.d.ts */
	interface SliderBarInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": InstanceEvent<InstType>;
		"change": InstanceEvent<InstType>;
		"input": InstanceEvent<InstType>;
	}

	/** Represents the Slider Bar object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/slider-bar | ISliderBarInstance documentation } */
	class ISliderBarInstance extends IDOMInstance {
		addEventListener<K extends keyof SliderBarInstanceEventMap<this>>(type: K, listener: (ev: SliderBarInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof SliderBarInstanceEventMap<this>>(type: K, listener: (ev: SliderBarInstanceEventMap<this>[K]) => any): void;

		value: number;
		maximum: number;
		minimum: number;
		step: number;
		tooltip: string;
		isEnabled: boolean;
	}

	/** ISpriteInstance.d.ts */
	type SpriteAnimationFromMode = "current-frame" | "beginning";

	interface SpriteFrameChangeEvent<InstType> extends InstanceEvent<InstType> {
		animationName: string;
		animationFrame: number;
	}

	interface SpriteAnimationEndEvent<InstType> extends InstanceEvent<InstType> {
		animationName: string;
	}

	interface SpriteInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"framechange": SpriteFrameChangeEvent<InstType>;
		"animationend": SpriteAnimationEndEvent<InstType>;
	}

	/** Represents the Sprite object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/sprite | ISpriteInstance documentation } */
	class ISpriteInstance extends IWorldInstance {
		addEventListener<K extends keyof SpriteInstanceEventMap<this>>(type: K, listener: (ev: SpriteInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof SpriteInstanceEventMap<this>>(type: K, listener: (ev: SpriteInstanceEventMap<this>[K]) => any): void;

		getImagePointCount(): number;
		getImagePointX(nameOrIndex: ImagePointParameter): number;
		getImagePointY(nameOrIndex: ImagePointParameter): number;
		getImagePointZ(nameOrIndex: ImagePointParameter): number;
		getImagePoint(nameOrIndex: ImagePointParameter): number[];

		getPolyPointCount(): number;
		getPolyPointX(index: number): number;
		getPolyPointY(index: number): number;
		getPolyPoint(index: number): number[];

		stopAnimation(): void;
		startAnimation(from?: SpriteAnimationFromMode): void;
		setAnimation(name: string, from?: SpriteAnimationFromMode): void;
		getAnimation(name: string): IAnimation | null;
		readonly animation: IAnimation;
		readonly animationName: string;
		animationFrame: number;
		animationFrameTag: string;
		animationSpeed: number;
		animationRepeatToFrame: number;

		readonly imageWidth: number;
		readonly imageHeight: number;
		getImageSize(): number[];

		replaceCurrentAnimationFrame(blob: Blob): Promise<void>;
		setSolidCollisionFilter(isInclusive: boolean, tags: string): void;
	}

	/** ISpriteFontInstance.d.ts */
	/** Represents the Sprite Font object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/spritefont | ISpriteFontInstance documentation } */
	class ISpriteFontInstance extends IWorldInstance {
		text: string;

		typewriterText(str: string, duration: number): void;
		characterScale: number;
		characterSpacing: number;
		lineHeight: number;
		horizontalAlign: TextAlignHorizontalMode;
		verticalAlign: TextAlignVerticalMode;
		wordWrapMode: TextWordWrapMode;
		readAloud: boolean;
		readonly textWidth: number;
		readonly textHeight: number;
		getTextSize(): number[];
		hasTagAtPosition(tag: string, x: number, y: number): boolean;
		getTagAtPosition(x: number, y: number): string;
		getTagCount(tag: string): number;
		getTagPositionAndSize(tag: string, index?: number): TextFragmentPositionAndSize;
	}

	/** ISVGPictureInstance.d.ts */
	/** Represents the SVG Picture object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/svg-picture | ISVGPictureInstance documentation } */
	class ISVGPictureInstance extends IWorldInstance {
		svgUrl: string;

		setSvgUrl(url: string): Promise<void>;
	}

	/** ITextInstance.d.ts */
	/** Represents the Text object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/text | ITextInstance documentation } */
	class ITextInstance extends IWorldInstance {
		text: string;

		typewriterText(str: string, duration: number): void;
		fontFace: string;
		isBold: boolean;
		isItalic: boolean;
		sizePt: number;
		fontColor: number[];
		lineHeight: number;
		horizontalAlign: TextAlignHorizontalMode;
		verticalAlign: TextAlignVerticalMode;
		wordWrapMode: TextWordWrapMode;
		textDirection: TextDirectionMode;
		readAloud: boolean;
		setFixedResolutionMode(fixedScale: number): void;
		setAutoResolutionMode(): void;
		readonly textWidth: number;
		readonly textHeight: number;
		getTextSize(): number[];
		hasTagAtPosition(tag: string, x: number, y: number): boolean;
		getTagAtPosition(x: number, y: number): string;
		getTagCount(tag: string): number;
		getTagPositionAndSize(tag: string, index?: number): TextFragmentPositionAndSize;
		changeIconSet<InstType extends IInstance>(objectClass: IObjectClass<InstType>): void;
		getAsHtmlString(): Promise<string>;
	}

	/** ITextInputInstance.d.ts */
	interface TextInputInstanceEventMap<InstType> extends InstanceEventMap<InstType> {
		"click": InstanceEvent<InstType>;
		"dblclick": InstanceEvent<InstType>;
		"change": InstanceEvent<InstType>;
	}

	/** Represents the Text Input object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/text-input | ITextInputInstance documentation } */
	class ITextInputInstance extends IDOMInstance {
		addEventListener<K extends keyof TextInputInstanceEventMap<this>>(type: K, listener: (ev: TextInputInstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof TextInputInstanceEventMap<this>>(type: K, listener: (ev: TextInputInstanceEventMap<this>[K]) => any): void;

		text: string;
		placeholder: string;
		tooltip: string;
		isEnabled: boolean;
		isReadOnly: boolean;
		maxLength: number;

		scrollToBottom(): void;
	}

	/** ITiledBackgroundInstance.d.ts */
	/** Represents the Tiled Background object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/tiled-background | ITiledBackgroundInstance documentation } */
	class ITiledBackgroundInstance extends IWorldInstance {
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

	/** ITilemapInstance.d.ts */
	/** Represents the Tilemap object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/tilemap | ITilemapInstance documentation } */
	class ITilemapInstance extends IWorldInstance {
		readonly mapWidth: number;
		readonly mapHeight: number;
		getMapSize(): number[];

		readonly mapDisplayWidth: number;
		readonly mapDisplayHeight: number;
		getMapDisplaySize(): number[];

		readonly tileWidth: number;
		readonly tileHeight: number;
		getTileSize(): number[];

		getTileAt(x: number, y: number): number;
		setTileAt(x: number, y: number, tile: number): void;

		replaceImage(blob: Blob): Promise<void>;

		// TODO: TypeScript doesn't appear to recognize this syntax
		static TILE_FLIPPED_HORIZONTAL: number;
		static TILE_FLIPPED_VERTICAL: number;
		static TILE_FLIPPED_DIAGONAL: number;
		static TILE_FLAGS_MASK: number;
		static TILE_ID_MASK: number;
	}

	/** ITimelineControllerObjectType.d.ts */
	/** Represents the Timeline Controller object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/timeline-controller | ITimelineControllerObjectType documentation } */
	class ITimelineControllerObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		setInstances(instances: IWorldInstance | IWorldInstance[], trackId?: string): void;
		play(timeline: string | ITimelineState, tags?: string | string[]): ITimelineState;

		allTimelines(): Iterable<ITimelineState>;
		timelinesByTags(tags: string | string[]): Iterable<ITimelineState>;
	}

	/** ITouchObjectType.d.ts */
	type TouchRequestPermissionType = "orientation" | "motion";
	type TouchRequestPermissionResult = "granted" | "denied";

	/** Represents the Touch object.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/touch | ITouchObjectType documentation } */
	class ITouchObjectType<InstType extends IInstance> extends IObjectType<InstType> {
		requestPermission(type: TouchRequestPermissionType): Promise<TouchRequestPermissionResult>;
	}

	/** AddonSDK.d.ts */
	// Additional type definitions for use with the addon SDK only.

	type IAnyProjectLayout = ILayout;
	type IAnyProjectLayer = ILayer;

	type IConstructProjectObjects = {};
	type IConstructProjectGlobalVariables = {};

	// For DOM side
	class IDOMHandler {
		constructor(iRuntime: IRuntimeInterface, domComponentId: string);

		AddRuntimeMessageHandler(handler: string, callback: (data: JSONValue) => JSONValue | Promise<JSONValue> | void): void;
		AddRuntimeMessageHandlers(arr: Array<[string, (data: JSONValue) => JSONValue | Promise<JSONValue> | void]>): void;

		PostToRuntime(handler: string, data: JSONValue): void;
		PostToRuntimeAsync(handler: string, data: JSONValue): Promise<JSONValue>;
	}

	class IDOMElementHandler extends IDOMHandler {
		constructor(iRuntime: IRuntimeInterface, domComponentId: string);

		AddDOMElementMessageHandler(handler: string, func: (elem: HTMLElement, e: JSONValue) => JSONValue | Promise<JSONValue> | void): void;
		PostToRuntimeElement(handler: string, elementId: number, data?: JSONValue): void;
		CreateElement(elementId: number, e: JSONValue): void;
		DestroyElement(elem: HTMLElement): void;
		UpdateState(elem: HTMLElement, e: JSONValue): void;
	}

	class IRuntimeInterface {
		static AddDOMHandlerClass<T extends IDOMHandler>(clazz: new (iRuntime: IRuntimeInterface) => T): void;

		GetExportType(): PlatformInfoExportType;    // note re-uses type from IPlatformInfoObjectType
	}

	const RuntimeInterface: typeof IRuntimeInterface;
	const DOMHandler: typeof IDOMHandler;
	const DOMElementHandler: typeof IDOMElementHandler;

	/** IAnimation.d.ts */
	/** Represents an animation in an object type.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/ianimation | IAnimation documentation } */
	class IAnimation {
		readonly name: string;
		readonly speed: number;
		readonly isLooping: boolean;
		readonly repeatCount: number;
		readonly repeatTo: number;
		readonly isPingPong: boolean;
		readonly frameCount: number;

		getFrames(): IAnimationFrame[];
		frames(): Iterable<IAnimationFrame>;
	}

	/** IAnimationFrame.d.ts */
	/** Represents an animation frame in an animation.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/ianimationframe | IAnimationFrame documentation } */
	class IAnimationFrame extends IImageInfo {
		readonly duration: number;

		readonly originX: number;
		readonly originY: number;
		getOrigin(): number[];

		getImagePointCount(): number;
		getImagePointX(nameOrIndex: ImagePointParameter): number;
		getImagePointY(nameOrIndex: ImagePointParameter): number;
		getImagePoint(nameOrIndex: ImagePointParameter): number[];

		getPolyPointCount(): number;
		getPolyPointX(index: number): number;
		getPolyPointY(index: number): number;
		getPolyPoint(index: number): number[];

		readonly tag: string;
	}

	/** IAssetManager.d.ts */
	/** Provides access to the project's assets.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/iassetmanager | IAssetManager documentation } */
	class IAssetManager {
		loadImageAsset(iImageInfo: IImageInfo): void;

		readonly isWebMOpusSupported: boolean;

		fetchText(url: string): Promise<string>;
		fetchJson(url: string): Promise<object>;
		fetchBlob(url: string): Promise<Blob>;
		fetchArrayBuffer(url: string): Promise<ArrayBuffer>;
		getProjectFileUrl(url: string): Promise<string>;
		getMediaFileUrl(url: string): Promise<string>;
		readonly mediaFolder: string;

		decodeWebMOpus(audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;

		loadScripts(...urls: string[]): Promise<void>;
		compileWebAssembly(url: string): Promise<WebAssembly.Module>;
		loadStyleSheet(url: string): Promise<void>;
	}

	/** IBehavior.d.ts */
	/** Represents a behavior in a project (the behavior equivalent of a plugin).
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/ibehavior | IBehavior documentation } */
	class IBehavior_ {
		readonly runtime: IRuntime;

		/** Get all instances that use this behavior. The instances could be a mix of
		 * different object types and plugin types. */
		getAllInstances(): IInstance[];

		static getByConstructor(ctor: Function): IBehavior_ | null;
	}

	const IBehavior: typeof IBehavior_;
	/** IBehaviorInstance.d.ts */
	class BehaviorInstanceEvent<InstType, BehInstType> implements ConstructEvent {
		instance: InstType;
		behaviorInstance: BehInstType;
	}

	interface BehaviorInstanceEventMap<InstType, BehInstType> {

	}

	/** Represents an instance of a behavior associated with a specific object instance.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/ibehaviorinstance | IBehaviorInstance documentation } */
	class IBehaviorInstance<InstType> {
		// Note IBehaviorInstance does not derive from ConstructEventTargetDispatcher - it implements it
		// separately to make use of <this> in its type definition (similar to IInstance, but using both
		// <this> and <InstType> for the corresponding instance type).
		addEventListener<K extends keyof BehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: BehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		removeEventListener<K extends keyof BehaviorInstanceEventMap<InstType, this>>(type: K, listener: (ev: BehaviorInstanceEventMap<InstType, this>[K]) => any): void;
		dispatchEvent(evt: ConstructEvent): void;

		readonly runtime: IRuntime;
		readonly behavior: IBehavior_;
		readonly behaviorType: IBehaviorType;
		readonly instance: InstType;
	}

	/** IBehaviorType.d.ts */
	/** Represents a behavior type in a project (the behavior equivalent of an object type). */
	class IBehaviorType {
		readonly runtime: IRuntime;
		readonly behavior: IBehavior_;
		readonly name: string;
	}

	/** ICollisionEngine.d.ts */
	/** Provides access to collision features.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/icollisionengine | IAssetManager documentation } */
	class ICollisionEngine {
		readonly runtime: IRuntime;

		testOverlap(wi1: IWorldInstance, wi2: IWorldInstance): boolean;
		testOverlapAny(wi: IWorldInstance, iterable: Iterable<IWorldInstance>): IWorldInstance | null;
		testOverlapSolid(wi: IWorldInstance): IWorldInstance | null;

		setCollisionCellSize(width: number, height: number): void;
		getCollisionCellSize(): number[];

		getCollisionCandidates(objectClasses: IObjectClass<IWorldInstance> | IObjectClass<IWorldInstance>[], rect: DOMRect): IWorldInstance[];
	}

	/** IDOMInstance.d.ts */
	/** Represents an object instance with an associated DOM element.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/idominstance | IDOMInstance documentation } */
	class IDOMInstance extends IWorldInstance {
		/** Get the corresponding HTML element for this instance. Note this only works
		 * in DOM mode - it will throw an exception in worker mode.    */
		getElement(): HTMLElement;

		focus(): void;
		blur(): void;

		setCssStyle(prop: string, val: string): void;
	}

	/** IEffectInstance.d.ts */
	type EffectParameter = number | number[];

	/** Represents the parameters for a single effect on a IWorldInstance, ILayer or ILayout.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/ieffectinstance | IEffectInstance documentation } */
	class IEffectInstance {
		readonly index: number;
		readonly name: string;
		isActive: boolean;

		setParameter(index: number, value: EffectParameter): void;
		getParameter(index: number): EffectParameter;
	}

	/** IImageInfo.d.ts */
	/** Represents an image in the project.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iimageinfo | IImageInfo documentation } */
	class IImageInfo {
		readonly width: number;
		readonly height: number;
		getSize(): number[];

		// For addon SDK
		getTexture(renderer: IRenderer): ITexture | null;
		getTexRect(): DOMRect;
	}

	/** IInstance.d.ts */
	interface InstanceEvent<InstType = IInstance> extends ConstructEvent {
		instance: InstType;
	}

	interface InstanceDestroyEvent<InstType> extends InstanceEvent<InstType> {
		isEndingLayout: boolean;
	}

	interface InstanceEventMap<InstType> {
		"destroy": InstanceDestroyEvent<InstType>;
	}

	/** Represents a single instance of an object type.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iinstance | IInstance documentation } */
	class IInstance {
		// Note IInstance does not derive from ConstructEventTargetDispatcher - it implements it
		// separately to make use of <this> in its type definition.
		addEventListener<K extends keyof InstanceEventMap<this>>(type: K, listener: (ev: InstanceEventMap<this>[K]) => any): void;
		removeEventListener<K extends keyof InstanceEventMap<this>>(type: K, listener: (ev: InstanceEventMap<this>[K]) => any): void;
		dispatchEvent(evt: ConstructEvent): void;

		readonly runtime: IRuntime;
		readonly objectType: IObjectType<this>;
		readonly plugin: IPlugin_;

		readonly uid: number;
		readonly templateName: string;

		timeScale: number;
		restoreTimeScale(): void;
		readonly dt: number;

		hasTags(...tagsArray: string[]): boolean;
		setAllTags(tagsSet: Set<string>): void;
		getAllTags(): Set<string>;

		destroy(): void;

		getOtherContainerInstances(): IInstance[];
		otherContainerInstances(): Iterable<IInstance>;

		signal(tag: string): void;
		waitForSignal(tag: string): Promise<void>;
	}

	/** ILayer.d.ts */
	/** Represents a layer on a layout in the project.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/layout-interfaces/ilayout/ilayer | ILayer documentation } */
	class ILayer {
		readonly name: string;
		readonly layout: IAnyProjectLayout;
		readonly index: number;

		isVisible: boolean;
		readonly isSelfAndParentsVisible: boolean;
		isInteractive: boolean;
		isHTMLElementsLayer: boolean;
		readonly isSelfAndParentsInteractive: boolean;
		isTransparent: boolean;
		isForceOwnTexture: boolean;

		opacity: number;
		scale: number;
		scaleRate: number;
		angle: number;
		parallaxX: number;
		parallaxY: number;
		zElevation: number;
		blendMode: BlendModeParameter;
		backgroundColor: number[];

		scrollX: number;
		scrollY: number;
		scrollTo(x: number, y: number): void;
		getScrollPosition(): number[];
		restoreScrollPosition(): void;
		getViewport(): DOMRect;

		/** Translate a position in CSS pixels to layer co-ordinates on this layer. */
		cssPxToLayer(clientX: number, clientY: number, z?: number): number[];

		/** Translate a position in layer co-ordinates on this layer to CSS pixels. */
		layerToCssPx(layerX: number, layerY: number, z?: number): number[];

		/** Translate a position on the draw surface to layer co-ordinates on this layer. */
		drawSurfaceToLayer(clientX: number, clientY: number, z?: number): number[];

		/** Translate a position in layer co-ordinates on this layer to the draw surface. */
		layerToDrawSurface(layerX: number, layerY: number, z?: number): number[];

		readonly renderScale: number;

		readonly parentLayer: IAnyProjectLayer | null;
		parentLayers(): Iterable<IAnyProjectLayer>;
		subLayers(): Iterable<IAnyProjectLayer>;
		allSubLayers(): Iterable<IAnyProjectLayer>;
	}

	/** ILayout.d.ts */
	interface LayoutEvent extends ConstructEvent {
		layout: ILayout;
	}

	interface LayoutEventMap {
		"beforelayoutstart": LayoutEvent;
		"afterlayoutstart": LayoutEvent;
		"beforelayoutend": LayoutEvent;
		"afterlayoutend": LayoutEvent;
	}

	type LayerPositionWhere = "above" | "below" | "top-sublayer" | "bottom-sublayer";
	type LayoutProjection = "perspective" | "orthographic";

	/** Represents a layout in the project.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/layout-interfaces/ilayout | ILayout documentation } */
	class ILayout extends ConstructEventTarget<LayoutEventMap> {
		readonly name: string;
		readonly index: number;

		width: number;
		height: number;
		setSize(w: number, h: number): void;
		getSize(): number[];

		scale: number;
		angle: number;
		scrollX: number;
		scrollY: number;
		scrollTo(x: number, y: number): void;
		getScrollPosition(): number[];
		getLayer(nameOrIndex: LayerParameter): IAnyProjectLayer | null;
		getAllLayers(): IAnyProjectLayer[];
		allLayers(): Iterable<IAnyProjectLayer>;

		addLayer(layerName: string, insertBy: ILayer | null, where: LayerPositionWhere): void;
		moveLayer(layer: ILayer, insertBy: ILayer | null, where: LayerPositionWhere): void;
		removeLayer(layer: ILayer): void;
		removeAllDynamicLayers(): void;

		setVanishingPoint(vpX: number, vpY: number): void;
		getVanishingPoint(): number[];

		projection: LayoutProjection;
	}

	/** ILoopingConditionContext.d.ts */
	/** Utility class for creating looping conditions */
	class ILoopingConditionContext {
		retrigger(): void;

		readonly isStopped: boolean;

		release(): void;
	}

	/** IObjectClass.d.ts */
	class ObjectClassInstanceCreateEvent<InstanceType> implements ConstructEvent {
		instance: InstanceType;
	}

	class ObjectClassInstanceDestroyEvent<InstanceType> implements ConstructEvent {
		instance: InstanceType;
	}

	interface ObjectClassEventMap<InstanceType> {
		"instancecreate": ObjectClassInstanceCreateEvent<InstanceType>;
		"instancedestroy": ObjectClassInstanceDestroyEvent<InstanceType>;
	}

	/** A base class for object types or families in the project.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iobjectclass | IObjectClass documentation } */
	class IObjectClass<InstanceType extends IInstance, EventMapType = ObjectClassEventMap<InstanceType>> extends ConstructEventTarget<EventMapType> {
		readonly name: string;

		readonly runtime: IRuntime;
		readonly plugin: IPlugin_;

		/** Get all instances belonging to this object type or family. */
		getAllInstances<InstT extends InstanceType = InstanceType>(): InstT[];

		/** Iterare all instances belonging to this object type or family. */
		instances<InstT extends InstanceType = InstanceType>(): Iterable<InstT>;

		/** Get the first instance of this object type or family (or null if none exist). */
		getFirstInstance<InstT extends InstanceType = InstanceType>(): InstT | null;

		/** Get all the currently picked instances, when called from an event sheet. */
		getPickedInstances<InstT extends InstanceType = InstanceType>(): InstT[];

		/** Return the instance with the same IID, with wraparound, if one exists. */
		getPairedInstance<InstT extends InstanceType = InstanceType>(otherInst: IInstance): InstT | null;

		/** Iterate all currently picked instances, when called from an event sheet. */
		pickedInstances<InstT extends InstanceType = InstanceType>(): Iterable<InstT>;

		/** Get the first picked instance of this object type or family when called
		 * from an event sheet, or null if none is picked. */
		getFirstPickedInstance<InstT extends InstanceType = InstanceType>(): InstT | null;
	}

	/** Represents a family in the project.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iobjectclass | IObjectClass documentation } */
	class IFamily<InstanceType extends IInstance, EventMapType = ObjectClassEventMap<InstanceType>> extends IObjectClass<InstanceType, EventMapType> {
	}

	/** Represents an object type in the project. This is a TypeScript-specific definition,
	 * as the JavaScript API only refers to IObjectClass.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iobjectclass | IObjectClass documentation } */
	class IObjectType<InstanceType extends IInstance, EventMapType = ObjectClassEventMap<InstanceType>> extends IObjectClass<InstanceType, EventMapType> {
		/** Set the instance class for this object type. Used for subclassing.
		 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/guides/subclassing-instances | Subclassing instances} */
		setInstanceClass(Class: Function): void;

		/** Create a new instance of this object type. */
		createInstance<InstT extends InstanceType = InstanceType>(layerNameOrIndex: LayerParameter, x: number, y: number, createHierarchy?: boolean, template?: string): InstT;
	}
	/** IPlatformInfo.d.ts */
	type PlatformInfoExportType = "preview" | "html5" | "scirra-arcade" | "cordova-android" | "cordova-ios" | "nwjs" | "windows-webview2" | "macos-wkwebview" | "xbox-uwp-webview2" | "instant-games" | "playable-ad" | "linux-cef";
	type PlatformInfoOSType = "windows" | "macos" | "linux" | "chrome-os" | "android" | "ios" | "unknown";
	type PlatformInfoBrowserType = "chrome" | "chromium" | "edge" | "opera" | "nwjs" | "firefox" | "safari" | "unknown";
	type PlatformInfoBrowserEngineType = "chromium" | "gecko" | "webkit";

	/** Provides details about the current platform, such as browser, operating system and environment. */
	class IPlatformInfo {
		readonly exportType: PlatformInfoExportType;
		readonly isMobile: boolean;
		readonly os: PlatformInfoOSType;
		readonly osVersion: string;
		readonly browser: PlatformInfoBrowserType;
		readonly browserVersion: string;
		readonly browserEngine: PlatformInfoBrowserEngineType;

		readonly renderer: string;
		readonly rendererDetail: string;

		readonly canvasCssWidth: number;
		readonly canvasCssHeight: number;
		readonly canvasDeviceWidth: number;
		readonly canvasDeviceHeight: number;
		readonly devicePixelRatio: number;
	}

	/** IPlugin.d.ts */
	/** Represents a plugin in a project.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iplugin | IPlugin documentation } */
	class IPlugin_ {
		readonly runtime: IRuntime;

		readonly isSingleGlobal: boolean;
		readonly isWorldType: boolean;
		readonly isHTMLElementType: boolean;
		readonly isRotatable: boolean;
		readonly hasEffects: boolean;
		readonly is3d: boolean;
		readonly supportsHierarchies: boolean;
		readonly supportsMesh: boolean;

		getSingleGlobalObjectType(): IObjectType<IInstance>;
		getSingleGlobalInstance(): IInstance;
		static getByConstructor(ctor: Function): IPlugin_ | null;
	}

	const IPlugin: typeof IPlugin_;

	/** IRenderer.d.ts */
	/** Renderer class for drawing at runtime.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/graphics-interfaces/irenderer-interface | IRenderer documentation } */

	type TextureWrapMode = "clamp-to-edge" | "repeat" | "mirror-repeat";
	type TextureSamplingMode = "nearest" | "bilinear" | "trilinear";
	interface TextureCreateOptions {
		wrapX?: TextureWrapMode,
		wrapY?: TextureWrapMode,
		sampling?: TextureSamplingMode,
		mipMap?: boolean
	}
	interface TextureUpdateOptions {
		premultiplyAlpha?: boolean;
	}
	type TextureUpdateDataType = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | ImageData;

	type RendererLineCapMode = "butt" | "square";

	class IRenderer {
		setAlphaBlendMode(): void;
		setBlendMode(blendMode: BlendModeParameter): void;

		setColorFillMode(): void;
		setTextureFillMode(): void;
		setSmoothLineFillMode(): void;

		setColor(color: number[]): void;
		setColorRgba(r: number, g: number, b: number, a: number): void;
		setOpacity(o: number): void;
		resetColor(): void;

		setCurrentZ(z: number): void;
		getCurrentZ(): void;

		rect(r: DOMRect): void;
		rect2(l: number, t: number, r: number, b: number): void;

		quad(quad: DOMQuad): void;
		quad2(tlx: number, tly: number, trx: number, try_: number, brx: number, bry: number, blx: number, bly: number): void;
		quad3(quad: DOMQuad, rect: DOMRect): void;
		quad4(quad: DOMQuad, texQuad: DOMQuad): void;
		quad3D(tlx: number, tly: number, tlz: number, trx: number, try_: number, trz: number, brx: number, bry: number, brz: number, blx: number, bly: number, blz: number, rect: DOMRect): void;
		quad3D2(tlx: number, tly: number, tlz: number, trx: number, try_: number, trz: number, brx: number, bry: number, brz: number, blx: number, bly: number, blz: number, texQuad: DOMQuad): void;

		drawMesh(posArr: Float32Array, uvArr: Float32Array, indexArr: Uint16Array): void;

		convexPoly(pointsArray: number[]): void;
		line(x1: number, y1: number, x2: number, y2: number): void;
		texturedLine(x1: number, y1: number, x2: number, y2: number, u: number, v: number): void;
		lineRect(l: number, t: number, r: number, b: number): void;
		lineRect2(rect: DOMRect): void;
		lineQuad(quad: DOMQuad): void;

		pushLineWidth(w: number): void;
		popLineWidth(): void;

		pushLineCap(lineCap: RendererLineCapMode): void;
		popLineCap(): void;

		setTexture(texture: ITexture): void;
		createDynamicTexture(width: number, height: number, opts?: TextureCreateOptions): ITexture;
		updateTexture(data: TextureUpdateDataType, texture: ITexture, opts?: TextureUpdateOptions): void;
		deleteTexture(texture: ITexture): void;
		loadTextureForImageInfo(imageInfo: IImageInfo, opts?: TextureCreateOptions): Promise<ITexture>;
		releaseTextureForImageInfo(imageInfo: IImageInfo): void;
		getTextureForImageInfo(imageInfo: IImageInfo): ITexture | null;

		createRendererText(): IRendererText;

		setDeviceTransform(): void;
		setLayerTransform(layer: ILayer): void;
	}

	/** IRendererText.d.ts */
	/** A class used for rendering text in the renderer.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/graphics-interfaces/irenderertext | IRendererText documentation } */
	class IRendererText {
		release(): void;

		fontFace: string;
		sizePt: number;
		lineHeight: number;
		isBold: boolean;
		isItalic: boolean;

		setColor(color: number[]): void;
		setColorRgb(r: number, g: number, b: number): void;
		setCssColor(cssColor: string): void;

		horizontalAlign: TextAlignHorizontalMode;
		verticalAlign: TextAlignVerticalMode;
		wordWrapMode: TextWordWrapMode;
		textDirection: TextDirectionMode;

		text: string;
		setSize(cssWidth: number, cssHeight: number, zoomScale: number): void;

		getTexture(): ITexture | null;
		getTexRect(): DOMRect;
		setTextureUpdateCallback(cb: () => void): void;
		releaseTexture(): void;

		readonly textWidth: number;
		readonly textHeight: number;
	}

	/** IRuntime.d.ts */
	/** The global runOnStartup() function is called by Construct on startup, while the
	 * loading screen is still showing, as the first point of entry in to the engine.
	 * Typically a runtime event listener will be added for the next event of interest,
	 * such as "beforeprojectstart". */
	function runOnStartup(callback: (runtime: IRuntime) => void | Promise<void>): void;

	// General runtime type definitions
	type LayoutParameter = string | number;
	type LayerParameter = string | number;
	type ImagePointParameter = string | number;
	type BlendModeParameter = "normal" | "additive" | "copy" | "destination-over" | "source-in" | "destination-in" | "source-out" | "destination-out" | "source-atop" | "destination-atop";

	type FramerateModeType = "vsync" | "unlimited-tick" | "unlimited-frame";
	type SamplingModeType = "nearest" | "bilinear" | "trilinear";

	type TextAlignHorizontalMode = "left" | "center" | "right";
	type TextAlignVerticalMode = "top" | "center" | "bottom";
	type TextWordWrapMode = "word" | "cjk" | "character";
	type TextDirectionMode = "ltr" | "rtl";

	interface TextFragmentPositionAndSize {
		x: number,
		y: number,
		width: number,
		height: number
	}

	type SDKPropertyType = number | string | boolean;
	type WrapperExtensionParameterType = number | string | boolean;

	type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
	type JSONValue = string | number | boolean | null
		| { [x: string]: JSONValue }
		| Array<JSONValue>;
	type JSONObject = { [x: string]: JSONValue };
	type JSONArray = Array<JSONValue>;

	type CallFunctionParameter = string | number;
	type CallFunctionReturnValue = string | number | null;

	interface ConstructEvent {
	}

	class ConstructEventTarget<EventMapType> {
		addEventListener<K extends keyof EventMapType>(type: K, listener: (ev: EventMapType[K]) => any): void;
		removeEventListener<K extends keyof EventMapType>(type: K, listener: (ev: EventMapType[K]) => any): void;
	}

	class ConstructEventTargetDispatcher<EventMapType> extends ConstructEventTarget<EventMapType> {
		dispatchEvent(evt: ConstructEvent): void;
	}

	interface ConstructResizeEvent extends ConstructEvent {
		cssWidth: number;
		cssHeight: number;
		deviceWidth: number;
		deviceHeight: number;
	}

	interface ConstructPointerEvent extends PointerEvent {
		lastButtons: number;
	}

	interface ConstructSaveEvent extends ConstructEvent {
		saveData: any;
	}

	interface ConstructInstanceCreateEvent extends ConstructEvent {
		instance: IInstance;
	}

	interface ConstructInstanceDestroyEvent extends ConstructEvent {
		instance: IInstance;
		isEndingLayout: boolean;
	}

	interface RuntimeEventMap {
		"resize": ConstructResizeEvent;
		"tick": ConstructEvent;
		"beforeprojectstart": ConstructEvent;
		"afterprojectstart": ConstructEvent;
		"beforeanylayoutstart": LayoutEvent;
		"afteranylayoutstart": LayoutEvent;
		"beforeanylayoutend": LayoutEvent;
		"afteranylayoutend": LayoutEvent;
		"keydown": KeyboardEvent;
		"keyup": KeyboardEvent;
		"mousedown": MouseEvent;
		"mousemove": MouseEvent;
		"mouseup": MouseEvent;
		"dblclick": MouseEvent;
		"wheel": WheelEvent;
		"pointerdown": ConstructPointerEvent;
		"pointermove": ConstructPointerEvent;
		"pointerup": ConstructPointerEvent;
		"pointercancel": ConstructPointerEvent;
		"deviceorientation": DeviceOrientationEvent;
		"devicemotion": DeviceMotionEvent;
		"save": ConstructSaveEvent;
		"load": ConstructSaveEvent;
		"afterload": ConstructEvent;
		"instancecreate": ConstructInstanceCreateEvent;
		"instancedestroy": ConstructInstanceDestroyEvent;
	}

	/** Represents the Construct engine itself, and is the main entry point in to various Construct APIs.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/iruntime | IRuntime documentation } */
	class IRuntime extends ConstructEventTarget<RuntimeEventMap> {
		readonly objects: IConstructProjectObjects;
		readonly globalVars: IConstructProjectGlobalVariables;

		readonly assets: IAssetManager;
		readonly collisions: ICollisionEngine;
		readonly storage: IStorage;
		readonly keyboard?: IKeyboardObjectType<IInstance>;
		readonly mouse?: IMouseObjectType<IInstance>;
		readonly touch?: ITouchObjectType<IInstance>;
		readonly platformInfo: IPlatformInfo;
		readonly sdk: ISDKUtils;

		readonly layout: IAnyProjectLayout;
		getLayout(nameOrIndex: LayoutParameter): IAnyProjectLayout;
		getAllLayouts(): IAnyProjectLayout[];
		goToLayout(nameOrIndex: LayoutParameter): void;

		readonly projectName: string;
		readonly projectVersion: string;
		readonly isInWorker: boolean;
		readonly viewportWidth: number;
		readonly viewportHeight: number;
		getViewportSize(): number[];

		readonly sampling: SamplingModeType;
		readonly isPixelRoundingEnabled: boolean;

		get dt(): number;
		get dtRaw(): number;
		get gameTime(): number;
		get wallTime(): number;
		timeScale: number;
		get isSuspended(): boolean;

		/**
		 * @deprecated Use framesPerSecond instead of fps
		 */
		get fps(): number;

		get framesPerSecond(): number;
		get ticksPerSecond(): number;
		get cpuUtilisation(): number;
		get gpuUtilisation(): number;
		framerateMode: FramerateModeType;
		minDt: number;
		maxDt: number;

		getInstanceByUid(uid: number): IInstance | null;
		sortZOrder(iterable: Iterable<IWorldInstance>, callback: (a: IWorldInstance, b: IWorldInstance) => number): void;

		/** Call a function in an event sheet, by a case-insensitive string of its name.
		 * Each parameter provided for 'params' is passed to the function.
		 * There must be at least as many parameters provided as the function uses,
		 * although any additional parameters will be ignored. If the function has a
		 * return value, it will be returned from this method, else it returns null. */
		callFunction(name: string, ...params: CallFunctionParameter[]): CallFunctionReturnValue;

		signal(tag: string): void;
		waitForSignal(tag: string): Promise<void>;

		/** When called from an event sheet, sets the current function return value,
		 * much like the 'Set return value' action.	 */
		setReturnValue(value: number | string): void;

		/** Return a random number in the range [0, 1). This is similar to Math.random(),
		 * but can produce a deterministic sequence of values if the Advanced Random object
		 * overrides the system random. */
		random(): number;

		/** Runtime wrapper for creating a Web Worker, avoiding some issues with browser bugs and
		 * nested workers.
		 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/guides/creating-workers | Creating workers} */
		createWorker(url: string, opts?: WorkerOptions): Promise<MessagePort>;

		/** Invoke a browser download of the content at the given URL, using the provided filename. */
		invokeDownload(url: string, filename: string): void;

		/** Runtime wrapper for alert() method which can be used in worker mode. */
		alert(message: string): Promise<void>;

		getHTMLLayer(index: number): HTMLElement;

		/**
		 * @deprecated Use runtime.sdk.addLoadPromise() instead of runtime.addLoadPromise()
		 */
		addLoadPromise(promise: Promise<void>): void;
	}

	/** ISDKBehaviorBase.d.ts */
	/** SDK base class for a behavior.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkbehaviorbase | ISDKBehaviorBase documentation } */
	class ISDKBehaviorBase_ extends IBehavior_ {

	}

	const ISDKBehaviorBase: typeof ISDKBehaviorBase_;

	/** ISDKBehaviorInstanceBase.d.ts */
	/** SDK base class for a behavior instance.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkbehaviorinstancebase | ISDKBehaviorInstanceBase documentation } */
	class ISDKBehaviorInstanceBase_<InstType> extends IBehaviorInstance<InstType> {
		_postCreate(): void;
		_release(): void;
		_getInitProperties(): SDKPropertyType[];
		_trigger(method: Function): void;
		_triggerAsync(method: Function): Promise<void>;

		_setTicking(isTicking: boolean): void;
		_setTicking2(isTicking: boolean): void;
		_setPostTicking(isTicking: boolean): void;
		_isTicking(): boolean;
		_isTicking2(): boolean;
		_isPostTicking(): boolean;

		_tick(): void;
		_tick2(): void;
		_postTick(): void;

		_getDebuggerProperties(): any[];

		_saveToJson(): JSONValue;
		_loadFromJson(o: JSONValue): void;
	}

	const ISDKBehaviorInstanceBase: typeof ISDKBehaviorInstanceBase_;

	/** ISDKBehaviorTypeBase.d.ts */
	/** SDK base class for a behavior type.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkbehaviortypebase | ISDKBehaviorTypeBase documentation } */
	class ISDKBehaviorTypeBase_ extends IBehaviorType {
		_onCreate(): void;
	}

	const ISDKBehaviorTypeBase: typeof ISDKBehaviorTypeBase_;

	/** ISDKDOMInstanceBase.d.ts */
	/** SDK base class for an instance that creates a HTML element.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkdominstancebase | ISDKDOMInstanceBase documentation } */
	class ISDKDOMInstanceBase_ extends ISDKWorldInstanceBase {
		constructor(opts: { domComponentId: string });

		_postToDOMElement(handler: string, data: JSONValue): void;
		_postToDOMElementAsync(handler: string, data: JSONValue): Promise<JSONValue>;
		_postToDOMElementMaybeSync(handler: string, data: JSONValue): void;

		_createElement(data?: JSONValue): void;
		_getElementState(): JSONValue;
		_updateElementState(): void;

		focusElement(): void;
		blurElement(): void;
		isElementFocused(): boolean;

		setElementVisible(isVisible: boolean): void;

		setElementCSSStyle(prop: string, val: string): void;

		setElementAttribute(attribName: string, value: string): void;
		removeElementAttribute(attribName: string): void;

		_getElementInDOMMode(): HTMLElement;
	}

	const ISDKDOMInstanceBase: typeof ISDKDOMInstanceBase_;

	/** ISDKDOMPluginBase.d.ts */
	/** SDK base class for a plugin that creates a HTML element.
	 * @see {@link hhttps://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkdompluginbase | ISDKDOMPluginBase documentation } */

	class ISDKDOMPluginBase_ {
		constructor(opts: { domComponentId: string });

		_addElementMessageHandler<InstType>(handler: string, func: (inst: InstType, e: JSONValue) => void): void;
		_addElementMessageHandlers<InstType>(arr: Array<[string, (inst: InstType, e: JSONValue) => void]>): void;
	}

	// TypeScript magic to make classes available on globalThis
	const ISDKDOMPluginBase: typeof ISDKDOMPluginBase_;

	/** ISDKInstanceBase.d.ts */
	/** SDK base class for an object instance.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkinstancebase | ISDKInstanceBase documentation } */

	// HACK: TypeScript doesn't seem to have good support for mixins yet.
	// As a workaround, the members of ISDKInstanceBase_ are defined twice: once deriving
	// from IInstance, and again deriving from IWorldInstance.
	class ISDKInstanceBase_ extends IInstance {
		constructor(opts?: { domComponentId?: string, wrapperComponentId?: string });

		readonly objectType: ISDKObjectTypeBase_<this>;

		_release(): void;
		_getInitProperties(): SDKPropertyType[];
		_trigger(method: Function): void;
		_triggerAsync(method: Function): Promise<void>;

		_setTicking(isTicking: boolean): void;
		_setTicking2(isTicking: boolean): void;
		_isTicking(): boolean;
		_isTicking2(): boolean;

		_tick(): void;
		_tick2(): void;

		_getDebuggerProperties(): any[];

		_saveToJson(): JSONValue;
		_loadFromJson(o: JSONValue): void;

		// DOM methods
		_addDOMMessageHandler(handler: string, callback: (e: JSONValue) => void): void;
		_addDOMMessageHandlers(arr: Array<[string, (e: JSONValue) => void]>): void;

		_postToDOM(handler: string, data?: JSONValue): void;
		_postToDOMAsync(handler: string, data?: JSONValue): Promise<JSONValue>;
		_postToDOMMaybeSync(handler: string, data?: JSONValue): void;

		// Wrapper extension methods
		_isWrapperExtensionAvailable(): boolean;
		_addWrapperExtensionMessageHandler(messageId: string, callback: (e: JSONValue) => void): void;
		_addWrapperMessageHandlers(arr: Array<[string, (e: JSONValue) => void]>): void;

		_sendWrapperExtensionMessage(messageId: string, params?: WrapperExtensionParameterType[]): void;
		_sendWrapperExtensionMessageAsync(messageId: string, params?: WrapperExtensionParameterType[]): Promise<JSONValue>;
	}

	class IWorldInstanceSDKBase_ extends IWorldInstance {
		readonly objectType: ISDKObjectTypeBase_<this>;

		_release(): void;
		_getInitProperties(): SDKPropertyType[];
		_trigger(method: Function): void;

		_setTicking(isTicking: boolean): void;
		_setTicking2(isTicking: boolean): void;
		_isTicking(): boolean;
		_isTicking2(): boolean;

		_tick(): void;
		_tick2(): void;

		_getDebuggerProperties(): any[];

		_saveToJson(): JSONValue;
		_loadFromJson(o: JSONValue): void;

		// DOM methods
		_addDOMMessageHandler(handler: string, callback: (e: JSONValue) => void): void;
		_addDOMMessageHandlers(arr: Array<[string, (e: JSONValue) => void]>): void;

		_postToDOM(handler: string, data: JSONValue): void;
		_postToDOMAsync(handler: string, data: JSONValue): Promise<JSONValue>;
		_postToDOMMaybeSync(handler: string, data: JSONValue): void;

		// Wrapper extension methods
		_isWrapperExtensionAvailable(): boolean;
		_addWrapperExtensionMessageHandler(messageId: string, callback: (e: JSONValue) => void): void;
		_addWrapperMessageHandlers(arr: Array<[string, (e: JSONValue) => void]>): void;

		_sendWrapperExtensionMessage(messageId: string, params?: WrapperExtensionParameterType[]): void;
		_sendWrapperExtensionMessageAsync(messageId: string, params?: WrapperExtensionParameterType[]): Promise<JSONValue>;
	}

	var ISDKInstanceBase: typeof ISDKInstanceBase_;
	const IWorldInstanceSDKBase: typeof IWorldInstanceSDKBase_;

	/** ISDKObjectTypeBase.d.ts */
	/** SDK base class for an object type.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkobjecttypebase | ISDKObjectTypeBase documentation } */
	class ISDKObjectTypeBase_<InstanceType extends IInstance> extends IObjectType<InstanceType> {
		_onCreate(): void;

		getImageInfo(): IImageInfo;

		_loadTextures(renderer: IRenderer): Promise<any>;
		_releaseTextures(renderer: IRenderer): void;
		_onDynamicTextureLoadComplete(): void;
		_preloadTexturesWithInstances(renderer: IRenderer): void;
	}

	var ISDKObjectTypeBase: typeof ISDKObjectTypeBase_;

	type ActsType = {
		[key: string]: (...args: any[]) => void;
	}

	type CndsType = {
		[key: string]: (...args: any[]) => boolean;
	}

	type ExpsType = {
		[key: string]: (...args: any[]) => string | number;
	}
	
	/** ISDKPluginBase.d.ts */
	/** SDK base class for a plugin.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkbehaviorbase | ISDKPluginBase documentation } */
	class ISDKPluginBase_ extends IPlugin_ {
		static Type: typeof ISDKObjectTypeBase;
		static Instance: typeof ISDKInstanceBase;
		
		static Acts: ActsType;
		static Cnds: CndsType;
		static Exps: ExpsType;
	}

	var ISDKPluginBase: typeof ISDKPluginBase_;

	/** ISDKUtils.d.ts */
	/** Utility class for scripting APIs intended for the Addon SDK. */
	class ISDKUtils {
		addLoadPromise(promise: Promise<void>): void;

		sendWrapperExtensionMessage(wrapperComponentId: string, messageId: string, params?: WrapperExtensionParameterType[]): void;
		sendWrapperExtensionMessageAsync(wrapperComponentId: string, messageId: string, params?: WrapperExtensionParameterType[]): Promise<JSONValue>;

		createLoopingConditionContext(loopName?: string): ILoopingConditionContext;

		isAutoSuspendEnabled: boolean;
		setSuspended(isSuspended: boolean): void;

		getObjectClassBySid(sid: number): IObjectClass<IInstance>;
	}

	/** ISDKWorldInstanceBase.d.ts */
	/** SDK base class for a world instance.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/isdkworldinstancebase | ISDKWorldInstanceBase documentation } */
	class ISDKWorldInstanceBase_ extends IWorldInstanceSDKBase {
		_handleRendererContextLoss(): void;

		_onRendererContextLost(): void;
		_onRendererContextRestored(): void;
	}

	const ISDKWorldInstanceBase: typeof ISDKWorldInstanceBase_;

	/** IStorage.d.ts */
	/** Provides access to storage for the project.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/istorage | IStorage documentation } */
	class IStorage {
		getItem(key: string): Promise<unknown>;
		setItem(key: string, value: unknown): Promise<void>;
		removeItem(key: string): Promise<void>;
		clear(): Promise<void>;
		keys(): Promise<string[]>;
	}

	/** ITexture.d.ts */
	/** Represents a texture created by the renderer.
	 * @see {@link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/graphics-interfaces/itexture | ITexture documentation } */
	class ITexture {
		readonly width: number;
		readonly height: number;
	}

	/** ITimelineState.d.ts */
	/** Represents an actively running timeline.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/itimelinestate | ITimelineState documentation } */
	class ITimelineState extends ITimelineStateBase {
		readonly name: string;
	}

	/** ITimelineStateBase.d.ts */
	/** Base class of an actively running timeline or tween.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/itimelinestatebase | ITimelineStateBase documentation } */
	class ITimelineStateBase {
		pause(): void;
		resume(): void;
		stop(): void;
		hasTags(tags: string): boolean;
		time: number;
		totalTime: number;
		isLooping: boolean;
		isPingPong: boolean;
		playbackRate: number;

		readonly progress: number;
		readonly tags: string;
		readonly finished: Promise<void>;
		readonly isPlaying: boolean;
		readonly isPaused: boolean;
		readonly isReleased: boolean;
	}

	/** ITweenState.d.ts */
	/** Represents an actively running tween.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/interfaces/itweenstate | ITweenState documentation } */
	class ITweenState extends ITimelineStateBase {
		stop(): void;
		setEase(easeName: string): void;
		readonly instance: IWorldInstance;
		isDestroyOnComplete: boolean;
		readonly value: number;
	}

	/** IWorldInstance.d.ts */
	// Hierarchy options returned by getHierarchyOpts()
	interface SceneGraphHierarchyOpts {
		transformX: boolean;
		transformY: boolean;
		transformWidth: boolean;
		transformHeight: boolean;
		transformAngle: boolean;
		transformZElevation: boolean;
		transformOpacity: boolean;
		transformVisibility: boolean;
		destroyWithParent: boolean;
	}

	// Options for addChild(), based on SceneGraphHierarchyOpts but making every property optional
	type SceneGraphAddChildOpts = Partial<SceneGraphHierarchyOpts>;

	// Options for setMeshPoint()
	interface SetMeshPointOpts {
		mode?: "absolute" | "relative";
		x: number;
		y: number;
		zElevation?: number;
		u?: number;
		v?: number;
	}

	// Options returned by getMeshPoint()
	interface GetMeshPointOpts {
		x: number;
		y: number;
		zElevation: number;
		u: number;
		v: number;
	}

	/** Represents an instance of an object that appears in a layout.
	 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/object-interfaces/iworldinstance | IWorldInstance documentation } */
	class IWorldInstance extends IInstance {
		readonly layout: IAnyProjectLayout;
		readonly layer: IAnyProjectLayer;

		x: number;
		y: number;
		setPosition(x: number, y: number): void;
		getPosition(): number[];
		offsetPosition(dx: number, dy: number): void;

		zElevation: number;
		readonly totalZElevation: number;

		width: number;
		height: number;
		setSize(w: number, h: number): void;
		getSize(): number[];

		angle: number;
		angleDegrees: number;

		getBoundingBox(): DOMRect;
		getBoundingQuad(): DOMQuad;
		isOnScreen(): boolean;

		isVisible: boolean;
		opacity: number;
		colorRgb: number[];
		blendMode: BlendModeParameter;
		effects: IEffectInstance[];

		moveToTop(): void;
		moveToBottom(): void;
		moveToLayer(layer: ILayer): void;
		moveAdjacentToInstance(otherInst: IWorldInstance, isAfter: boolean): void;
		readonly zIndex: number;

		isCollisionEnabled: boolean;
		containsPoint(x: number, y: number): boolean;
		testOverlap(inst: IWorldInstance): boolean;
		testOverlapSolid(): IWorldInstance | null;

		getParent(): IWorldInstance | null;
		getTopParent(): IWorldInstance | null;
		parents(): Iterable<IWorldInstance>;
		getChildCount(): number;
		getChildAt(index: number): IWorldInstance | null;
		children(): Iterable<IWorldInstance>;
		allChildren(): Iterable<IWorldInstance>;
		addChild(child: IWorldInstance, opts?: SceneGraphAddChildOpts): void;
		removeChild(child: IWorldInstance): void;
		removeFromParent(): void;
		getHierarchyOpts(): SceneGraphHierarchyOpts;

		createMesh(hsize: number, vsize: number): void;
		releaseMesh(): void;
		setMeshPoint(col: number, row: number, opts: SetMeshPointOpts): void;
		getMeshPoint(col: number, row: number): GetMeshPointOpts;
		getMeshSize(): number[];
	}

	/** sdk.d.ts */
	namespace SDK {
		const Plugins: {
			[key: string]: typeof ISDKPluginBase_;
		};
		const Behaviors: {
			[key: string]: typeof IBehaviorBase;
		};
	}

	namespace C3 {
		function compare(a: number, cmp: number, b: number): boolean;

		const Plugins: {
			[key: string]: typeof ISDKPluginBase;
		};
		const Behaviors: {
			[key: string]: typeof ISDKBehaviorBase;
		};

		class Event {
			constructor(name: string, isCancelable?: boolean);
		}
	}

}

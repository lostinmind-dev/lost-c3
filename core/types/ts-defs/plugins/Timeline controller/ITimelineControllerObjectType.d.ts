
/** Represents the Timeline Controller object.
 * @see {@link https://www.construct.net/make-games/manuals/construct-3/scripting/scripting-reference/plugin-interfaces/timeline-controller | ITimelineControllerObjectType documentation } */
declare class ITimelineControllerObjectType<InstType extends IInstance> extends IObjectType<InstType>
{
	setInstances(instances: IWorldInstance | IWorldInstance[], trackId?: string): void;
	play(timeline: string | ITimelineState, tags?: string | string[]): ITimelineState;

	allTimelines(): Iterable<ITimelineState>;
	timelinesByTags(tags: string | string[]): Iterable<ITimelineState>;
}

import type { Query } from "./query";
import type { EntityId, Id } from "./types";
import type { World } from "./world";

export type ComponentType<T> = T extends Id<infer U> ? U : never;

export type System<Args extends unknown[] = []> = (
	world: World,
	...args: Args
) => void;

export function createSystem<T extends unknown[]>(
	query: Query<T>,
	callback: (entity: EntityId, ...components: T) => void,
): System {
	return (_world: World) => {
		query.each(callback);
	};
}

export function runSystems(world: World, ...systems: System[]): () => void {
	return () => {
		for (const sys of systems) sys(world);
	};
}

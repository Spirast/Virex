import type { Query } from "./query";
import type { EntityId, Id } from "./types";
import type { World } from "./world";

/**
 * Extracts the component type from a component ID.
 * Useful for type inference when working with component IDs.
 *
 * @template T - The component ID type
 *
 * @example
 * ```typescript
 * const Position = component<{x: number, y: number}>("Position");
 * type PositionType = ComponentType<typeof Position>; // {x: number, y: number}
 * ```
 */
export type ComponentType<T> = T extends Id<infer U> ? U : never;

/**
 * Represents a system function that operates on a world.
 * Systems are the main logic units in ECS that process entities with specific components.
 *
 * @template Args - Additional argument types that the system accepts
 *
 * @example
 * ```typescript
 * const movementSystem: System = (world) => {
 *   world.query(Position, Velocity).each((entity, position, velocity) => {
 *     position.x += velocity.x;
 *     position.y += velocity.y;
 *   });
 * };
 * ```
 */
export type System<Args extends unknown[] = []> = (
	world: World,
	...args: Args
) => void;

/**
 * Creates a system from a query and callback.
 * Note: This function is deprecated and not finished yet.
 *
 * @template T - Component types the query operates on
 * @param query - The query to find entities
 * @param callback - Function to call for each matching entity
 * @returns A system function
 *
 * @deprecated Not finished yet
 */
export function createSystem<T extends unknown[]>(
	query: Query<T>,
	callback: (entity: EntityId, ...components: T) => void,
): System {
	return (_world: World) => {
		query.each(callback);
	};
}

/**
 * Creates a function that runs multiple systems.
 * Note: This function is deprecated and not finished yet.
 *
 * @param world - The world to run systems on
 * @param systems - Array of systems to run
 * @returns A function that runs all systems when called
 *
 * @deprecated Not finished yet
 */
export function runSystems(world: World, ...systems: System[]): () => void {
	return () => {
		for (const sys of systems) sys(world);
	};
}

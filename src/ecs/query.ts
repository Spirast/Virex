import type { EntityId, Id } from "./types";

/**
 * Represents a query that can filter and iterate over entities with specific components.
 * Queries are immutable and can be chained to build complex filters.
 *
 * @template T - Tuple of component types that this query returns
 *
 * @example
 * ```typescript
 * // Query for all entities with Position and Velocity components
 * const movingEntities = world.query(Position, Velocity);
 *
 * // Further filter to exclude entities with Static component
 * const dynamicMoving = movingEntities.without(Static);
 *
 * // Add additional required component
 * const movingWithHealth = dynamicMoving.with(Health);
 *
 * // Iterate over results
 * movingWithHealth.each((entity, position, velocity, health) => {
 *   // Process each entity
 * });
 * ```
 */
export interface Query<T extends unknown[]> {
	/**
	 * Adds additional required components to this query.
	 * Returns a new query that requires all current components plus the new ones.
	 *
	 * @template U - Additional component types to require
	 * @param components - Component IDs to add as requirements
	 * @returns A new query with the additional required components
	 *
	 * @example
	 * ```typescript
	 * const query = world.query(Position);
	 * const withVelocity = query.with(Velocity);
	 * const withHealth = withVelocity.with(Health);
	 * ```
	 */
	with<U extends unknown[]>(
		...components: { [K in keyof U]: Id<U[K]> }
	): Query<[...T, ...U]>;

	/**
	 * Adds excluded components to this query.
	 * Entities that have any of these components will be filtered out.
	 *
	 * @param components - Component IDs to exclude
	 * @returns A new query with the exclusions applied
	 *
	 * @example
	 * ```typescript
	 * const query = world.query(Position, Velocity);
	 * const nonStatic = query.without(Static, Disabled);
	 * ```
	 */
	without(...components: Id[]): Query<T>;

	/**
	 * Iterates over all entities matching this query and calls the callback for each.
	 *
	 * @param callback - Function to call for each matching entity
	 *
	 * @example
	 * ```typescript
	 * query.each((entity, position, velocity) => {
	 *   position.x += velocity.x;
	 *   position.y += velocity.y;
	 * });
	 * ```
	 */
	each(callback: (entity: EntityId, ...components: T) => void): void;

	/**
	 * Collects all matching entities and their components into an array.
	 *
	 * @returns Array of tuples containing [entityId, ...components]
	 *
	 * @example
	 * ```typescript
	 * const results = query.collect();
	 * for (const [entity, position, velocity] of results) {
	 *   // Process each result
	 * }
	 * ```
	 */
	collect(): Array<[EntityId, ...T]>;

	/**
	 * Maps each query result to a new value using the provided function.
	 *
	 * @template U - The return type of the mapping function
	 * @param fn - Function to transform each query result
	 * @returns Array of mapped values
	 *
	 * @example
	 * ```typescript
	 * const positions = query.map(([entity, position]) => position);
	 * const speeds = query.map(([entity, position, velocity]) =>
	 *   math.sqrt(velocity.x^2 + velocity.y^2)
	 * );
	 * ```
	 */
	map<U>(fn: (entry: [EntityId, ...T]) => U): U[];

	/**
	 * Filters query results using the provided predicate function.
	 *
	 * @param fn - Function that returns true to keep the result, false to filter it out
	 * @returns Array of filtered results
	 *
	 * @example
	 * ```typescript
	 * const fastEntities = query.filter(([entity, position, velocity]) => {
	 *   return math.sqrt(velocity.x^2 + velocity.y^2) > 10;
	 * });
	 * ```
	 */
	filter(fn: (entry: [EntityId, ...T]) => boolean): Array<[EntityId, ...T]>;
}

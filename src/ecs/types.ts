/**
 * Represents a callback function that accepts arguments of type T.
 *
 * @template T - Array of argument types the callback accepts
 */
export type Callback<T extends unknown[]> = (...args: T) => void;

/**
 * Represents a disposable resource that can be cleaned up.
 * Commonly used for event connections and other resources that need explicit cleanup.
 *
 * @example
 * ```typescript
 * const connection = event.connect(callback);
 * // Later...
 * connection.Disconnect(); // Clean up the connection
 * ```
 */
export interface IDisposable {
	/**
	 * Disconnects or disposes of this resource.
	 * After calling this method, the resource should no longer be used.
	 */
	Disconnect(): void;
}

/**
 * Represents a snapshot of the world state at a specific point in time.
 * Snapshots contain entity states and component values that can be restored later.
 *
 * @example
 * ```typescript
 * const snapshot = world.snapshot();
 * // ... make changes to the world ...
 * world.revert(snapshot); // Restore to the snapshot state
 * ```
 */
export interface Snapshot {
	/** Unique identifier for this snapshot */
	id: number;

	/** Timestamp when the snapshot was created */
	timestamp: number;

	/** Map of entity IDs to their component states at the time of the snapshot */
	entityStates: Map<EntityId, Map<Id, unknown>>;

	/** Optional array of component IDs that were included in this snapshot */
	components?: Id[];
}

/**
 * Represents a unique entity identifier.
 * Entity IDs are opaque handles that should be treated as unique values.
 *
 * @example
 * ```typescript
 * const entity = world.spawn();
 * console.log(entity); // Some number value
 * ```
 */
export type EntityId = number & { readonly __brand: unique symbol };

/**
 * Represents a component identifier with associated type information.
 * Component IDs are used to identify and type component data.
 *
 * @template T - The type of data this component holds
 *
 * @example
 * ```typescript
 * const Position = component<{x: number, y: number}>("Position");
 * // Position is of type Id<{x: number, y: number}>
 * ```
 */
export type Id<T = unknown> = number & { readonly __type?: T };

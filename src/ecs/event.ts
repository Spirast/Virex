import type { Callback, IDisposable } from "./types";

/**
 * Event system for managing pub/sub communication between different parts of the ECS.
 * Provides a type-safe way to connect callbacks and fire events with specific argument types.
 *
 * @template T - Array of argument types that this event will emit
 *
 * @example
 * ```typescript
 * const onDamage = Event<[entityId: EntityId, damage: number]>();
 *
 * // Connect a listener
 * const connection = onDamage.connect((entity, damage) => {
 *   console.log(`Entity ${entity} took ${damage} damage`);
 * });
 *
 * // Fire the event
 * onDamage.fire(entityId, 25);
 *
 * // Disconnect when done
 * connection.Disconnect();
 * ```
 */
export class Event<T extends unknown[] = []> {
	/**
	 * Map of connection IDs to their associated callbacks
	 */
	private connections: Map<number, Callback<T>> = new Map();

	/**
	 * Counter for generating unique connection IDs
	 */
	private nextId = 0;

	/**
	 * Connects a callback function to this event.
	 *
	 * @param callback - Function to call when this event is fired
	 * @returns A disposable connection that can be used to disconnect the callback
	 *
	 * @example
	 * ```typescript
	 * const connection = event.connect((data) => {
	 *   console.log('Event fired:', data);
	 * });
	 * ```
	 */
	public connect(callback: Callback<T>): IDisposable {
		const id = this.nextId++;
		this.connections.set(id, callback);
		const connections = this.connections;
		return {
			Disconnect() {
				connections.delete(id);
			},
		};
	}

	/**
	 * Fires the event, calling all connected callbacks with the provided arguments.
	 *
	 * @param args - Arguments to pass to all connected callbacks
	 * @returns This event instance for chaining
	 *
	 * @example
	 * ```typescript
	 * event.fire("hello", 42);
	 * ```
	 */
	public fire(...args: T): this {
		this.connections.forEach((cb) => {
			cb(...args);
		});
		return this;
	}

	/**
	 * Creates a promise that resolves when this event is fired next.
	 * Automatically disconnects after the first event.
	 *
	 * @returns Promise that resolves with the event arguments
	 *
	 * @example
	 * ```typescript
	 * const result = await event.wait();
	 * console.log('Event fired with:', result);
	 * ```
	 */
	public wait(): Promise<T> {
		return new Promise((resolve) => {
			const conn = this.connect((...args: T) => {
				conn.Disconnect();
				resolve(args);
			});
		});
	}

	/**
	 * Disconnects all connected callbacks from this event.
	 *
	 * @example
	 * ```typescript
	 * event.disconnectAll();
	 * ```
	 */
	public disconnectAll(): void {
		this.connections.clear();
	}

	/**
	 * Gets the number of currently connected callbacks.
	 *
	 * @returns The number of active connections
	 *
	 * @example
	 * ```typescript
	 * console.log(`Active connections: ${event.getConnectionCount()}`);
	 * ```
	 */
	public getConnectionCount(): number {
		return this.connections.size();
	}
}

import { Event } from "./event";
import type { EntityId, Id } from "./types";

/**
 * Represents a collection of entities with shared components.
 * Groups allow you to organize entities and apply shared component values to all members.
 *
 * @example
 * ```typescript
 * const teamGroup = world.createGroup();
 * teamGroup.set(Team, "red");
 *
 * teamGroup.addEntity(entity1);
 * teamGroup.addEntity(entity2);
 *
 * // All entities in the group now have the Team component set to "red"
 * ```
 */
export interface Group {
	/** Unique identifier for this group */
	readonly id: number;

	/** Event fired when an entity is added to this group */
	onEntityAdded: Event<[EntityId]>;

	/** Event fired when an entity is removed from this group */
	onEntityRemoved: Event<[EntityId]>;

	/**
	 * Adds an entity to this group.
	 *
	 * @param entity - The entity to add
	 */
	addEntity(entity: EntityId): void;

	/**
	 * Removes an entity from this group.
	 *
	 * @param entity - The entity to remove
	 */
	removeEntity(entity: EntityId): void;

	/**
	 * Checks if an entity is in this group.
	 *
	 * @param entity - The entity to check
	 * @returns True if the entity is in the group
	 */
	hasEntity(entity: EntityId): boolean;

	/**
	 * Gets all entities in this group.
	 *
	 * @returns Array of entity IDs in this group
	 */
	getEntities(): EntityId[];

	/**
	 * Sets a component value that applies to all entities in this group.
	 *
	 * @template T - The component type
	 * @param component - The component ID
	 * @param value - The value to set
	 */
	set<T>(component: Id<T>, value: T): void;

	/**
	 * Gets a component value from this group.
	 *
	 * @template T - The component type
	 * @param component - The component ID
	 * @returns The component value or undefined if not set
	 */
	get<T>(component: Id<T>): T | undefined;

	/**
	 * Checks if this group has a component set.
	 *
	 * @param component - The component ID to check
	 * @returns True if the component is set on this group
	 */
	has(component: Id): boolean;

	/**
	 * Removes a component from this group.
	 *
	 * @param component - The component ID to remove
	 * @returns True if the component was removed
	 */
	remove(component: Id): boolean;
}

/**
 * Implementation of the Group interface.
 * Manages entity membership and shared component values.
 */
export class GroupImpl implements Group {
	/** Static counter for generating unique group IDs */
	private static nextId = 1;

	/** Unique identifier for this group */
	public readonly id: number;

	/** Set of entities in this group */
	private entities = new Set<EntityId>();

	/** Map of component IDs to their values for this group */
	private components = new Map<Id, unknown>();

	/** Event fired when an entity is added to this group */
	public onEntityAdded = new Event<[EntityId]>();

	/** Event fired when an entity is removed from this group */
	public onEntityRemoved = new Event<[EntityId]>();

	/**
	 * Creates a new group instance.
	 */
	constructor() {
		this.id = GroupImpl.nextId++;
	}

	/**
	 * Adds an entity to this group if not already present.
	 * Fires the onEntityAdded event.
	 *
	 * @param entity - The entity to add
	 */
	addEntity(entity: EntityId): void {
		if (!this.entities.has(entity)) {
			this.entities.add(entity);
			this.onEntityAdded.fire(entity);
		}
	}

	/**
	 * Removes an entity from this group if present.
	 * Fires the onEntityRemoved event.
	 *
	 * @param entity - The entity to remove
	 */
	removeEntity(entity: EntityId): void {
		if (this.entities.delete(entity)) {
			this.onEntityRemoved.fire(entity);
		}
	}

	/**
	 * Checks if an entity is in this group.
	 *
	 * @param entity - The entity to check
	 * @returns True if the entity is in the group
	 */
	hasEntity(entity: EntityId): boolean {
		return this.entities.has(entity);
	}

	/**
	 * Gets all entities in this group as an array.
	 *
	 * @returns Array of entity IDs in this group
	 */
	getEntities(): EntityId[] {
		return [...this.entities];
	}

	/**
	 * Sets a component value that applies to all entities in this group.
	 *
	 * @template T - The component type
	 * @param component - The component ID
	 * @param value - The value to set
	 */
	set<T>(component: Id<T>, value: T): void {
		this.components.set(component, value);
	}

	/**
	 * Gets a component value from this group.
	 *
	 * @template T - The component type
	 * @param component - The component ID
	 * @returns The component value or undefined if not set
	 */
	get<T>(component: Id<T>): T | undefined {
		return this.components.get(component) as T | undefined;
	}

	/**
	 * Checks if this group has a component set.
	 *
	 * @param component - The component ID to check
	 * @returns True if the component is set on this group
	 */
	has(component: Id): boolean {
		return this.components.has(component);
	}

	/**
	 * Removes a component from this group.
	 *
	 * @param component - The component ID to remove
	 * @returns True if the component was removed
	 */
	remove(component: Id): boolean {
		return this.components.delete(component);
	}
}

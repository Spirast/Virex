import type { EntityId, Id } from "./types";
import type { World } from "./world";

/**
 * A prefab is a template for creating entities with predefined components.
 * Prefabs allow you to create multiple entities with the same initial component values,
 * and can be extended with additional components or overrides.
 *
 * @example
 * ```typescript
 * // Create a prefab for a basic enemy
 * const enemyPrefab = world.prefab([
 *   [Health, 100],
 *   [Damage, 10],
 *   [Team, "enemy"]
 * ]);
 *
 * // Spawn an enemy with default values
 * const enemy1 = enemyPrefab.spawn();
 *
 * // Spawn an enemy with overrides
 * const enemy2 = enemyPrefab.spawn([
 *   [Health, 150], // Override health
 *   [Damage, 15]  // Override damage
 * ]);
 *
 * // Extend the prefab to create a boss variant
 * const bossPrefab = enemyPrefab.extend([
 *   [Boss, true],
 *   [Health, 500]
 * ]);
 * ```
 */
export class Prefab {
	/** Array of component-value pairs that define this prefab */
	private components: Array<[Id, unknown]>;

	/** Reference to the world this prefab belongs to */
	private world: World;

	/**
	 * Creates a new prefab instance.
	 *
	 * @param world - The world to spawn entities in
	 * @param components - Array of component-value pairs for this prefab
	 */
	constructor(world: World, components: Array<[Id, unknown]>) {
		this.world = world;
		this.components = components;
	}

	/**
	 * Spawns a new entity with this prefab's components.
	 *
	 * @param overrides - Optional component-value pairs to override the prefab defaults
	 * @returns The newly spawned entity ID
	 *
	 * @example
	 * ```typescript
	 * const entity = prefab.spawn([
	 *   [Health, 150], // Override the prefab's default health
	 *   [Special, true] // Add a component not in the prefab
	 * ]);
	 * ```
	 */
	spawn(overrides: Array<[Id, unknown]> = []): EntityId {
		const entity = this.world.spawn();

		// Apply prefab components
		for (const [component, value] of this.components) {
			this.world.set(entity, component, value);
		}

		// Apply overrides
		for (const [component, value] of overrides) {
			this.world.set(entity, component, value);
		}

		return entity;
	}

	/**
	 * Creates a new prefab that extends this one with additional components.
	 * The new prefab will have all components from this prefab plus the new ones.
	 *
	 * @param components - Additional component-value pairs to add to the prefab
	 * @returns A new prefab that extends this one
	 *
	 * @example
	 * ```typescript
	 * const basePrefab = world.prefab([[Health, 100]]);
	 * const extendedPrefab = basePrefab.extend([[Damage, 10], [Speed, 5]]);
	 * ```
	 */
	extend(components: Array<[Id, unknown]>): Prefab {
		return new Prefab(this.world, [...this.components, ...components]);
	}
}

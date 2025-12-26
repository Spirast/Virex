import type { EntityId, Id, Snapshot } from "./types";
import { deepClone, generateId } from "./utils";

/**
 * Creates a snapshot of the current state of entities and their components.
 * Snapshots can be used to save and restore the state of entities for features like
 * undo/redo, save/load games, or testing scenarios.
 *
 * @param entities - Set of entity IDs to include in the snapshot
 * @param componentsMap - Map of entity IDs to their component maps
 * @param components - Optional array of specific component IDs to include. If not provided, all components are included.
 * @returns A snapshot object containing the captured state, or undefined if no valid entities found
 *
 * @example
 * ```typescript
 * // Create a snapshot of all entities with all components
 * const fullSnapshot = createSnapshot(world.entities, world.components);
 *
 * // Create a snapshot of only specific components
 * const positionSnapshot = createSnapshot(
 *   world.entities,
 *   world.components,
 *   [Position, Velocity]
 * );
 *
 * // Restore the snapshot later
 * world.revert(snapshot);
 * ```
 */
export function createSnapshot(
	entities: Set<EntityId>,
	componentsMap: Map<EntityId, Map<Id, unknown>>,
	components?: Id[],
): Snapshot | undefined {
	const entityStates = new Map<EntityId, Map<Id, unknown>>();

	// Process each entity in the set
	for (const entity of entities) {
		const comps = componentsMap.get(entity);
		if (!comps) return; // Skip if entity has no components

		const cloned = new Map<Id, unknown>();

		if (components && components.size() > 0) {
			for (const id of components) {
				if (comps.has(id)) {
					cloned.set(id, deepClone(comps.get(id)));
				}
			}
			if (cloned.size() > 0) {
				entityStates.set(entity, cloned);
			}
		} else {
			for (const [id, val] of comps) {
				cloned.set(id, deepClone(val));
			}
			entityStates.set(entity, cloned);
		}
	}

	// Return the snapshot with metadata
	return {
		id: generateId(),
		timestamp: os.clock(),
		entityStates,
		components: components ? [...components] : undefined,
	};
}

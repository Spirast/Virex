import type { Id } from "./types";

const componentRegistry = new Map<string, Id>();
let nextComponentId = 1;

/**
 * Creates a new component type with a unique identifier.
 *
 * @template T - The type of data this component will hold
 * @param name - A unique name for this component type
 * @returns A unique component ID that can be used to identify this component type
 * @throws Error if a component with the same name is already registered
 *
 * @example
 * ```typescript
 * const Position = component<{x: number, y: number}>("Position");
 * const Health = component<number>("Health");
 * ```
 */
export function component<T = void>(name: string): Id<T> {
	if (componentRegistry.has(name)) {
		error(`Component '${name}' is already registered`);
	}
	const id = nextComponentId++ as Id<T>;
	componentRegistry.set(name, id);
	return id;
}

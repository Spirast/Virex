/**
 * Counter for generating unique IDs
 */
let nextId = 1;

/**
 * Generates a unique sequential ID.
 *
 * @returns A unique number ID
 *
 * @example
 * ```typescript
 * const id1 = generateId(); // 1
 * const id2 = generateId(); // 2
 * const id3 = generateId(); // 3
 * ```
 */
export function generateId(): number {
	return nextId++;
}

/**
 * Creates a deep clone of an object using Roblox's JSON serialization.
 * This is a simple but effective way to deep clone objects in Roblox TypeScript.
 *
 * @template T - The type of object to clone
 * @param obj - The object to deep clone
 * @returns A deep clone of the input object
 *
 * @example
 * ```typescript
 * const original = { nested: { value: 42 } };
 * const cloned = deepClone(original);
 * cloned.nested.value = 100; // Doesn't affect the original
 * ```
 */
export function deepClone<T>(obj: T): T {
	return game
		.GetService("HttpService")
		.JSONDecode(game.GetService("HttpService").JSONEncode(obj)) as T;
}

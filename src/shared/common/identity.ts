// noinspection JSUnusedGlobalSymbols

/**
 * Returns the value passed in.
 * @param value The value to return.
 * @returns The value passed in.
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Returns a function that returns the value passed in.
 * @param value The value to return.
 * @returns A function that returns the value passed in.
 */
export function identityCurry<T>(value: T) {
  return () => value;
}

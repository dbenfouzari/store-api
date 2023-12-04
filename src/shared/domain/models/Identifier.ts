/**
 * Implements identifier features to be used to compare domain entities
 */
export class Identifier<T> {
  private readonly value: T;

  /**
   * Create a new identifier instance
   * @param value Value to use as identifier
   */
  constructor(value: T) {
    this.value = value;
  }

  /**
   * Equal comparator
   * @param other Other value to compare with
   * @returns True if equals to other, false otherwise
   */
  equals(other: Identifier<T> | null | undefined): boolean {
    if (other === null || other === undefined) return false;
    if (!(other instanceof this.constructor)) return false;

    return other.toValue() === this.value;
  }

  /**
   * Get a string representation
   * @returns String implementation of this identifier
   */
  toString() {
    return String(this.value);
  }

  /**
   * Get the raw value of the identifier
   * @returns Value of this identifier, as given
   */
  toValue(): T {
    return this.value;
  }
}

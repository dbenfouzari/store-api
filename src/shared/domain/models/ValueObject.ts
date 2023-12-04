/**
 * Value object properties interface
 */
interface IValueObjectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}

/**
 * Abstract class implements value objects
 */
export abstract class ValueObject<T extends IValueObjectProps | undefined> {
  /**
   * The props of the value object are stored in this.props
   * to leave to the subclass to decide getters
   */
  public props: T;

  /**
   * Creates a new ValueObject instance
   * @param props The props used to construct a ValueObject
   */
  protected constructor(props: T) {
    if (props === undefined) {
      this.props = undefined as T;
    } else {
      this.props = {
        ...props,
      };
    }
  }

  /**
   * Equality comparator for value objects
   * @param other Other ValueObject to compare with.
   * @returns True if it is equal, false otherwise.
   */
  public equals(other: ValueObject<T> | null | undefined): boolean {
    if (other === null || other === undefined) return false;

    if (other.props === undefined) return false;

    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}

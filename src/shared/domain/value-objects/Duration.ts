/** Defines all available duration intervals. */
interface DurationConstructionParams {
  /** Microseconds in duration */
  microseconds?: number;
  /** Milliseconds in duration */
  milliseconds?: number;
  /** Seconds in duration */
  seconds?: number;
  /** Minutes in duration */
  minutes?: number;
  /** Hours in duration */
  hours?: number;
  /** Days in duration */
  days?: number;
  /** Months in duration */
  months?: number;
  /** Years in duration */
  years?: number;
}

/**
 * Converts a number to 6-digits number string.
 * @param n The number to convert
 * @example
 * sixDigits(24) // "000024"
 * @returns   6-digits number string.
 */
function sixDigits(n: number) {
  return n.toString().padStart(6, "0");
}

/**
 * Converts a number to 2-digits number string.
 * @param n The number to convert
 * @example
 * sixDigits(24) // "24"
 * sixDigits(2) // "02"
 * @returns   2-digits number string.
 */
function twoDigits(n: number) {
  return n.toString().padStart(2, "0");
}

export class Duration {
  private readonly _duration: number = 0;

  //#region Constants
  static microsecondsPerMillisecond = 1000;
  static millisecondsPerSecond = 1000;
  static secondsPerMinute = 60;
  static minutesPerHour = 60;
  static hoursPerDay = 24;
  static daysPerMonth = 365.25 / 12;
  static monthsPerYear = 12;

  static microsecondsPerSecond =
    Duration.microsecondsPerMillisecond * Duration.millisecondsPerSecond;
  static microsecondsPerMinute =
    Duration.microsecondsPerSecond * Duration.secondsPerMinute;
  static microsecondsPerHour = Duration.microsecondsPerMinute * Duration.minutesPerHour;
  static microsecondsPerDay = Duration.microsecondsPerHour * Duration.hoursPerDay;
  static microsecondsPerMonth = Duration.microsecondsPerDay * Duration.daysPerMonth;
  static microsecondsPerYear = Duration.microsecondsPerMonth * Duration.monthsPerYear;

  static millisecondsPerMinute =
    Duration.millisecondsPerSecond * Duration.secondsPerMinute;
  static millisecondsPerHour = Duration.millisecondsPerMinute * Duration.minutesPerHour;
  static millisecondsPerDay = Duration.millisecondsPerHour * Duration.hoursPerDay;

  static secondsPerHour = Duration.secondsPerMinute * Duration.minutesPerHour;
  static secondsPerDay = Duration.secondsPerHour * Duration.hoursPerDay;

  static minutesPerDay = Duration.minutesPerHour * Duration.hoursPerDay;

  static zero = new Duration({ seconds: 0 });
  //#endregion

  /**
   * Builds a new Duration
   * @param params The params
   * @param params.microseconds Microseconds
   * @param params.milliseconds Milliseconds
   * @param params.seconds Seconds
   * @param params.minutes Minutes
   * @param params.hours Hours
   * @param params.days Days
   * @param params.months Months
   * @param params.years Years
   * @example
   * new Duration({ seconds: 2 })
   * @returns                          A new Duration.
   */
  constructor({
    microseconds = 0,
    milliseconds = 0,
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    months = 0,
    years = 0,
  }: DurationConstructionParams) {
    this._duration =
      microseconds +
      milliseconds * Duration.microsecondsPerMillisecond +
      seconds * Duration.microsecondsPerSecond +
      minutes * Duration.microsecondsPerMinute +
      hours * Duration.microsecondsPerHour +
      days * Duration.microsecondsPerDay +
      months * Duration.microsecondsPerMonth +
      years * Duration.microsecondsPerYear;
  }
  //#region Constructors

  /**
   * Creates a Duration from milliseconds.
   * @param   milliseconds The value.
   * @example
   * Duration.milliseconds(1000) // same as Duration.seconds(1)
   * @returns              A new Duration.
   */
  static milliseconds(milliseconds: number) {
    return new Duration({ milliseconds });
  }
  /**
   * Creates a Duration from microseconds.
   * @param   microseconds The value.
   * @example
   * Duration.microseconds(1000)
   * @returns              A new Duration.
   */
  static microseconds(microseconds: number) {
    return new Duration({ microseconds });
  }
  /**
   * Creates a Duration from seconds.
   * @param   seconds The value.
   * @example
   * Duration.seconds(2)
   * @returns         A new Duration.
   */
  static seconds(seconds: number) {
    return new Duration({ seconds });
  }
  /**
   * Creates a Duration from minutes.
   * @param   minutes The value.
   * @example
   * Duration.minutes(2)
   * @returns         A new Duration.
   */
  static minutes(minutes: number) {
    return new Duration({ minutes });
  }
  /**
   * Creates a Duration from hours.
   * @param   hours The value.
   * @example
   * Duration.hours(2)
   * @returns       A new Duration.
   */
  static hours(hours: number) {
    return new Duration({ hours });
  }
  /**
   * Creates a Duration from days.
   * @param   days The value.
   * @example
   * Duration.days(2)
   * @returns      A new Duration.
   */
  static days(days: number) {
    return new Duration({ days });
  }
  /**
   * Creates a Duration from months.
   * @param   months The value.
   * @example
   * Duration.months(2)
   * @returns        A new Duration.
   */
  static months(months: number) {
    console.warn(
      "Be careful when you work with months. This library does not provide a really good way to handle these values since it's not the same every month, every year."
    );
    return new Duration({ months });
  }
  /**
   * Creates a Duration from years.
   *
   * Be careful when you work with years.
   * This library does not provide a perfect way to handle these values since it's not
   * the same every month, every year.
   * @param   years The value.
   * @example
   * Duration.years(2)
   * @returns       A new Duration.
   */
  static years(years: number) {
    console.warn(
      "Be careful when you work with years. This library does not provide a really good way to handle these values since it's not the same every month, every year."
    );
    return new Duration({ years });
  }
  //#endregion

  //#region Properties
  /**
   * The number of entire years spanned by this Duration.
   * @returns Entire years
   */
  get inYears() {
    return Math.floor(this._duration / Duration.microsecondsPerYear);
  }

  /**
   * The number of entire months spanned by this Duration.
   * @returns Entire months
   */
  get inMonths() {
    return Math.floor(this._duration / Duration.microsecondsPerMonth);
  }

  /**
   * The number of entire days spanned by this Duration.
   * @returns Entire days
   */
  get inDays() {
    return Math.floor(this._duration / Duration.microsecondsPerDay);
  }

  /**
   * The number of entire hours spanned by this Duration.
   * @returns Entire hours
   */
  get inHours() {
    return Math.floor(this._duration / Duration.microsecondsPerHour);
  }

  /**
   * The number of whole microseconds spanned by this Duration.
   * @returns Microseconds
   */
  get inMicroseconds() {
    return this._duration;
  }

  /**
   * The number of whole milliseconds spanned by this Duration.
   * @returns Milliseconds
   */
  get inMilliseconds() {
    return Math.floor(this._duration / Duration.microsecondsPerMillisecond);
  }

  /**
   * The number of whole minutes spanned by this Duration.
   * @returns Minutes
   */
  get inMinutes() {
    return Math.floor(this._duration / Duration.microsecondsPerMinute);
  }

  /**
   * The number of whole minutes spanned by this Duration.
   * @returns Seconds
   */
  get inSeconds() {
    return Math.floor(this._duration / Duration.microsecondsPerSecond);
  }

  /**
   * Whether this Duration is negative.
   * @returns Is the duration negative
   */
  get isNegative() {
    return this._duration < 0;
  }
  //#endregion

  //#region Methods
  /**
   * Creates a new Duration representing the absolute length of this Duration.
   * @example
   * Duration.seconds(-5).abs() // Duration.seconds(5)
   * @returns A new Duration.
   */
  public abs() {
    if (!this.isNegative) return this;
    return new Duration({ microseconds: Math.abs(this._duration) });
  }

  /**
   * Adds this Duration and other and returns the sum as a new Duration object.
   * @param otherDuration The Duration to add with.
   * @example
   * Duration.seconds(2).add(Duration.seconds(5)) // Duration.seconds(7)
   * @returns               A new Duration.
   */
  public add(otherDuration: Duration) {
    return new Duration({
      microseconds: this.inMicroseconds + otherDuration.inMicroseconds,
    });
  }

  /**
   * Subtracts other from this Duration and returns the difference as a new Duration object.
   * @param otherDuration The Duration to subtract.
   * @example
   * Duration.seconds(7).subtract(Duration.seconds(5)) // Duration.seconds(2)
   * @returns               A new Duration.
   */
  public subtract(otherDuration: Duration) {
    return new Duration({
      microseconds: this.inMicroseconds - otherDuration.inMicroseconds,
    });
  }

  /**
   * Multiplies this Duration by the given factor and returns the result as a new Duration object.
   * @param   factor The factor to multiply with
   * @example
   * Duration.seconds(2).multiply(5) // Duration.seconds(10)
   * @returns        A new Duration.
   */
  public multiply(factor: number) {
    return new Duration({ microseconds: this.inMicroseconds * factor });
  }

  /**
   * Divides this Duration by the given quotient and returns the truncated result as a new Duration object.
   * @param   factor The factor to divide with.
   * @example
   * Duration.seconds(10).divide(5) // Duration.seconds(2)
   * @returns        A new Duration.
   */
  public divide(factor: number) {
    return new Duration({ microseconds: Math.floor(this.inMicroseconds / factor) });
  }

  /**
   * Whether this Duration is shorter than the other.
   * @param otherDuration The duration to compare with.
   * @example
   * Duration.seconds(2).isLesserThan(Duration.seconds(5)) // true
   * Duration.seconds(5).isLesserThan(Duration.seconds(2)) // false
   * @returns                Whether it's shorter or not.
   */
  public isLesserThan(otherDuration: Duration) {
    return this._duration < otherDuration._duration;
  }

  /**
   * Whether this Duration is shorter than or equal to the other.
   * @param otherDuration The duration to compare with.
   * @example
   * Duration.seconds(2).isLesserThanOrEqual(Duration.seconds(5)) // true
   * Duration.seconds(5).isLesserThanOrEqual(Duration.seconds(5)) // true
   * Duration.seconds(6).isLesserThanOrEqual(Duration.seconds(5)) // false
   * @returns                Whether it's shorter or not.
   */
  public isLesserThanOrEqual(otherDuration: Duration) {
    return this._duration <= otherDuration._duration;
  }

  /**
   * Whether this Duration has the same length as the other.
   * @param otherDuration The duration to compare with.
   * @example
   * Duration.seconds(2).isEqual(Duration.seconds(5)) // false
   * Duration.seconds(5).isEqual(Duration.seconds(5)) // true
   * Duration.seconds(6).isEqual(Duration.seconds(5)) // false
   * @returns                Whether it's shorter or not.
   */
  public isEqual(otherDuration: Duration) {
    return this._duration === otherDuration._duration;
  }

  /**
   * Whether this Duration is longer than the other.
   * @param otherDuration The duration to compare with.
   * @example
   * Duration.seconds(2).isGreaterThan(Duration.seconds(5)) // false
   * Duration.seconds(5).isGreaterThan(Duration.seconds(5)) // false
   * Duration.seconds(6).isGreaterThan(Duration.seconds(5)) // true
   * @returns                Whether it's shorter or not.
   */
  public isGreaterThan(otherDuration: Duration) {
    return this._duration > otherDuration._duration;
  }

  /**
   * Whether this Duration is longer than or equal to the other.
   * @param otherDuration The duration to compare with.
   * @example
   * Duration.seconds(2).isGreaterThanOrEqual(Duration.seconds(5)) // false
   * Duration.seconds(5).isGreaterThanOrEqual(Duration.seconds(5)) // true
   * Duration.seconds(6).isGreaterThanOrEqual(Duration.seconds(5)) // true
   * @returns                Whether it's shorter or not.
   */
  public isGreaterThanOrEqual(otherDuration: Duration) {
    return this._duration >= otherDuration._duration;
  }

  /**
   * Creates a new Duration with the opposite direction of this Duration.
   * @example
   * Duration.seconds(2).opposite() // Duration.seconds(-2);
   * @returns A new Duration.
   */
  public opposite() {
    return new Duration({ microseconds: -this.inMicroseconds });
  }

  /**
   * Returns a string representation of the Duration.
   * @example
   * new Duration({ hours: 5, minutes: 2, seconds: 24 }).toString();
   * // "05:02:24"
   * @returns String representation.
   */
  public toString(): string {
    if (this.inMicroseconds < 0) return `-${this.abs().toString()}`;

    const twoDigitMinutes = twoDigits(this.inMinutes % Duration.minutesPerHour);
    const twoDigitSeconds = twoDigits(this.inSeconds % Duration.secondsPerMinute);
    const sixDigitUs = sixDigits(this.inMicroseconds % Duration.microsecondsPerSecond);

    return `${this.inHours}:${twoDigitMinutes}:${twoDigitSeconds}.${sixDigitUs}`;
  }
  //#endregion
}

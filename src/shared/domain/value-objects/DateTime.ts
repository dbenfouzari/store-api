import { Duration } from "./Duration";

/** Defines DateTime constructor arguments */
interface DateTimeConstructorOptions {
  /** Number of years */
  year: number;
  /** Number of months */
  month?: number;
  /** Number of days */
  day?: number;
  /** Number of hours */
  hour?: number;
  /** Number of minutes */
  minute?: number;
  /** Number of seconds */
  second?: number;
  /** Number of milliseconds */
  millisecond?: number;
}

/** Defines params for DateTime.set method */
type DateTimeSetOptions = Omit<DateTimeConstructorOptions, "year"> & {
  /** Number of years */
  year?: number;
};

/**
 * Transforms a number to 2-digits string.
 * @param n The number to convert
 * @example
 * _twoDigits(4) // "04"
 * @returns   2-digits string
 */
const _twoDigits = (n: number) => n.toString().padStart(2, "0");

/**
 * Transforms a number to 3-digits string.
 * @param n The number to convert
 * @example
 * _threeDigits(4) // "004"
 * @returns   3-digits string
 */
const _threeDigits = (n: number) => n.toString().padStart(3, "0");

/**
 * Transforms a number to 4-digits string.
 * @param n The number to convert
 * @example
 * _fourDigits(4) // "0004"
 * @returns   4-digits string
 */
const _fourDigits = (n: number) => n.toString().padStart(4, "0");

/**
 * Transforms a number to 6-digits string.
 * @param n The number to convert
 * @example
 * _fourDigits(24) // "000024"
 * @returns   6-digits string
 */
const _sixDigits = (n: number) => n.toString().padStart(6, "0");

export class DateTime {
  private readonly date: Date;

  /**
   * Build a new DateTime.
   * @param params The params.
   * @param params.year Year
   * @param params.month Month
   * @param params.day Day
   * @param params.hour Hour
   * @param params.minute Minute
   * @param params.second Second
   * @param params.millisecond Millisecond
   * @example
   * new DateTime({ year: 2021, month: 12, day: 24 }) // 2021-12-24
   */
  constructor({
    year,
    month = 1,
    day = 1,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
  }: DateTimeConstructorOptions) {
    this.date = new Date(year, month - 1, day, hour, minute, second, millisecond);
  }

  //#region Constants
  // Months
  static january = 1;
  static february = 2;
  static march = 3;
  static april = 4;
  static may = 5;
  static june = 6;
  static july = 7;
  static august = 8;
  static september = 9;
  static october = 10;
  static november = 11;
  static december = 12;

  // days
  static monday = 1;
  static tuesday = 2;
  static wednesday = 3;
  static thursday = 4;
  static friday = 5;
  static saturday = 6;
  static sunday = 7;

  static daysPerWeek = 7;
  static monthsPerYear = 12;
  //#endregion

  //#region Constructors
  /**
   * Constructs a new [DateTime] instance with the given `millisecondsSinceEpoch`.
   * @param   millisecondsSinceEpoch MS since Epoch
   * @example
   * const dateTime = DateTime.fromMillisecondsSinceEpoch(690678000000) // 1991-11-21
   * const dateTime = DateTime.fromMillisecondsSinceEpoch(new Date(1991, 10, 21).getTime())
   * @returns                        A new DateTime.
   */
  static fromMillisecondsSinceEpoch = (millisecondsSinceEpoch: number) => {
    const date = new Date(millisecondsSinceEpoch);

    return new DateTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
    });
  };

  /**
   * Constructs a [DateTime] instance with current date and time in the local time zone.
   * @example
   * const thisInstant = DateTime.now()
   * @returns A new DateTime.
   */
  static now = () => {
    return DateTime.fromMillisecondsSinceEpoch(Date.now());
  };

  /**
   * Constructs a new [DateTime] instance based on `formattedString`.
   *
   * Throws a `EvalError` if the input string cannot be parsed.
   * @param   formattedString The string to parse
   * @example
   * const dateTime = DateTime.parse("1991-11-21")
   * const badDate = DateTime.parse("hello") // throw EvalError
   * @throws EvalError
   * @returns                 A new DateTime.
   */
  static parse(formattedString: string) {
    if (isNaN(Date.parse(formattedString)))
      throw new EvalError(`[DateTime] - Cannot parse string \`${formattedString}\``);
    return DateTime.fromMillisecondsSinceEpoch(Date.parse(formattedString));
  }

  /**
   * Constructs a new [DateTime] instance based on `formattedString`.
   *
   * Works like `parse` except that this function returns `null` where parse would throw a EvalError.
   * @param   formattedString The string to parse
   * @example
   * const dateTime = DateTime.tryParse("1991-11-21") // OK
   * const badDate = DateTime.tryParse("hello") // returns null
   * @returns                 A new DateTime.
   */
  static tryParse(formattedString: string) {
    try {
      return this.parse(formattedString);
    } catch (e) {
      return null;
    }
  }
  //#endregion

  //#region Properties
  /**
   * The day of the month 1..31.
   * @example
   * const thisDay = DateTime.now().day // 8
   * @returns The DateTime day
   */
  public get day() {
    return this.date.getDate();
  }

  /**
   * The hour of the day, expressed as in a 24-hour clock 0..23
   * @example
   * const thisHour = DateTime.now().hour // 21
   * @returns The DateTime hour
   */
  public get hour() {
    return this.date.getHours();
  }

  /**
   * The millisecond 0...999.
   * @example
   * const thisMs = DateTime.now().millisecond // 923
   * @returns The DateTime milliseconds
   */
  public get millisecond() {
    return this.date.getMilliseconds();
  }

  /**
   * The number of milliseconds since the "Unix epoch" 1970-01-01T00:00:00Z (UTC).
   * @example
   * const msEpoch = DateTime.now().millisecondsSinceEpoch // 1628450223122
   * @returns The DateTime milliseconds since Epoch
   */
  public get millisecondsSinceEpoch() {
    return this.date.getTime();
  }

  /**
   * The minute 0...59.
   * @example
   * const thisMinutes = DateTime.now().minute // 17
   * @returns The DateTime minutes
   */
  public get minute() {
    return this.date.getMinutes();
  }

  /**
   * The month 1..12.
   * @example
   * const thisMonth = DateTime.now().month // 8
   * @returns The DateTime month
   */
  public get month() {
    return this.date.getMonth() + 1;
  }

  /**
   * The second 0...59.
   * @example
   * const thisSecond = DateTime.now().second // 21
   * @returns The DateTime second
   */
  public get second() {
    return this.date.getSeconds();
  }

  /**
   * The time zone name.
   * @example
   * const tzName = DateTime.now().timeZoneName // GMT
   * @returns The DateTime time zone name
   */
  public get timeZoneName() {
    const match = /([A-Z]{2,})/.exec(this.date.toString());
    return (match as RegExpMatchArray)[0];
  }

  /**
   * The time zone offset, which is the difference between local time and UTC.
   *
   * The offset is positive for time zones east of UTC.
   * @example
   * const tzOffset = DateTime.now().timeZoneOffset // Duration({hours: 2})
   * @returns The DateTime time zone offset
   */
  public get timeZoneOffset() {
    // const duration = new Duration()
    const match = /([+-]\d\d:?\d\d)/.exec(this.date.toString());
    const data = (match as RegExpMatchArray)[0];

    const [, hoursString, minutesString] = data
      .split(/([+-])(\d{2})(\d{2})/)
      .filter(Boolean);
    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);

    return new Duration({ hours, minutes });
  }

  /**
   * The day of the week.
   * @example
   * const weekDay = DateTime.now().weekDay // DateTime.sunday or 7
   * @returns The DateTime week day
   */
  public get weekDay() {
    return (this.date.getDay() === 0 ? 7 : this.date.getDay()) as
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7;
  }

  /**
   * The year.
   * @example
   * const year = DateTime.now().year // 2021
   * @returns The DateTime year
   */
  public get year() {
    return this.date.getFullYear();
  }
  //#endregion

  //#region Methods
  /**
   * Returns a new [DateTime] instance with duration added to this.
   * @param duration The Duration to add
   * @example
   * const current = DateTime.now() // 2021-08-08
   * const oneYearLater = current.add(Duration.years(1)) // 2022-08-08
   * @returns          A new DateTime.
   */
  public add(duration: Duration) {
    const time = this.millisecondsSinceEpoch;
    const newDate = new Date(time + duration.inMilliseconds);
    return DateTime.fromMillisecondsSinceEpoch(newDate.getTime());
  }

  /**
   * Returns a [Duration] with the difference when subtracting other from this.
   *
   * The returned [Duration] will be negative if `other` occurs after this.
   * @param other The duration to compare with
   * @example
   * const date1 = new DateTime({ year: 2021, month: 8, day: 6 });
   * const date2 = new DateTime({ year: 2021, month: 8, day: 9 });
   *
   * const duration = date1.difference(date2);
   * const duration2 = date2.difference(date1);
   *
   * assert(duration.inDays === 3)
   * assert(duration2.inDays === -3)
   * @returns       The duration between two DateTime.
   */
  public difference(other: DateTime) {
    const d1 = this.millisecondsSinceEpoch;
    const d2 = other.millisecondsSinceEpoch;

    return Duration.milliseconds(d1 - d2);
  }

  /**
   * Returns true if this occurs after the other.
   * @param other The DateTime to compare with.
   * @example
   * const now = DateTime.now()
   * const later = now.add(Duration.seconds(5))
   *
   * assert(later.isAfter(now))
   * assert(!now.isBefore(now))
   * @returns        The result
   */
  public isAfter(other: DateTime) {
    const d1 = this.millisecondsSinceEpoch;
    const d2 = other.millisecondsSinceEpoch;

    return d1 - d2 > 0;
  }

  /**
   * Returns true if this occurs at the same moment as the other.
   * @param other The DateTime to compare with.
   * @example
   * const now = DateTime.now();
   * const later = now.add(Duration.seconds(5));
   * assert(!later.isAtSameMomentAs(now));
   * assert(now.isAtSameMomentAs(now));
   * @returns        The result
   */
  public isAtSameMomentAs(other: DateTime) {
    const d1 = this.millisecondsSinceEpoch;
    const d2 = other.millisecondsSinceEpoch;

    return d1 - d2 === 0;
  }

  /**
   * Returns true if this occurs at same moment or after the other.
   * @param other The DateTime to compare with.
   * @example
   * const now = DateTime.now();
   * const earlier = now.subtract(Duration.days(2));
   * const later = now.add(Duration.days(2));
   *
   * assert(now.isSameOrAfter(now))
   * assert(now.isSameOrAfter(earlier))
   * assert(!now.isSameOrAfter(later))
   * @returns        The result
   */
  public isSameOrAfter(other: DateTime) {
    return this.isAfter(other) || this.isAtSameMomentAs(other);
  }

  /**
   * Returns true if this occurs at same moment or before the other.
   * @param other The DateTime to compare with.
   * @example
   * const now = DateTime.now();
   * const earlier = now.subtract(Duration.days(2));
   * const later = now.add(Duration.days(2));
   *
   * assert(now.isSameOrBefore(now))
   * assert(now.isSameOrBefore(later))
   * assert(!now.isSameOrBefore(earlier))
   * @returns        The result
   */
  public isSameOrBefore(other: DateTime) {
    return this.isBefore(other) || this.isAtSameMomentAs(other);
  }

  /**
   * Returns true if this occurs after the other.
   * @param other The DateTime to compare with.
   * @example
   * const now = DateTime.now()
   * const earlier = now.subtract(Duration.seconds(5))
   *
   * assert(earlier.isBefore(now))
   * assert(!now.isBefore(now))
   * @returns        The result
   */
  public isBefore(other: DateTime) {
    const d1 = this.millisecondsSinceEpoch;
    const d2 = other.millisecondsSinceEpoch;

    return d1 - d2 < 0;
  }

  /**
   * Returns true if this occurs between date1 and date2, or between date2 and date1.
   * @param date1 The first DateTime to compare with.
   * @param date2 The second DateTime to compare with.
   * @example
   * const now = DateTime.now();
   * const earlier = now.subtract(Duration.days(2));
   * const later = now.add(Duration.days(2));
   *
   * assert(now.isBetween(earlier, later))
   * assert(now.isBetween(later, earlier))
   * assert(!later.isBetween(now, earlier))
   * assert(!earlier.isBetween(now, later))
   * assert(now.isBetween(now, later))
   * @returns        The result
   */
  public isBetween(date1: DateTime, date2: DateTime) {
    return (
      (this.isSameOrAfter(date1) && this.isSameOrBefore(date2)) ||
      (this.isSameOrBefore(date1) && this.isSameOrAfter(date2))
    );
  }

  /**
   * Returns a new [DateTime] instance with different parameters.
   * @param dateOptions Other options
   * @example
   * const dateTime = DateTime.now() // 2021-08-08
   * const firstDayOfMonth = dateTime.set({ day: 1 }) // 2021-08-01
   * @returns                       A new DateTime
   */
  public set(dateOptions: DateTimeSetOptions) {
    return new DateTime({
      year: dateOptions.year ?? this.year,
      month: dateOptions.month ?? this.month,
      day: dateOptions.day ?? this.day,
      hour: dateOptions.hour ?? this.hour,
      minute: dateOptions.minute ?? this.minute,
      second: dateOptions.second ?? this.second,
      millisecond: dateOptions.millisecond ?? this.millisecond,
    });
  }

  /**
   * Returns a new [DateTime] instance with duration subtracted from this.
   * @param duration The duration to subtract
   * @example
   * const today = DateTime.now()
   * const fiftyDaysAgo = today.subtract(Duration.days(50))
   * @returns          A new DateTime
   */
  public subtract(duration: Duration) {
    const time = this.millisecondsSinceEpoch;
    const newDate = new Date(time - duration.inMilliseconds);
    return DateTime.fromMillisecondsSinceEpoch(newDate.getTime());
  }

  /**
   * Returns an ISO-8601 full-precision extended format representation.
   *
   * The format is `yyyy-MM-ddTHH:mm:ss.mmmZ` for UTC time,
   * and `yyyy-MM-ddTHH:mm:ss.mmm` (no trailing "Z") for local/non-UTC time
   * @example
   * DateTime.now().toIso8601String();
   * @returns DateTime as iso8601 string
   */
  public toIso8601String() {
    const y =
      this.year >= -9999 && this.year <= 9999
        ? _fourDigits(this.year)
        : _sixDigits(this.year);
    const m = _twoDigits(this.month);
    const d = _twoDigits(this.day);
    const h = _twoDigits(this.hour);
    const min = _twoDigits(this.minute);
    const sec = _twoDigits(this.second);
    const ms = _threeDigits(this.millisecond);
    return `${y}-${m}-${d}T${h}:${min}:${sec}.${ms}`;
  }
  //#endregion

  //#region Utils
  /**
   * Get the first day of DateTime month week.
   * @example
   * new DateTime({ year: 2021, month: 12, day: 24 }).getFirstDayOfMonthWeek()
   * @returns The first day
   */
  public getFirstDayOfMonthWeek = () => {
    // First we go to the first day of the month
    let nextDate = this.set({ day: 1 });

    /**
     * While date is not monday, we go in the past.
     * We finally get first monday of month's first week
     */
    while (nextDate.weekDay !== 1) {
      nextDate = nextDate.subtract(Duration.days(1));
    }

    return nextDate;
  };

  /**
   * Get the last day of DateTime month week.
   * @example
   * new DateTime({ year: 2021, month: 12, day: 24 }).getLastDayOfMonthWeek()
   * @returns The last day
   */
  public getLastDayOfMonthWeek = () => {
    const daysInMonth = this.getDaysInMonth();
    return daysInMonth.toReversed()[0];
  };

  /**
   * Get an array of all [DateTime] between the first day of the first week of the month, and the last sunday
   * of the last week of the month.
   * @example
   * new DateTime({ year: 2021, month: 12 }).getDaysInMonth();
   * @returns An array of DateTime
   */
  public getDaysInMonth = () => {
    // First we get the first day of the month week.
    let firstDayOfMonthWeek = this.getFirstDayOfMonthWeek();

    // Initialize a new array with the first date.
    // It will soon contain other month dates.
    const daysInMonth = [firstDayOfMonthWeek];

    // Loop while the month is still the same OR the day IS NOT sunday.
    // So we get complete days between first day of first week and last day of last week.
    while (
      firstDayOfMonthWeek.month === this.month ||
      firstDayOfMonthWeek.weekDay !== 7
    ) {
      firstDayOfMonthWeek = firstDayOfMonthWeek.add(Duration.days(1));

      // But insert a duplicated date so when our `date` variable is mutated
      // doesn't impact our already pushed dates.
      daysInMonth.push(firstDayOfMonthWeek);
    }

    // Finally return the result !
    return daysInMonth;
  };

  /**
   * Check if a given `day` [DateTime] is in the `other` [DateTime].
   * @param other The Duration to compare with
   * @example
   * const date1 = new Duration({ year: 2021, month: 12, day: 20 })
   * const date2 = new Duration({ year: 2021, month: 12, day: 12 })
   * const date3 = new Duration({ year: 2020, month: 12, day: 20 })
   *
   * date1.getIsInSameMonth(date2) // true
   * date1.getIsInSameMonth(date3) // false because it's one year later
   * @returns        the result
   */
  public getIsInSameMonth = (other: DateTime) =>
    this.month === other.month && this.year === other.year;

  /**
   * Check if this instance of [DateTime] is today.
   * @example
   * new DateTime({ year: 2021, month: 12, day: 17 }).getIsToday() // true
   * new DateTime({ year: 2021, month: 12, day: 16 }).getIsToday() // false
   * @returns the result
   */
  public getIsToday = () => {
    const today = DateTime.now();

    return this.getIsInSameMonth(today) && today.day === this.day;
  };
  //#endregion
}

import { DateTime } from "@shared/domain/value-objects/DateTime";
import { Duration } from "@shared/domain/value-objects/Duration";

describe("dateTime", () => {
  describe("constructors", () => {
    it("should construct with default values", () => {
      const date = new DateTime({ year: 2021 });

      expect(date.year).toBe(2021);
      expect(date.month).toBe(1);
      expect(date.day).toBe(1);
    });

    it("`fromMillisecondsSinceEpoch` should return correct date", () => {
      const now = new Date(2021, 7, 6);
      const date = DateTime.fromMillisecondsSinceEpoch(now.getTime());

      expect(date.year).toBe(2021);
      expect(date.month).toBe(8);
      expect(date.day).toBe(6);
    });

    it("`now` should return today", () => {
      // Since it uses `Date.now()` and the test can be ran anytime, we have to mock it !
      jest
        .spyOn(Date, "now")
        .mockImplementationOnce(() => new Date(2021, 7, 5).getTime());

      const now = DateTime.now();

      expect(now.year).toBe(2021);
      expect(now.month).toBe(8);
      expect(now.day).toBe(5);
    });

    it("`parse` should work", () => {
      const dateString = "2021-08-06";
      const date = DateTime.parse(dateString);

      expect(date.year).toBe(2021);
      expect(date.month).toBe(8);
      expect(date.day).toBe(6);
    });

    it("`parse` should throw if cannot be parsed", () => {
      const dateString = "hello testing world";

      expect(() => {
        DateTime.parse(dateString);
      }).toThrow(EvalError("[DateTime] - Cannot parse string `hello testing world`"));
    });

    it("`tryParse` should work", () => {
      const dateString = "2021-08-06";
      const date = DateTime.tryParse(dateString);

      expect(date?.year).toBe(2021);
      expect(date?.month).toBe(8);
      expect(date?.day).toBe(6);
    });

    it("`tryParse` should not throw if cannot be parsed", () => {
      const dateString = "hello testing world";

      expect(() => {
        DateTime.tryParse(dateString);
      }).not.toThrow();

      expect(DateTime.tryParse(dateString)).toBeNull();
    });
  });

  describe("properties", () => {
    const date = new DateTime({
      year: 2021,
      month: 8,
      day: 6,
      hour: 11,
      minute: 1,
      second: 24,
      millisecond: 912,
    });

    it("`year` should return correct value", () => {
      expect(date.year).toBe(2021);
    });

    it("`month` should return correct value", () => {
      expect(date.month).toBe(8);
    });

    it("`day` should return correct value", () => {
      expect(date.day).toBe(6);
    });

    it("`hour` should return correct value", () => {
      expect(date.hour).toBe(11);
    });

    it("`minute` should return correct value", () => {
      expect(date.minute).toBe(1);
    });

    it("`second` should return correct value", () => {
      expect(date.second).toBe(24);
    });

    it("`millisecond` should return correct value", () => {
      expect(date.millisecond).toBe(912);
    });

    it("`weekDay` should return correct value", () => {
      expect(date.weekDay).toBe(5);
    });

    it("`millisecondsSinceEpoch` should return correct value", () => {
      expect(date.millisecondsSinceEpoch).toBe(1628247684912);
    });

    it("`timeZoneName` should return correct value", () => {
      expect(date.timeZoneName).toBe("GMT");
    });

    it("`timeZoneOffset` should return correct value", () => {
      expect(date.timeZoneOffset).toStrictEqual(Duration.hours(0));
    });
  });

  describe("methods", () => {
    it("`add` should add a date", () => {
      // For example, I can set month my using constant `DateTime.august`
      const date = new DateTime({ year: 2021, month: DateTime.august, day: 6 });
      const duration = Duration.days(3);

      const finalDate = date.add(duration);

      expect(finalDate.year).toBe(2021);
      expect(finalDate.month).toBe(8);
      expect(finalDate.day).toBe(9);
    });

    it("`add` should add 1 year", () => {
      const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

      const date = new DateTime({ year: 2021, month: DateTime.august, day: 6 });
      const duration = Duration.years(1);

      const finalDate = date.add(duration);

      expect(finalDate.year).toBe(2022);
      expect(finalDate.month).toBe(8);
      expect(finalDate.day).toBe(6);

      expect(consoleWarnMock).toHaveBeenCalledWith(
        "Be careful when you work with years. This library does not provide a really good way to handle these values since it's not the same every month, every year."
      );
    });

    it("`subtract` should subtract a date", () => {
      // Date is 2021-08-06
      // 50 days ago was 2021-06-17
      const date = new DateTime({ year: 2021, month: 8, day: 6 });
      const duration = Duration.days(50);

      const finalDate = date.subtract(duration);

      expect(finalDate.year).toBe(2021);
      expect(finalDate.month).toBe(6);
      expect(finalDate.day).toBe(17);

      const expected50daysAgo = new DateTime({ year: 2021, month: 6, day: 17 });

      expect(finalDate.isAtSameMomentAs(expected50daysAgo)).toBe(true);
    });

    it("`set` with no param should return same date", () => {
      const date = new DateTime({ year: 2021, month: 8, day: 6 });
      const nextDate = date.set({});

      expect(date.isAtSameMomentAs(nextDate)).toBe(true);
    });

    it("`set` should return correct value", () => {
      const date = new DateTime({
        year: 2021,
        month: 8,
        day: 6,
        hour: 11,
        minute: 5,
        second: 35,
        millisecond: 100,
      });
      const nextDate = date.set({
        year: 2023,
        month: 11,
        day: 21,
        hour: 23,
        minute: 52,
        second: 34,
        millisecond: 710,
      });

      const { year, month, day, hour, minute, second, millisecond } = nextDate;
      const testObject = { year, month, day, hour, minute, second, millisecond };

      expect(testObject).toStrictEqual({
        year: 2023,
        month: 11,
        day: 21,
        hour: 23,
        minute: 52,
        second: 34,
        millisecond: 710,
      });

      expect(date.day).toBe(6);
    });

    it("`difference` should return correct value", () => {
      const date1 = new DateTime({ year: 2021, month: 8, day: 6 });
      const date2 = new DateTime({ year: 2021, month: 8, day: 9 });

      const duration1 = date1.difference(date2);
      const duration2 = date2.difference(date1);

      expect(duration1.inDays).toBe(-3);
      expect(duration2.inDays).toBe(3);
    });

    it("`isAfter` should return true", () => {
      const now = DateTime.now();
      const later = now.add(Duration.seconds(5));

      expect(later.isAfter(now)).toBe(true);
    });

    it("`isAfter` should return false", () => {
      const now = DateTime.now();
      const later = now.add(Duration.seconds(5));

      expect(now.isAfter(later)).toBe(false);
    });

    it("`isAtSameMomentAs` should return correct value", () => {
      const now = DateTime.now();
      const later = now.add(Duration.seconds(5));

      expect(now.isAtSameMomentAs(later)).toBe(false);
      expect(now.isAtSameMomentAs(now)).toBe(true);
    });

    it("`isBefore` should return correct value", () => {
      const now = DateTime.now();
      const later = now.add(Duration.seconds(5));

      expect(now.isBefore(later)).toBe(true);
      expect(later.isBefore(now)).toBe(false);
      expect(now.isBefore(now)).toBe(false);
    });

    it("`isBetween` should return correct value", () => {
      const now = DateTime.now();
      const earlier = now.subtract(Duration.days(2));
      const later = now.add(Duration.days(2));

      expect(now.isBetween(earlier, later)).toBe(true);
      expect(now.isBetween(later, earlier)).toBe(true);
      expect(later.isBetween(now, earlier)).toBe(false);
      expect(earlier.isBetween(now, later)).toBe(false);
      expect(now.isBetween(now, later)).toBe(true);
    });

    it("`toIso8601String` should work", () => {
      expect(new DateTime({ year: 2021, month: 8, day: 6 }).toIso8601String()).toBe(
        "2021-08-06T00:00:00.000"
      );
      expect(
        new DateTime({
          year: 2021,
          month: 8,
          day: 6,
          hour: 9,
          minute: 36,
          second: 21,
          millisecond: 123,
        }).toIso8601String()
      ).toBe("2021-08-06T09:36:21.123");
      expect(
        new DateTime({
          year: 122021,
          month: 8,
          day: 6,
          hour: 9,
          minute: 36,
          second: 21,
          millisecond: 123,
        }).toIso8601String()
      ).toBe("122021-08-06T09:36:21.123");
    });
  });

  describe("utils", () => {
    it("`getFirstDayOfMonthWeek` should return correct value", () => {
      const date = new DateTime({ year: 2021, month: 8, day: 6 });
      const expectedDate = new DateTime({ year: 2021, month: 7, day: 26 });

      expect(date.getFirstDayOfMonthWeek().isAtSameMomentAs(expectedDate)).toBe(true);
    });

    it("`getLastDayOfMonthWeek` should return correct value", () => {
      const date = new DateTime({ year: 2021, month: 8, day: 6 });
      const expectedDate = new DateTime({ year: 2021, month: 9, day: 5 });

      expect(date.getLastDayOfMonthWeek().isAtSameMomentAs(expectedDate)).toBe(true);
    });

    it("`getDaysInMonth` should return correct value", () => {
      const date = new DateTime({ year: 2021, month: 8, day: 6 });
      const expectedDates = [
        new DateTime({ year: 2021, month: 7, day: 26 }),
        new DateTime({ year: 2021, month: 7, day: 27 }),
        new DateTime({ year: 2021, month: 7, day: 28 }),
        new DateTime({ year: 2021, month: 7, day: 29 }),
        new DateTime({ year: 2021, month: 7, day: 30 }),
        new DateTime({ year: 2021, month: 7, day: 31 }),
        new DateTime({ year: 2021, month: 8, day: 1 }),
        new DateTime({ year: 2021, month: 8, day: 2 }),
        new DateTime({ year: 2021, month: 8, day: 3 }),
        new DateTime({ year: 2021, month: 8, day: 4 }),
        new DateTime({ year: 2021, month: 8, day: 5 }),
        new DateTime({ year: 2021, month: 8, day: 6 }),
        new DateTime({ year: 2021, month: 8, day: 7 }),
        new DateTime({ year: 2021, month: 8, day: 8 }),
        new DateTime({ year: 2021, month: 8, day: 9 }),
        new DateTime({ year: 2021, month: 8, day: 10 }),
        new DateTime({ year: 2021, month: 8, day: 11 }),
        new DateTime({ year: 2021, month: 8, day: 12 }),
        new DateTime({ year: 2021, month: 8, day: 13 }),
        new DateTime({ year: 2021, month: 8, day: 14 }),
        new DateTime({ year: 2021, month: 8, day: 15 }),
        new DateTime({ year: 2021, month: 8, day: 16 }),
        new DateTime({ year: 2021, month: 8, day: 17 }),
        new DateTime({ year: 2021, month: 8, day: 18 }),
        new DateTime({ year: 2021, month: 8, day: 19 }),
        new DateTime({ year: 2021, month: 8, day: 20 }),
        new DateTime({ year: 2021, month: 8, day: 21 }),
        new DateTime({ year: 2021, month: 8, day: 22 }),
        new DateTime({ year: 2021, month: 8, day: 23 }),
        new DateTime({ year: 2021, month: 8, day: 24 }),
        new DateTime({ year: 2021, month: 8, day: 25 }),
        new DateTime({ year: 2021, month: 8, day: 26 }),
        new DateTime({ year: 2021, month: 8, day: 27 }),
        new DateTime({ year: 2021, month: 8, day: 28 }),
        new DateTime({ year: 2021, month: 8, day: 29 }),
        new DateTime({ year: 2021, month: 8, day: 30 }),
        new DateTime({ year: 2021, month: 8, day: 31 }),
        new DateTime({ year: 2021, month: 9, day: 1 }),
        new DateTime({ year: 2021, month: 9, day: 2 }),
        new DateTime({ year: 2021, month: 9, day: 3 }),
        new DateTime({ year: 2021, month: 9, day: 4 }),
        new DateTime({ year: 2021, month: 9, day: 5 }),
      ];

      expect(JSON.stringify(date.getDaysInMonth())).toBe(JSON.stringify(expectedDates));
    });

    it("`getIsInSameMonth` should return correct value", () => {
      const dateTime = new DateTime({ year: 2021, month: 9, day: 21 });

      expect(
        dateTime.getIsInSameMonth(new DateTime({ year: 2021, month: 8, day: 21 }))
      ).toBe(false);
      expect(
        dateTime.getIsInSameMonth(new DateTime({ year: 2020, month: 9, day: 21 }))
      ).toBe(false);
      expect(
        dateTime.getIsInSameMonth(new DateTime({ year: 2021, month: 9, day: 3 }))
      ).toBe(true);
    });

    it("`getIsToday` should return correct value", () => {
      jest.spyOn(Date, "now").mockImplementation(() => new Date(2021, 8, 21).getTime());

      expect(new DateTime({ year: 2021, month: 9, day: 21 }).getIsToday()).toBe(true);
      expect(new DateTime({ year: 2021, month: 9, day: 20 }).getIsToday()).toBe(false);

      jest.restoreAllMocks();
    });
  });
});

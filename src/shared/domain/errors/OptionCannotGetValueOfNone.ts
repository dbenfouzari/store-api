export class OptionCannotGetValueOfNone extends Error {
  constructor() {
    super("Cannot get value of none.");
    this.name = "OptionCannotGetValueOfNone";
  }
}

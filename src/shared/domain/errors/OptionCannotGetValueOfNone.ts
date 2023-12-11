export class OptionCannotGetValueOfNone extends Error {
  constructor(message = "Called `Option.unwrap()` on a `None` value") {
    super(message);
    this.name = "OptionCannotGetValueOfNone";
  }
}

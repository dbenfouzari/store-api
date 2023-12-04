import { AppException } from "@application/exceptions/AppException";

export class FetchException extends AppException {
  public static message = "There was an error fetching the resource.";

  constructor() {
    super(FetchException.message);
  }
}

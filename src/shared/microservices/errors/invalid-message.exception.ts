export class InvalidMessageException extends Error {
  constructor() {
    super(`The invalid data or message pattern (undefined/null)`);
  }
}
export class MSError extends Error {
  private code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

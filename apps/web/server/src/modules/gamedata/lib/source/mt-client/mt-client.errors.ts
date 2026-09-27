export class ForeignClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForeignClientError';
  }
}

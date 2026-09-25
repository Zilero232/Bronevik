export class ReplayFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReplayFormatError';
  }
}

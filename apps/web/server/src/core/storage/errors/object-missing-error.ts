export class StorageObjectMissingError extends Error {
  constructor(readonly key: string) {
    super(`Storage object ${key} does not exist`);
    this.name = 'StorageObjectMissingError';
  }
}

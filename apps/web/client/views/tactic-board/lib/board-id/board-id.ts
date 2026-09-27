export const createBoardId = (): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(9)), (byte) => byte.toString(36).padStart(2, '0')).join('');

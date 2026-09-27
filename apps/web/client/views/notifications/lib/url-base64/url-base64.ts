const BLOCK = 4;

export const urlBase64ToUint8Array = (value: string): Uint8Array<ArrayBuffer> => {
  const padding = '='.repeat((BLOCK - (value.length % BLOCK)) % BLOCK);
  const binary = atob(`${value}${padding}`.replaceAll('-', '+').replaceAll('_', '/'));

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

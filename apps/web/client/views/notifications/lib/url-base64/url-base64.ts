import { URL_BASE64 } from '../../config';

export const urlBase64ToUint8Array = (value: string): Uint8Array<ArrayBuffer> => {
  const padding = '='.repeat((URL_BASE64.padBlock - (value.length % URL_BASE64.padBlock)) % URL_BASE64.padBlock);
  const binary = atob(`${value}${padding}`.replaceAll('-', '+').replaceAll('_', '/'));

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

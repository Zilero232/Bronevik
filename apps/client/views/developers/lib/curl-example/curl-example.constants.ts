import type { CurlExampleConfig } from './curl-example.types';

export const CURL_EXAMPLE: CurlExampleConfig = {
  keyVariable: '$BRONEVIK_API_KEY',
  placeholder: /\{([^}]+)\}/g,
  fallback: 'example',
  byType: { integer: '1', number: '1', boolean: 'true', array: '10' },
  byName: { idOrNick: 'Tanker', nickname: 'Tanker', search: 'Tanker' },
  lineBreak: ' \\\n  '
};

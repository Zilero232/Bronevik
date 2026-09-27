import type { JsonLdProps } from './JsonLd.types';

import { jsonLdText } from '../json-ld';

export const JsonLd = ({ data }: JsonLdProps) => (
  // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- structured data is JSON with every `<` escaped, so it cannot close the script
  <script dangerouslySetInnerHTML={{ __html: jsonLdText(data) }} type='application/ld+json' />
);

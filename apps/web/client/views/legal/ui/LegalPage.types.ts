import type { LEGAL_DOCS } from '../config';

export type LegalPageProps = {
  doc: (typeof LEGAL_DOCS)[number];
};

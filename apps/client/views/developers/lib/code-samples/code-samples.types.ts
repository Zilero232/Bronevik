import type { CODE_SAMPLES } from './code-samples.constants';

export type QuickstartLanguage = (typeof CODE_SAMPLES.quickstart)[number];

export type WebhookSampleKind = (typeof CODE_SAMPLES.webhook)[number];

export type CodeSample<T extends string> = {
  id: T;
  language: string;
  code: string;
};

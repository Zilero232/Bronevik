import { ratingTier } from '@bronevik/ratings';
import { API_KEY } from '@bronevik/schemas';

import { env } from '@/shared/config';

import type { ConsoleLine, ConsoleToken } from './TelemetryConsole.types';

import { TELEMETRY_DEMO } from '../../../../../config';
import { trimBaseUrl } from '../../../../../lib/curl-example';

const { nickname, keyPreview, battles, winRate, wn8 } = TELEMETRY_DEMO;

const pad = (depth: number): ConsoleToken => ({ kind: 'punct', text: '  '.repeat(depth) });
const key = (name: string): ConsoleToken[] => [
  { kind: 'key', text: `"${name}"` },
  { kind: 'punct', text: ': ' }
];

export const CONSOLE_COMMAND = `curl -H "${API_KEY.header}: ${keyPreview}" ${trimBaseUrl(env.NEXT_PUBLIC_API_URL)}/v1/players/${nickname}`;

export const CONSOLE_LINES: ConsoleLine[] = [
  [{ kind: 'punct', text: '{' }],
  [pad(1), ...key('summary'), { kind: 'punct', text: '{' }],
  [pad(2), ...key('nickname'), { kind: 'string', text: `"${nickname}"` }, { kind: 'punct', text: ',' }],
  [pad(2), ...key('overall'), { kind: 'punct', text: '{' }],
  [pad(3), ...key('battles'), { kind: 'number', text: String(battles) }, { kind: 'punct', text: ',' }],
  [pad(3), ...key('winRate'), { kind: 'number', text: String(winRate) }, { kind: 'punct', text: ',' }],
  [
    pad(3),
    ...key('wn8'),
    { kind: 'punct', text: '{ ' },
    ...key('value'),
    { kind: 'wn8', text: String(wn8) },
    { kind: 'punct', text: ', ' },
    ...key('tier'),
    { kind: 'string', text: `"${ratingTier({ scale: 'wn8', value: wn8 })}"` },
    { kind: 'punct', text: ' }' }
  ],
  [pad(2), { kind: 'punct', text: '}' }],
  [pad(1), { kind: 'punct', text: '}' }],
  [{ kind: 'punct', text: '}' }]
];

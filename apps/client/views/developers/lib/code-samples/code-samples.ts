import { API_KEY, WEBHOOK } from '@bronevik/schemas';

import type { CodeSample, QuickstartLanguage, WebhookSampleKind } from './code-samples.types';

import { trimBaseUrl } from '../curl-example';
import { CODE_SAMPLES } from './code-samples.constants';

const { nickname, keyVariable, secretVariable, toleranceSec } = CODE_SAMPLES;
const scheme = `${WEBHOOK.signatureScheme}=`;
const header = (name: string) => name.toLowerCase();

export const quickstartSamples = (baseUrl: string): CodeSample<QuickstartLanguage>[] => {
  const base = trimBaseUrl(baseUrl);

  return [
    {
      id: 'ts',
      language: 'typescript',
      code: [
        "import { createBronevikClient, getPlayer } from '@bronevik/sdk';",
        '',
        'const client = createBronevikClient({',
        `  apiKey: process.env.${keyVariable},`,
        `  baseUrl: '${base}'`,
        '});',
        '',
        `const { data: player } = await getPlayer({ client, path: { idOrNick: '${nickname}' }, throwOnError: true });`,
        '',
        'console.log(player.summary.nickname, player.summary.overall.wn8.value);'
      ].join('\n')
    },
    {
      id: 'curl',
      language: 'bash',
      code: [`curl '${base}/v1/players/${nickname}' \\`, `  -H "${API_KEY.header}: $${keyVariable}"`].join('\n')
    },
    {
      id: 'python',
      language: 'python',
      code: [
        'import os',
        'import requests',
        '',
        'response = requests.get(',
        `    "${base}/v1/players/${nickname}",`,
        `    headers={"${API_KEY.header}": os.environ["${keyVariable}"]},`,
        '    timeout=10,',
        ')',
        'response.raise_for_status()',
        'summary = response.json()["summary"]',
        'print(summary["nickname"], summary["overall"]["wn8"]["value"])'
      ].join('\n')
    }
  ];
};

export const webhookSamples = (): CodeSample<WebhookSampleKind>[] => [
  {
    id: 'sdk',
    language: 'typescript',
    code: [
      "import { verifyWebhookSignature } from '@bronevik/sdk';",
      '',
      "app.post('/bronevik', async (request, reply) => {",
      '  const valid = await verifyWebhookSignature({',
      `    secret: process.env.${secretVariable},`,
      '    body: request.rawBody,',
      `    signature: request.headers['${header(WEBHOOK.signatureHeader)}'],`,
      `    timestamp: request.headers['${header(WEBHOOK.timestampHeader)}']`,
      '  });',
      '',
      '  if (!valid) {',
      '    return reply.code(401).send();',
      '  }',
      '',
      '  const { event, data } = JSON.parse(request.rawBody);',
      '',
      '  return reply.code(204).send();',
      '});'
    ].join('\n')
  },
  {
    id: 'node',
    language: 'javascript',
    code: [
      "import { createHmac, timingSafeEqual } from 'node:crypto';",
      '',
      'export const isValidDelivery = ({ secret, body, signature, timestamp }) => {',
      `  if (!signature?.startsWith('${scheme}') || Math.abs(Date.now() / 1000 - Number(timestamp)) > ${toleranceSec}) {`,
      '    return false;',
      '  }',
      '',
      "  const expected = createHmac('sha256', secret).update(timestamp).update('.').update(body).digest('hex');",
      `  const received = signature.slice('${scheme}'.length);`,
      '',
      '  return received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));',
      '};'
    ].join('\n')
  },
  {
    id: 'python',
    language: 'python',
    code: [
      'import hashlib',
      'import hmac',
      'import time',
      '',
      '',
      'def is_valid_delivery(secret: str, body: bytes, signature: str, timestamp: str) -> bool:',
      `    if not signature.startswith("${scheme}") or abs(time.time() - int(timestamp)) > ${toleranceSec}:`,
      '        return False',
      '    expected = hmac.new(secret.encode(), timestamp.encode() + b"." + body, hashlib.sha256).hexdigest()',
      `    return hmac.compare_digest(signature[len("${scheme}"):], expected)`
    ].join('\n')
  }
];

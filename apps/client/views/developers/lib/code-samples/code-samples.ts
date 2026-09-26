import { API_KEY, WEBHOOK } from '@bronevik/schemas';

import type { CodeSample, QuickstartLanguage, WebhookSampleKind } from './code-samples.types';

import { CODE_SAMPLES } from '../../config/code-samples.constants';
import { trimBaseUrl } from '../api-url';

const { nickname, keyVariable, secretVariable } = CODE_SAMPLES;
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
      "import { verifyWebhook } from '@bronevik/sdk';",
      '',
      "app.post('/bronevik', async (request, reply) => {",
      '  try {',
      '    const { event, data } = verifyWebhook({',
      `      secret: process.env.${secretVariable},`,
      '      body: request.rawBody,',
      '      headers: request.headers',
      '    });',
      '',
      '    return reply.code(204).send();',
      '  } catch {',
      '    return reply.code(401).send();',
      '  }',
      '});'
    ].join('\n')
  },
  {
    id: 'node',
    language: 'javascript',
    code: [
      '// npm i standardwebhooks',
      "import { Webhook } from 'standardwebhooks';",
      '',
      `const webhook = new Webhook(process.env.${secretVariable});`,
      '',
      'export const readDelivery = ({ body, headers }) =>',
      '  webhook.verify(body, {',
      `    '${header(WEBHOOK.deliveryHeader)}': headers['${header(WEBHOOK.deliveryHeader)}'],`,
      `    '${header(WEBHOOK.timestampHeader)}': headers['${header(WEBHOOK.timestampHeader)}'],`,
      `    '${header(WEBHOOK.signatureHeader)}': headers['${header(WEBHOOK.signatureHeader)}']`,
      '  });'
    ].join('\n')
  },
  {
    id: 'python',
    language: 'python',
    code: [
      '# pip install standardwebhooks',
      'import os',
      '',
      'from standardwebhooks.webhooks import Webhook',
      '',
      `webhook = Webhook(os.environ["${secretVariable}"])`,
      '',
      '',
      'def read_delivery(body: bytes, headers: dict) -> dict:',
      '    return webhook.verify(body, headers)'
    ].join('\n')
  }
];

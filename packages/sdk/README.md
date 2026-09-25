# @bronevik/sdk

TypeScript client for the Bronevik public API (`/v1`). The functions and types are generated from the OpenAPI spec with [`@hey-api/openapi-ts`](https://heyapi.dev); a small wrapper adds the API key, the base URL and retries, and `verifyWebhookSignature` checks webhook deliveries.

Create a key in the site's developer page (`/me/developer`). The key is shown once. Interactive docs live at `/v1/docs`, the raw spec at `/v1/docs/openapi.json`.

## Usage

```ts
import { createBronevikClient, getPlayer, getTierList, listPlayerTanks } from '@bronevik/sdk';

const client = createBronevikClient({
  apiKey: process.env.BRONEVIK_API_KEY!,
  baseUrl: 'https://api.bronevik.app'
});

const { data: player } = await getPlayer({ client, path: { idOrNick: 'Tanker' }, throwOnError: true });

const { data: tanks } = await listPlayerTanks({
  client,
  path: { id: player.summary.accountId },
  query: { tiers: [10], sort: 'wn8', limit: 'all' },
  throwOnError: true
});

const { data: tierList } = await getTierList({ client, query: { mode: 'random', period: '7d' }, throwOnError: true });
```

Every function takes `{ client, path, query }` and returns `{ data, error, request, response }`. Pass `throwOnError: true` to get `data` typed as the success body and have the API error (`{ error, code }`) thrown instead.

Units: every rate (`winRate`, `survivalRate`, `accuracy`) is a percent from 0 to 100; `winRateDiff` and `winRateDelta` are percentage points.

### Retries

Requests answered with 408, 425, 429 or 5xx, and network failures, are retried up to three times with exponential backoff, honouring `Retry-After`. Tune or disable it:

```ts
createBronevikClient({ apiKey, retry: { retries: 5, minTimeoutMs: 1_000 } });
createBronevikClient({ apiKey, retry: false });
```

### Limits

| Plan    | Requests per second | Requests per day | Webhook endpoints |
| ------- | ------------------- | ---------------- | ----------------- |
| Free    | 5                   | 10 000           | 1                 |
| Pro     | 25                  | 250 000          | 10                |
| Partner | 100                 | 2 000 000        | 50                |

Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Daily-Limit` and `X-RateLimit-Daily-Remaining`. Over the limit the API answers 429 with `RATE_LIMITED` (per second) or `PLAN_LIMIT_REACHED` (per day) and a `Retry-After` header.

### Webhooks

Endpoints are managed in `/me/developer`; each one follows players (`accountIds`) and/or clans (`clanIds`) and receives `mark.gained`, `session.ended` and `clan.member_changed`. A delivery is a JSON `POST` signed with the endpoint secret (shown once):

```ts
import { verifyWebhookSignature, WEBHOOK_SIGNATURE } from '@bronevik/sdk';

app.post('/bronevik', async (request, reply) => {
  const valid = await verifyWebhookSignature({
    secret: process.env.BRONEVIK_WEBHOOK_SECRET!,
    body: request.rawBody,
    signature: request.headers[WEBHOOK_SIGNATURE.signatureHeader],
    timestamp: request.headers[WEBHOOK_SIGNATURE.timestampHeader]
  });

  if (!valid) {
    return reply.code(401).send();
  }

  const { event, data } = JSON.parse(request.rawBody);
});
```

The signature is `sha256=` + hex HMAC-SHA256 of `"<X-Bronevik-Timestamp>.<raw body>"`. Deliveries older than five minutes are rejected by default. A failed delivery is retried six times with exponential backoff; twenty failed deliveries in a row switch the endpoint off.

## Regenerating

The committed spec is `openapi/v1.json`; the generated code in `src/generated` is git-ignored and rebuilt on `bun install`.

```bash
bun run --filter @bronevik/sdk sdk:generate                                   # export the spec from the server code, format it, regenerate
BRONEVIK_OPENAPI_URL=http://localhost:4000/v1/docs/openapi.json bun run --filter @bronevik/sdk sdk:generate:live   # from a running server
```

`sdk:generate` runs the server's `openapi:export` script, which boots the Nest application without an HTTP port (it needs the database and Redis from `bun run dev:infra`).

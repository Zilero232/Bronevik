# lib/lesta

Typed thin client for the Lesta «Мир танков» API (`api.tanki.su/wot/`).

- Every call is a form-encoded `POST`, validated with zod, and returned as `{ data, meta }` by `request` or as `data` by the typed methods.
- Id lists are deduplicated and split into batches of `LESTA_API.batchSize` (100), then fetched in parallel and merged.
- Retries use `p-retry` with `LESTA_RETRY` defaults. Only retryable failures are retried: `REQUEST_LIMIT_EXCEEDED`, `SOURCE_NOT_AVAILABLE`, HTTP 429 and 5xx, and network errors (`isRetryableLestaError`).
- Every attempt takes a token from a `RateLimiter` first. `createRedisRateLimiter` shares one budget across processes, `createMemoryRateLimiter` keeps it in-process, and `noopRateLimiter` is the default.

```ts
import { createLestaClient, createRedisRateLimiter } from '../lib/lesta';

const lesta = createLestaClient({
  applicationId: process.env.LESTA_APPLICATION_ID,
  rateLimiter: createRedisRateLimiter({ redis })
});

const accounts = await lesta.account.info({ accountIds: [1, 2, 3] });
const narrowed = await lesta.account.info({ accountIds: [1], fields: ['nickname'] });
```

## Fields

Passing `fields` narrows the response type to a `DeepPartial` of the full shape and skips full validation, because Lesta drops every field you did not ask for. Lesta accepts at most 100 fields (`LESTA_API.maxFields`); asking for more throws a `RangeError` before any request is sent.

## Methods

| Group          | Typed methods                                                          | Other methods                                                  |
| -------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `account`      | `list`, `info`, `tanks`, `achievements`                                |                                                                |
| `tanks`        | `stats`, `achievements`, `mastery`                                     |                                                                |
| `encyclopedia` | `vehicles`, `allVehicles`, `vehicleprofile`, `vehicleprofiles`, `info` | modules, provisions, boosters, achievements, arenas, badges, … |
| `clans`        | `list`, `info`, `accountinfo`, `memberhistory`                         | `glossary`, `messageboard`                                     |
| `auth`         | `loginUrl`, `login`, `prolongate`, `logout`, `parseLoginCallback`      |                                                                |
| `ratings`      | `accounts`                                                             | `types`, `dates`, `neighbors`, `top`                           |
| `clanratings`  | `clans`                                                                | `types`, `dates`, `neighbors`, `top`                           |
| `globalmap`    |                                                                        | every documented method                                        |
| `stronghold`   |                                                                        | `claninfo`, `clanreserves`, `activateclanreserve`              |

The other methods return `unknown` and take the generic `{ params, fields, extra, language, accessToken }` input. The ones keyed by an id (`modules`, `claninfo`, …) take `ids` and are batched the same way.

## Errors

| Class               | When                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `LestaApiError`     | `status: "error"` in the envelope, or a response that fails its schema (`code: INVALID_RESPONSE`) |
| `LestaHttpError`    | a non-2xx HTTP status                                                                             |
| `LestaNetworkError` | `fetch` threw, including the `timeoutMs` abort                                                    |

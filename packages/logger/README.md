# @otmetki/logger

One pino configuration shared by every Three Marks app, so log lines from the server, the worker and the scripts have the same shape.

```ts
import { createLogger } from '@otmetki/logger';

const logger = createLogger({ service: 'worker' });
```

- `service` lands on every line as `service`, which is how the logs of one stack are told apart.
- `level` falls back to `LOG_LEVEL`, then to `debug` in development and `info` in production.
- Output is `pino-pretty` in development and JSON on stdout in production; `LOG_FORMAT=json` forces JSON anywhere. `pretty` only tunes the pretty format (`ignore`, `messageFormat`).
- `REDACTION` lists the paths that are always censored (passwords, tokens, API keys, secrets, cookies, the authorization header). Add a path there rather than scrubbing a value at the call site.

Tests: `src/logger/_tests`, run from the repo root with `bun run test`.

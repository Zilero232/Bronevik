---
paths:
  - "apps/web/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/web/server/CLAUDE.md; contracts in docs/guides/shared/schemas.md. Keep them in sync. -->

# Code style — server: errors

## Errors

Throw the app exceptions from `common/exceptions` with a code from
`@otmetki/schemas`. The client matches on the code, so the message is free text
but the code is a contract.

```ts
throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`);
```

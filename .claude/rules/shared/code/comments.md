---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full guide is docs/guides/ (index: docs/guides/README.md); the root CLAUDE.md carries the key rules. Keep them in sync. -->

# Code style — TypeScript: comments

## No comments

The code is expected to read on its own. Application code in `apps/` and
`packages/` has zero comments and stays that way; the reasoning belongs in
CLAUDE.md or the commit message. The exceptions:

- an `eslint-disable-next-line` carries its reason after `--`;
- tool and build configs explain why a rule is bent: `eslint.config.mjs`,
  `stylelint.config.mjs`, every `vitest.config.ts`, `playwright.config.ts`, the client's `next.config.ts` and its `config/*.ts`
  build helpers (security headers, CSP, redirects), and `.github/**` YAML;
- a `/* glsl */` tag in front of a shader template string — it is a
  syntax-highlighting marker, not prose;
- pragmas the tools read (`// @vitest-environment`, `/// <reference lib>`).

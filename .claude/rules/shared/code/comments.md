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
CLAUDE.md or the commit message. The exceptions: an `eslint-disable-next-line`
carries its reason after `--`, and tool configs (`eslint.config.mjs`,
`stylelint.config.mjs`) and `.github/**` YAML explain why a rule is bent.

import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsxA11y: true,
    ignores: [
      '**/node_modules',
      '**/.next',
      '**/out',
      '**/dist',
      '**/generated',
      '**/coverage',
      '**/.cache',
      '**/.venv',
      '**/next-env.d.ts',
      'apps/web/client/public/twitch-panel.js',
      'apps/game/modpack/packages/ui/gameface/**',
      'apps/game/manager/tauri/target/**',
      'apps/game/manager/tauri/gen/**',
      'apps/game/manager/web/dist/**',
      '.data/**',
      'e2e/.results/**',
      'playwright-report/**',
      'docs/**',
      '**/*.md/**'
    ]
  },

  {
    name: 'otmetki/typescript',
    files: ['**/*.?([cm])[jt]s?(x)'],
    rules: {
      curly: ['error', 'all'],
      // `type` everywhere, never `interface` — see the root CLAUDE.md.
      'ts/consistent-type-definitions': ['error', 'type'],
      // No `as` casts. `as const` stays — it narrows literals instead of
      // overriding the checker, which is the opposite of what a cast does.
      // A warning, not an error: the casts that predate this rule are still
      // being worked through, and none of them should block a build.
      'ts/consistent-type-assertions': ['warn', { assertionStyle: 'never' }],
      // Bun and Node both provide these as globals; the rule wants a CJS
      // require() that has no place in an ESM workspace.
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      // "Let the code breathe" from the root CLAUDE.md, enforced instead of
      // eyeballed: a blank line before every exit, and between the const/let
      // setup block and the logic that acts on it. Prettier only preserves
      // blank lines, it never inserts them — this rule does, and --fix applies it.
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['return', 'throw', 'continue', 'break'] },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        // Distinct steps: a block never butts up against whatever precedes or
        // follows it, in either direction.
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'do', 'switch', 'try', 'function', 'class', 'export']
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'do', 'switch', 'try', 'function', 'class', 'block-like'],
          next: '*'
        },
        // A call that spans several lines is a step of its own. Single-line
        // calls stay grouped, so `log.step(...)` keeps sitting on top of the
        // `await` it announces instead of being pushed away from it.
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-expression' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: 'multiline-let', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'any', prev: 'directive', next: 'directive' }
      ]
    }
  },

  // Sorting manifest keys is pure churn and fights the conventional field order.
  {
    name: 'otmetki/manifests',
    files: ['**/package.json', '**/tsconfig*.json'],
    rules: {
      'jsonc/sort-keys': 'off'
    }
  },

  {
    name: 'otmetki/server',
    files: ['apps/web/server/**'],
    rules: {
      // Nest resolves dependencies from decorator metadata, which `import type`
      // erases — the app then fails to boot with "Nest can't resolve".
      'ts/consistent-type-imports': 'off',
      // Nest's `useFactory` / `useClass` provider keys are not React hooks.
      'react/no-unnecessary-use-prefix': 'off',
      // main.ts and worker.ts are ESM entrypoints Bun runs directly.
      'antfu/no-top-level-await': 'off'
    }
  },

  // The modpack's in-game window runs in Coherent Gameface: list elements (ul/ol/li, dl/dt/dd) and
  // select/option only render through a polyfill, and radio, range and checkbox inputs are missing,
  // so the window builds them from div + role and button (apps/game/modpack/README.md «In-game UI»).
  // The first two entries repeat the base config's list, which a file-scoped rule replaces.
  {
    name: 'otmetki/modpack-gameface',
    files: ['apps/game/modpack/ui-web/src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        'TSEnumDeclaration[const=true]',
        'TSExportAssignment',
        {
          selector: 'JSXOpeningElement[name.name=/^(ul|ol|li|dl|dt|dd|select|option|optgroup|datalist)$/]',
          message:
            'Gameface renders this element only through a polyfill: use a div with a role (shared/ui/list, shared/ui/detail-list, shared/ui/segmented).'
        },
        {
          selector: 'JSXOpeningElement[name.name="input"] > JSXAttribute[name.name="type"][value.value=/^(radio|range|checkbox)$/]',
          message: 'Gameface has no radio, range or checkbox input: use shared/ui/segmented, shared/ui/toggle or a stepper.'
        }
      ]
    }
  },

  // Console is the output channel of a CLI script, not a leftover debug line.
  {
    name: 'otmetki/scripts',
    files: ['**/scripts/**'],
    rules: {
      'no-console': 'off'
    }
  },

  // `next typegen` appends its own `# This is NOT the Next.js you know` block to
  // apps/web/client/CLAUDE.md, so the file has two H1s and is regenerated on every
  // run — editing it back would only lose the change.
  {
    name: 'otmetki/agent-docs',
    files: ['**/CLAUDE.md'],
    rules: {
      'markdown/no-multiple-h1': 'off'
    }
  }
);

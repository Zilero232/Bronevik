# Naming

Part of the [style guide](../../README.md).

## 5. Naming

| What                     | How                  | Example                                      |
| ------------------------ | -------------------- | -------------------------------------------- |
| Slices                   | kebab-case           | `command-palette`, `switch-locale`           |
| Segments                 | kebab-case           | `ui`, `model`, `lib`, `api`, `config`        |
| Component folder         | PascalCase           | `PaletteInput/`, `RatingBadge/`              |
| Component file           | PascalCase + `.tsx`  | `PaletteInput.tsx`                           |
| Types file               | `<Name>.types.ts`    | `PaletteInput.types.ts`                      |
| Styles file              | `<Name>.module.scss` | `Button.module.scss`                         |
| Hook folder + file       | kebab-case           | `use-search-results/use-search-results.ts`   |
| Helper folder + file     | kebab-case           | `lib/group-results/group-results.ts`         |
| Constants file           | kebab-case           | `config/search.constants.ts`                 |
| React component (export) | PascalCase           | `CommandPalette`                             |
| Hook                     | `use` + camelCase    | `useSearchResults`, `useCommandPaletteHotkey` |
| Utility                  | camelCase            | `groupSearchResults`, `ratingTone`           |
| Props type               | `<Name>Props`        | `PlayerCardProps`                            |
| DTO type                 | `<Name>Input/Output` | `SearchInput`, `LocalePathInput`             |

> Canonical FSD: kebab-case for every file. Three Marks deviates: PascalCase for component folders and files, kebab-case for hooks and utilities.

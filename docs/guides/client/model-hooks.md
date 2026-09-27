# `model/hooks` structure

Part of the [style guide](../../README.md).

### 2.2. `model/hooks` structure

Symmetrical to `ui/`: **every hook gets its own folder**, named after it.

```text
entities/app/locale/model/hooks/
  index.ts                        ← segment barrel
  use-locale/
    use-locale.ts
    use-locale.types.ts           ← Input/Output types, when there are any
    index.ts
    _tests/                       ← a hook with real logic
  use-profile-form/               ← a form hook: useForm + zodResolver + submit ([§15](forms.md))
    use-profile-form.ts
    use-profile-form.types.ts
    index.ts
```

A component calls **one** hook of its own (`use-<component>`), which composes queries,
state, effects and handlers and returns what the JSX needs. A hook's constants, when it has
any, go to the slice's `config/`, not beside the hook.

A hook's `index.ts` re-exports both the hook and its types:

```ts
export { useLocale } from './use-locale';

export type { UseLocale } from './use-locale.types';
```

A hook's input type is named `Use<Name>Input` ([§5](../shared/naming.md)). When it merely repeats a
component's props, don't duplicate it; derive it instead:
`Pick<PeriodSwitcherProps, 'value' | 'onChange'>`.

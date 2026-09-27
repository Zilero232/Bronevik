# Forms

Part of the [style guide](../../README.md).

## 15. Forms — react-hook-form + zodResolver

`react-hook-form` and `@hookform/resolvers/zod` are installed in `apps/client`. Every
form uses them, and the form logic lives in a hook, not the component:

```text
views/me/model/hooks/use-goal-form/
  use-goal-form.ts          ← useForm + zodResolver, submit mutation, setError mapping
  use-goal-form.types.ts
  index.ts
views/me/config/goal-form.constants.ts   ← GOAL_FORM_DEFAULT_VALUES
```

The component calls `useGoalForm()` and renders fields — no `useForm`, `useState` fields
or submit handler in the `.tsx`.

- The schema comes from `@otmetki/schemas`, never inline in the form.
- Default values are a constant in `config/`, not an object literal rebuilt on
  every render.
- Server-side errors go through `setError('field', { message })`.
- Validation messages are i18n keys resolved in the component — the schema never
  carries user-visible prose.

A boolean toggle outside a form uses `useBoolean` from `@siberiacancode/reactuse`
rather than `useState` (`SiteHeader`'s menu, `CommandPaletteProvider`) — except
when the setter is passed into an effect or a ref, where its identity changes
every render.

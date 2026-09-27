# Forms

Part of the [style guide](../../README.md).

## 15. Forms — react-hook-form + zodResolver

`react-hook-form` and `@hookform/resolvers/zod` are installed in `apps/web/client`. Every
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

- The form schema lives in `lib/<x>-form/<x>-form.schemas.ts`. It is a form-shape
  schema (string inputs, refinements, a `transform` to the request) built on the
  contract: every field constraint comes from `@otmetki/schemas` or the generated `z*`
  schema (`shared/api/generated/zod.gen.ts`, re-exported by the slice `api/`), read off
  its `.shape` — `title: z.string().trim().pipe(zCreateClanEvent.shape.title)`,
  `bio: zUpsertCoach.shape.bio.unwrap()`. Limits are never retyped by hand.
- Default values are a constant in `config/`, not an object literal rebuilt on
  every render.
- Server-side errors go through `setError('field', { message })`.
- Validation messages are i18n keys resolved in the component — the schema never
  carries user-visible prose.

A search box or picker is still a form: the input lives in `useForm` (`register` or
`setValue` + `useWatch`), not a `useState` with a hand-written `FormEvent` submit
(`usePlayerLookup`, `useGuessForm`).

### 15.1 Dialog forms — `useFormDialog`

A form in a dialog goes through `useFormDialog` from `@/features/community/form-dialog`
instead of wiring `useForm` itself. It owns the open flag (`useBoolean`), `useForm` with
`zodResolver(schema)` and `mode: 'onTouched'`, the mutation, the success and error toasts,
query invalidation, an optional redirect, and resets the form to `defaults` whenever the
dialog opens or closes:

```ts
const dialog = useFormDialog({
  schema: coachFormSchema,
  defaults: toCoachFormValues({ coach, fallbackAccountId }),
  mutationFn: (values) => saveCoachProfile(toUpsertCoach(values)),
  successMessage: t('profile.saved'),
  errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
  invalidate: QUERY_KEYS.coaching.all
});
```

The component renders `<FormDialog dialog={dialog} …>` with its fields; passing the
`dialog` model whole is the intended API. Reach for plain `useForm` only for a form that
is not a dialog, or one whose submit does not fit a single mutation.

### 15.2 Toggles

A boolean toggle outside a form uses `useBoolean` from `@siberiacancode/reactuse`
rather than `useState` (`SiteHeader`'s menu, `CommandPaletteProvider`) — except
when the setter is passed into an effect or a ref, where its identity changes
every render, or when the next value is computed from the previous one with an
updater (`setIsCompact((was) => …)`), which `useBoolean`'s toggle does not take.

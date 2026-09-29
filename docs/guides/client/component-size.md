# Component size

Part of the [style guide](../README.md).

## 4. Component size

**100 lines per JSX file, maximum.**

Over the line means refactor:

1. Subcomponents → `components/`.
2. Logic → `model/hooks/use-<x>/`.
3. Helpers → the slice's `lib/<concern>/`; constants → `config/<concern>.constants.ts`.

**A multi-export primitive** (`Dialog` ships `Dialog`, `DialogTrigger`, `DialogClose`,
`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`) stays in
one file **as long as it fits the limit** — `ui-kit/molecules/Dialog/Dialog.tsx` is thin
wrappers over `@base-ui/react/dialog`, all of them in under 50 lines. The moment it goes
over, the parts move out into `components/<Name>/` and `<Name>.tsx` stays as a thin
re-export. Group by meaning, not one file per export: closely related parts
(`Header`/`Title`/`Description`) live together.

Subcomponent nesting may go to a second level when a subcomponent has grown of its own
accord. No deeper than that — it is a signal that the block should be lifted into a
slice of its own.

**Context shared between the parts goes in its own module** next to the component, not
inside it: otherwise `components/*` import the parent and the parent imports them. That
is how `features/search/command-palette` is built — the context in
`model/context/command-palette/command-palette-context.ts`, the Provider a component of its
own in `ui/CommandPaletteProvider/`.

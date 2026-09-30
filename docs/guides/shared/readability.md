# Readability

Part of the [style guide](../README.md).

Code is read far more often than it is written. A reader should get the idea of a function from a quick look and never have to decode a line. These rules apply to TypeScript and to the modpack's Python alike; the tools enforce what they can, and review catches the rest.

Sources: the Google Python Style Guide, _The Art of Readable Code_ (Boswell, Foucher), _Clean Code_ (Martin), Kent Beck's rules of simple design, and the Arrange–Act–Assert test pattern.

## One idea per line

- A line does one thing. Split a chain of conditions, calls or maps into named steps.
- No clever one-liners: `a and b and c or d` becomes an `if` or a well-named helper.
- Long argument lists wrap one argument per line; the formatter does this, so keep lines short enough for it to act (see limits below).
- A value used twice gets a name. A name says what the value means, not how it was computed.

```python
# ✗
assert received['received'] and received['tone'] == 'received' and received['ammo_rack'] == 'otmetki:ammo_rack'

# ✓
assert received['received']
assert received['tone'] == 'received'
assert received['ammo_rack'] == 'otmetki:ammo_rack'
```

## Vertical rhythm

- A function is a sequence of steps; a blank line separates steps (setup, work, result). See [blank-lines.md](blank-lines.md) for the exact TypeScript rules — the same idea holds in Python.
- Two blank lines between top-level definitions in Python, one between methods.
- Never two blank lines inside a function.

## Small functions, shallow nesting

- A function fits on one screen (≈ 30 lines) and has one level of abstraction: it either orchestrates named steps or does one concrete thing.
- Return early instead of nesting: guard clauses first, then the main path.
- At most three levels of indentation inside a function. Deeper means a helper is missing.
- A function with many branches is a table: put the cases in a constant (`dict`/`as const` object, `ts-pattern`) and look them up.

## Names

- Names are full words from the domain: `remaining_enemy_hp`, not `rem_hp` or `x`.
- Booleans read as questions: `is_visible`, `has_ammo`, `canDrag`.
- Functions are verbs (`load_replays`, `formatDamage`), data are nouns.
- No abbreviations except the project's glossary (`MoE`, `WN8`, `HP`, `UI`).

## Line length

- TypeScript: Prettier `printWidth` in `prettier.config.mjs`.
- Python: 120 characters (`ruff` `line-length`), translated strings in `i18n` excepted.

## Tests

- A test name states one behaviour: `test_alt_mode_shows_the_note_only_while_alt_is_held`.
- Arrange – Act – Assert, separated by blank lines: build the input, call the unit once, check the result.
- One behaviour per test. Several asserts are fine when they describe one result; a second call to the unit under test means a second test.
- One condition per `assert`/`expect`; never `assert a and b`.
- Build fixtures with named helpers, not inline literal dumps; keep expected values literal (never recompute them the way the code does).
- Test through the public interface (a module's exported functions, a component's rendered output), never private helpers.

```python
def test_alt_mode_rows_carry_the_note_only_while_alt_is_held(self):
    settings = Settings({'alt_mode': True, 'log_lines': 3}, SCHEMA)

    short = damage_log_widget(preview_log(), settings, TRANSLATE)['data']
    extended = damage_log_widget(preview_log(), settings, TRANSLATE, extended=True)['data']

    assert short['detail'] == 'short'
    assert all(row['note'] == '' for row in short['rows'])
    assert extended['detail'] == 'extended'
    assert extended['rows'][0]['note'] == u'Получено ОФ боеукладка'
```

## Modules

- A module has one responsibility and a small public surface; what it hides should be bigger than what it exposes (a deep module). If callers need to know its internals, the seam is in the wrong place.
- Delete code instead of commenting it out; delete helpers nobody calls.
- Prefer a maintained package or the platform (client API, standard library) to custom code — see [.claude/rules/shared/dependencies/reuse-libraries.md](../../../.claude/rules/shared/dependencies/reuse-libraries.md).

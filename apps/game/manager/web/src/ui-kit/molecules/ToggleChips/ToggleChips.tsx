import type { ToggleChipsProps } from './ToggleChips.types';

import s from './ToggleChips.module.scss';

export const ToggleChips = ({ label, chips, value, onChange }: ToggleChipsProps) => (
  <div aria-label={label} className={s.root} role='group'>
    {chips.map((chip) => (
      <button key={chip.value} aria-pressed={chip.value === value} className={s.chip} type='button' onClick={() => onChange(chip.value)}>
        {chip.label}
        {chip.count !== undefined && <span className={s.count}>{chip.count}</span>}
      </button>
    ))}
  </div>
);

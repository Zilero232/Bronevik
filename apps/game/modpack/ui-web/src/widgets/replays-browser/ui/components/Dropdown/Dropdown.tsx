import clsx from 'clsx';
import { useState } from 'preact/hooks';

import type { DropdownProps } from './Dropdown.types';

import { useWheelScroll } from '../../../../../shared/lib/use-wheel-scroll';
import { ReplayIcon } from '../ReplayIcon';

import s from './Dropdown.module.scss';

export const Dropdown = <Value,>({ label, value, options, active = false, onSelect }: DropdownProps<Value>) => {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value);
  const menuRef = useWheelScroll();

  return (
    <div className={s.dropdown}>
      <button aria-expanded={open} className={clsx(s.trigger, active && s.triggerActive)} type='button' onClick={() => setOpen(!open)}>
        <span className={s.label}>{label}</span>
        <span className={s.value}>{current?.label ?? ''}</span>
        <ReplayIcon className={s.chevron} name='chevron' size={14} />
      </button>
      {open && (
        <>
          <button aria-label={label} className={s.backdrop} tabIndex={-1} type='button' onClick={() => setOpen(false)} />
          <div ref={menuRef} className={s.menu} role='listbox'>
            {options.map((option) => (
              <button
                key={String(option.value)}
                aria-selected={option.value === value}
                className={clsx(s.choice, option.value === value && s.choiceOn)}
                role='option'
                type='button'
                onClick={() => {
                  setOpen(false);
                  onSelect(option.value);
                }}
              >
                <span className={s.choiceLabel}>{option.label}</span>
                {option.hint && <span className={s.choiceHint}>{option.hint}</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

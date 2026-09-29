import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { SelectItem } from '../Select.types';

import { Select } from '../Select';

type Region = 'eu' | 'na' | 'ru';

const ITEMS: SelectItem<Region>[] = [
  { value: 'ru', label: 'Russia' },
  { value: 'eu', label: 'Europe' },
  { value: 'na', label: 'America' }
];

describe('Select', () => {
  it('shows the label of the selected item', () => {
    render(<Select aria-label='Region' items={ITEMS} value='eu' onValueChange={vi.fn()} />);

    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveTextContent('Europe');
  });

  it('reports the picked item', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: Region) => void>();

    render(<Select aria-label='Region' items={ITEMS} value='ru' onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox', { name: 'Region' }));
    await user.click(await screen.findByRole('option', { name: 'America' }));

    expect(onValueChange).toHaveBeenCalledWith('na');
  });

  it('keeps a visible label and the trigger in one field', () => {
    const { container } = render(<Select className='sized' items={ITEMS} label='Region' value='eu' onValueChange={vi.fn()} />);

    const field = container.querySelector('.sized');

    expect(field).toContainElement(screen.getByText('Region'));
    expect(field).toContainElement(screen.getByRole('combobox'));
  });
});

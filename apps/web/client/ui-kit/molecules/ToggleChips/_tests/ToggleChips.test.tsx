import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ToggleChip } from '../ToggleChips.types';

import { ToggleChips } from '../ToggleChips';

type Nation = 'china' | 'germany' | 'ussr';

const OPTIONS: ToggleChip<Nation>[] = [
  { value: 'ussr', label: 'USSR' },
  { value: 'germany', label: 'Germany' },
  { value: 'china', label: 'China' }
];

describe('ToggleChips', () => {
  it('marks only the selected chips as pressed', () => {
    render(<ToggleChips aria-label='Nations' options={OPTIONS} value={['germany']} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Germany' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'USSR' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds a chip keeping the options order', () => {
    const onChange = vi.fn<(value: Nation[]) => void>();

    render(<ToggleChips aria-label='Nations' options={OPTIONS} value={['china']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'USSR' }));

    expect(onChange).toHaveBeenCalledWith(['ussr', 'china']);
  });

  it('removes a chip that was pressed again', () => {
    const onChange = vi.fn<(value: Nation[]) => void>();

    render(<ToggleChips aria-label='Nations' options={OPTIONS} value={['ussr', 'germany']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'USSR' }));

    expect(onChange).toHaveBeenCalledWith(['germany']);
  });

  it('prefers the title as the accessible name of an icon chip', () => {
    render(<ToggleChips aria-label='Nations' options={[{ value: 'ussr', label: '★', title: 'USSR' }]} value={[]} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'USSR' })).toBeInTheDocument();
  });
});

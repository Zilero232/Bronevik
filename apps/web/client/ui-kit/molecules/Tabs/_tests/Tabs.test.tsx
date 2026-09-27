import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { TabItem } from '../Tabs.types';

import { Tabs } from '../Tabs';

type Section = 'maps' | 'stats' | 'tanks';

const ITEMS: TabItem<Section>[] = [
  { value: 'stats', label: 'Stats', content: 'Stats panel' },
  { value: 'tanks', label: 'Tanks', content: 'Tanks panel' },
  { value: 'maps', label: 'Maps', content: 'Maps panel' }
];

describe('Tabs', () => {
  it('opens the first tab when nothing is chosen', () => {
    render(<Tabs aria-label='Sections' items={ITEMS} />);

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Stats panel');
  });

  it('reports the clicked tab', () => {
    const onValueChange = vi.fn<(value: Section) => void>();

    render(<Tabs aria-label='Sections' items={ITEMS} value='stats' onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Maps' }));

    expect(onValueChange).toHaveBeenCalledWith('maps');
  });

  it('moves focus between tabs with the arrow keys', async () => {
    const user = userEvent.setup();

    render(<Tabs aria-label='Sections' defaultValue='tanks' items={ITEMS} />);

    await user.tab();

    expect(screen.getByRole('tab', { name: 'Tanks' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Maps' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveFocus();
  });

  it('renders no panels for a tab strip without content', () => {
    render(<Tabs aria-label='Sections' items={ITEMS.map(({ value, label }) => ({ value, label }))} />);

    expect(screen.getAllByRole('tab')).toHaveLength(ITEMS.length);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
});

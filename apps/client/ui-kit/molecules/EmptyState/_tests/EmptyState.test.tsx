import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders the title as a heading with its description and action', () => {
    render(<EmptyState action={<button type='button'>Повторить</button>} code='404' description='Нет боёв' title='Пусто' />);

    expect(screen.getByRole('heading', { name: 'Пусто' })).toBeInTheDocument();
    expect(screen.getByText('Нет боёв')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument();
  });

  it('leaves out the optional parts', () => {
    const { container } = render(<EmptyState title='Пусто' />);

    expect(container.querySelector('p')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

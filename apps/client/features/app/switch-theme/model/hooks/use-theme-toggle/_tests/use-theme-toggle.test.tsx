import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { useThemeToggle } from '../use-theme-toggle';

const LightProbe = () => `isLight=${String(useThemeToggle().isLight)}`;

const createWrapper =
  (defaultTheme: string) =>
  ({ children }: { children: ReactNode }) => (
    <ThemeProvider attribute='class' defaultTheme={defaultTheme} enableSystem={false}>
      {children}
    </ThemeProvider>
  );

afterEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
});

describe('useThemeToggle', () => {
  it('reports a dark theme as not light', () => {
    const { result } = renderHook(() => useThemeToggle(), { wrapper: createWrapper('dark') });

    expect(result.current.isLight).toBe(false);
  });

  it('switches from dark to light and back', () => {
    const { result } = renderHook(() => useThemeToggle(), { wrapper: createWrapper('dark') });

    act(() => result.current.toggle());
    expect(result.current.isLight).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isLight).toBe(false);
  });

  it('starts light when the light theme is chosen', () => {
    const { result } = renderHook(() => useThemeToggle(), { wrapper: createWrapper('light') });

    expect(result.current.isLight).toBe(true);
  });

  it('renders as not light on the server so markup matches before hydration', () => {
    const Wrapper = createWrapper('light');

    expect(renderToString(createElement(Wrapper, null, createElement(LightProbe)))).toContain('isLight=false');
  });
});

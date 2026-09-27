import { h, render } from 'preact';
import { act } from 'preact/test-utils';

import type { HookHandle } from './render-hook.types';

export const renderHook = <Result>(useHook: () => Result): HookHandle<Result> => {
  const container = document.createElement('div');
  const results: Result[] = [];

  const Probe = () => {
    results.push(useHook());

    return null;
  };

  void act(() => {
    render(h(Probe, null), container);
  });

  return {
    current: () => {
      const latest = results.at(-1);

      if (latest === undefined) {
        throw new Error('the hook has not rendered');
      }

      return latest;
    },
    run: (callback) => {
      void act(callback);
    },
    settle: () =>
      act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      }),
    unmount: () => {
      void act(() => {
        render(null, container);
      });
    }
  };
};

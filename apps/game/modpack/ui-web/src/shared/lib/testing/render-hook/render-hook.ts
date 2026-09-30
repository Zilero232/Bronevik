import { act, renderHook as renderReactHook } from '@testing-library/react';

import type { HookHandle } from './render-hook.types';

export const renderHook = <Result>(useHook: () => Result): HookHandle<Result> => {
  const results: Result[] = [];
  const handle = renderReactHook(() => {
    const result = useHook();

    results.push(result);

    return result;
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
      act(callback);
    },
    settle: () =>
      act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      }),
    unmount: handle.unmount
  };
};

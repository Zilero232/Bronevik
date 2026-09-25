export const seededRandom = (seed: number) => {
  let state = seed >>> 0 || 1;

  return () => {
    state = (state + 1_831_565_813) >>> 0;

    let next = state;

    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

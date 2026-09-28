import { uniformFloat64 } from 'pure-rand/distribution/uniformFloat64';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';

export const seededRandom = (seed: number) => {
  const generator = xoroshiro128plus(seed | 0);

  generator.jump();

  return () => uniformFloat64(generator);
};

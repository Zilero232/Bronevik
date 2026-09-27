import type { useEconomyCalculator } from '../../../../../model/hooks';

export type EconomyShellsProps = Pick<ReturnType<typeof useEconomyCalculator>, 'field' | 'values'>;

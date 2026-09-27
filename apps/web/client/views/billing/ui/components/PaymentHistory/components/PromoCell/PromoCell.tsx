import type { PromoCellProps } from './PromoCell.types';

import s from './PromoCell.module.scss';

export const PromoCell = ({ promoCode }: PromoCellProps) =>
  promoCode ? <code className={s.code}>{promoCode}</code> : <span className={s.dim}>—</span>;

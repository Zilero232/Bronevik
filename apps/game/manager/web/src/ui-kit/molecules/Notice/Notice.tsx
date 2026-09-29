import type { NoticeProps } from './Notice.types';

import { NOTICE_ICONS } from './Notice.constants';

import s from './Notice.module.scss';

export const Notice = ({ tone = 'info', title, children, actions }: NoticeProps) => {
  const Icon = NOTICE_ICONS[tone];

  return (
    <div className={s.root} data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon aria-hidden className={s.icon} />
      <div className={s.text}>
        {title && <p className={s.title}>{title}</p>}
        {children && <div className={s.body}>{children}</div>}
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
};

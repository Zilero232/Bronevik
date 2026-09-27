import clsx from 'clsx';

import type { NoticeProps } from './Notice.types';

import s from './Notice.module.scss';

export const Notice = ({ notice }: NoticeProps) => (
  <div className={clsx(s.notice, s[notice.kind])}>
    {notice.text && <span>{notice.text}</span>}
    {notice.code && <textarea readOnly className={s.codeField} value={notice.code} />}
  </div>
);

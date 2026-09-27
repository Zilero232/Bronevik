'use client';

import { useTranslations } from 'next-intl';

import { CHAT_COMMANDS } from '../../../config';

import s from './ChatPreview.module.scss';

export const ChatPreview = () => {
  const t = useTranslations('streamers.tools.commands');
  const tBrand = useTranslations('brand');

  return (
    <ol aria-hidden className={s.root}>
      {CHAT_COMMANDS.map((command) => (
        <li key={command} className={s.pair}>
          <p className={s.line}>
            <span className={s.viewer}>{t('viewer')}</span>
            <span className={s.command}>!{command}</span>
          </p>
          <p data-bot className={s.line}>
            <span className={s.bot}>{tBrand('name')}</span>
            {t(`chat.${command}`)}
          </p>
        </li>
      ))}
    </ol>
  );
};

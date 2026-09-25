'use client';

import { AnimatedCrosshair } from '@bronevik/icons';
import { clsx } from 'clsx';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { POPUP } from '@/shared/lib';

import type { PickableKind, PickableResult } from '../model/hooks';
import type { EntityPickerProps } from './EntityPicker.types';

import { useEntitySearch } from '../model/hooks';
import { PickerOption } from './components';

import s from './EntityPicker.module.scss';

const idOf = (result: PickableResult<PickableKind>) => (result.kind === 'player' ? result.accountId : result.vehicle.tankId);

export const EntityPicker = <K extends PickableKind>({
  kind,
  placeholder,
  excludeIds = [],
  size = 'md',
  isDisabled = false,
  className,
  onPick
}: EntityPickerProps<K>) => {
  const t = useTranslations('players.picker');

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { results, isEnabled, isFetching, isError } = useEntitySearch({ kind, query });

  const visible = results.filter((result) => !excludeIds.includes(idOf(result)));

  const onSelect = (result: PickableResult<K>) => {
    onPick(result);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <Command className={clsx(s.root, s[size], className)} label={placeholder} shouldFilter={false}>
      <div className={s.field}>
        <span aria-hidden className={s.icon}>
          {isFetching ? <AnimatedCrosshair size={18} /> : <Search size={size === 'lg' ? 20 : 16} />}
        </span>
        <Command.Input
          className={s.input}
          disabled={isDisabled}
          placeholder={placeholder}
          value={query}
          onBlur={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onValueChange={(value) => {
            setQuery(value);
            setIsOpen(true);
          }}
        />
      </div>
      <AnimatePresence>
        {isOpen && isEnabled && (
          <motion.div
            animate='visible'
            className={s.popup}
            exit='exit'
            initial='hidden'
            variants={POPUP}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Command.List className={s.list}>
              {!isFetching && <Command.Empty className={s.status}>{isError ? t('error') : t('empty')}</Command.Empty>}
              {visible.map((result) => (
                <Command.Item key={idOf(result)} className={s.item} value={String(idOf(result))} onSelect={() => onSelect(result)}>
                  <PickerOption result={result} />
                </Command.Item>
              ))}
            </Command.List>
          </motion.div>
        )}
      </AnimatePresence>
    </Command>
  );
};

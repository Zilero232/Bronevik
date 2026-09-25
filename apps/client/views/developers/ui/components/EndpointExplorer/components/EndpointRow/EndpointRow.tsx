'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';

import type { EndpointRowProps } from './EndpointRow.types';

import { EndpointDetails } from '../EndpointDetails';
import { MethodBadge } from '../MethodBadge';
import { PathLabel } from '../PathLabel';
import { DETAILS_MOTION } from './EndpointRow.motion';

import s from './EndpointRow.module.scss';

export const EndpointRow = ({ endpoint }: EndpointRowProps) => {
  const [isOpen, toggleOpen] = useBoolean(false);
  const panelId = useId();

  const { method, path, summary } = endpoint;

  return (
    <li className={s.root} data-open={isOpen}>
      <button aria-controls={panelId} aria-expanded={isOpen} className={s.head} type='button' onClick={() => toggleOpen()}>
        <MethodBadge method={method} />
        <PathLabel className={s.path} path={path} />
        {summary && <span className={s.summary}>{summary}</span>}
        <ChevronDown aria-hidden className={s.chevron} size={16} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key='details' className={s.panel} id={panelId} {...DETAILS_MOTION}>
            <EndpointDetails endpoint={endpoint} />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

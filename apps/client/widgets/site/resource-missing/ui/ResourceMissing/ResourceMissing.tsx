'use client';

import { ArrowLeft, SearchX, TriangleAlert } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, RetryButton } from '@/ui-kit';

import type { ResourceMissingProps } from './ResourceMissing.types';

import { RESOURCE_MISSING } from '../../config';

import s from './ResourceMissing.module.scss';

export const ResourceMissing = ({ reason, title, description, back, isRetrying = false, className, onRetry }: ResourceMissingProps) => (
  <EmptyState
    action={
      <div className={s.actions}>
        {reason === 'error' && onRetry && <RetryButton disabled={isRetrying} size='sm' onClick={onRetry} />}
        {back && (
          <Link className={buttonVariants({ variant: reason === 'error' ? 'ghost' : 'secondary', size: 'sm' })} href={back.href}>
            <ArrowLeft aria-hidden size={RESOURCE_MISSING.iconSize} />
            {back.label}
          </Link>
        )}
      </div>
    }
    className={className}
    description={description}
    icon={reason === 'error' ? <TriangleAlert size={RESOURCE_MISSING.iconSize} /> : <SearchX size={RESOURCE_MISSING.iconSize} />}
    title={title}
  />
);

import { CommunityGate } from '@/entities/auth/session';
import { Button, Card, CardBody, CardHeader } from '@/ui-kit';

import type { EntryPanelProps } from './EntryPanel.types';

import s from './EntryPanel.module.scss';

export const EntryPanel = ({ title, isOpen, isPending, onSubmit, submitLabel, hint, status, isDone, exit, children }: EntryPanelProps) => (
  <Card padding='none'>
    <CardHeader title={title} />
    <CardBody className={s.body}>
      {isOpen ? (
        <CommunityGate>
          <form noValidate className={s.form} onSubmit={onSubmit}>
            {children}
            <Button disabled={isPending} size='sm' type='submit'>
              {submitLabel}
            </Button>
            <p className={s.hint}>{hint}</p>
          </form>
        </CommunityGate>
      ) : (
        <>
          <p className={s.state} data-done={isDone}>
            {status}
          </p>
          {exit && (
            <Button disabled={isPending} size='sm' variant='secondary' onClick={exit.onClick}>
              {exit.label}
            </Button>
          )}
        </>
      )}
    </CardBody>
  </Card>
);

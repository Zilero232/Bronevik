import { describe, expect, it } from 'vitest';

import { Prisma } from '../../../../../../generated';
import { PRISMA_CODE } from '../../../prisma.constants';
import { isPrismaRequestError, isTransactionConflict, isUniqueViolation } from '../prisma-error';

const known = (code: string) => new Prisma.PrismaClientKnownRequestError('query failed', { code, clientVersion: 'test' });

describe('isPrismaRequestError', () => {
  it('recognises a known request error and nothing that merely looks like one', () => {
    expect(isPrismaRequestError(known(PRISMA_CODE.notFound))).toBe(true);
    expect(isPrismaRequestError(Object.assign(new Error('x'), { code: PRISMA_CODE.notFound }))).toBe(false);
    expect(isPrismaRequestError(null)).toBe(false);
  });
});

describe('isUniqueViolation and isTransactionConflict', () => {
  it('match only their own code', () => {
    expect(isUniqueViolation(known(PRISMA_CODE.uniqueViolation))).toBe(true);
    expect(isUniqueViolation(known(PRISMA_CODE.transactionConflict))).toBe(false);
    expect(isTransactionConflict(known(PRISMA_CODE.transactionConflict))).toBe(true);
    expect(isTransactionConflict(known(PRISMA_CODE.uniqueViolation))).toBe(false);
  });

  it('reject plain errors', () => {
    expect(isUniqueViolation(new Error(PRISMA_CODE.uniqueViolation))).toBe(false);
    expect(isTransactionConflict(new Error(PRISMA_CODE.transactionConflict))).toBe(false);
  });
});

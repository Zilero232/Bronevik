import type { PrismaRequestError } from './prisma-error.types';

import { Prisma } from '../../../../../generated';
import { PRISMA_CODE } from '../../prisma.constants';

export const isPrismaRequestError = (error: unknown): error is PrismaRequestError => error instanceof Prisma.PrismaClientKnownRequestError;

export const isTransactionConflict = (error: unknown): boolean => isPrismaRequestError(error) && error.code === PRISMA_CODE.transactionConflict;

export const isUniqueViolation = (error: unknown): boolean => isPrismaRequestError(error) && error.code === PRISMA_CODE.uniqueViolation;

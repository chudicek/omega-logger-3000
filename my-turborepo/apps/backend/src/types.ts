import { Result } from '@badrap/result';
import type { Prisma, PrismaClient } from '@prisma/client';

export type PrismaTransactionHandle = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

const genericError = Result.err(new Error('Generic error'));

export default genericError;

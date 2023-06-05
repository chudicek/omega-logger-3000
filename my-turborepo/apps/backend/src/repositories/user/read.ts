import { Result } from '@badrap/result';
import type { User } from '@prisma/client'; // todo remove once types moved to common file
import client from '../client';
import genericError from '../../types';

type UserReadData = { id: string } | { xlogin: string };

type UserReadResult = Promise<Result<User>>; // todo import prisma client correctly

const read = async (data: UserReadData): UserReadResult => {
  try {
    return Result.ok(
      await client.user.findUniqueOrThrow({
        where: {
          ...data,
        },
      })
    );
  } catch (error) {
    return genericError;
  }
};

export default read;

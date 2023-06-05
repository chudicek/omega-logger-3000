import { Result } from '@badrap/result';
import type { User } from '@prisma/client'; // todo remove once types moved to common file
import client from '../client';
import genericError from '../../types';

type UserCreateData = {
  userId: string;
  xlogin: string; // unique within the system (see prisma schema)
};

type UserCreateResult = Promise<Result<User>>; // todo import prisma client correctly

const create = async (data: UserCreateData): UserCreateResult => {
  try {
    const user = await client.user.create({
      data: {
        id: data.userId,
        xlogin: data.xlogin,
      },
    });
    return Result.ok(user);
  } catch (error) {
    return genericError;
  }
};

export default create;

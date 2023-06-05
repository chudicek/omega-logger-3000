import { Result } from '@badrap/result';
import type { User } from '@prisma/client'; // todo remove once types moved to common file
import client from '../client';
import genericError from '../../types';

type UserUpdateData = { id: string } & (
  | {
      username?: string;
      profilePic: string;
    }
  | {
      username: string;
      profilePic?: string;
    }
);

type UserUpdateResult = Promise<Result<User>>; // todo import prisma client correctly

const update = async (data: UserUpdateData): UserUpdateResult => {
  try {
    return Result.ok(
      await client.user.update({
        where: {
          id: data.id,
        },
        data: {
          ...data,
        },
      })
    );
  } catch (error) {
    return genericError;
  }
};

export default update;

// todo @auth : update password & salt?

import { Result } from '@badrap/result';
import type { User } from '@prisma/client'; // todo remove once types moved to common file
import client from '../client';
import genericError from '../../types';

/**
 * Create a repository call that lists all users.
 *
 * @returns - On success: the read users record
 *          - On failure: a generic error
 */

type UserListResult = Promise<Result<User[], Error>>;

const list = async (): UserListResult => {
  try {
    const users = await client.user.findMany();

    return Result.ok(users);
  } catch (error) {
    return genericError;
  }
};

export default list;

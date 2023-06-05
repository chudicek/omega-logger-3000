import { Result } from '@badrap/result';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectExists, checkProjectParticipant } from '../commons';
import type { User } from '@prisma/client';
import { RepositoryError } from '../../../errors';

type ListParticipantsData = {
  callerId: string;
  projectId: string;
};

const list = async (data: ListParticipantsData): Promise<Result<User[]>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectExists(tx, data.projectId),
          checkProjectParticipant(tx, data.callerId, data.projectId, true),
        ]);

        return (
          await tx.projectParticipant.findMany({
            where: {
              projectId: data.projectId,
              deletedAt: null,
            },
            include: {
              user: true,
            },
          })
        ).map((x) => x.user);
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

export default list;

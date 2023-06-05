import { Result } from '@badrap/result';
import type { Project } from '@prisma/client';
import client from '../client';
import genericError from '../../types';
import { checkProjectExists, checkProjectParticipant } from './commons';
import { RepositoryError } from '../../errors';

type ProjectUpdateData = {
  id: string;
  callerId: string; // todo @auth; later from awt
} & (
  | {
      name: string;
      description?: string;
    }
  | {
      name?: string;
      description: string;
    }
);

const update = async (data: ProjectUpdateData): Promise<Result<Project>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        const { id, callerId, ...rest } = data;

        await Promise.all([
          checkProjectParticipant(tx, callerId, id, true),
          checkProjectExists(tx, id),
        ]);

        return await tx.project.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

export default update;

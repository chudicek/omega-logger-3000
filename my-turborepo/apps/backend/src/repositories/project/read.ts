import { Result } from '@badrap/result';
import type { Project } from '@prisma/client';
import client from '../client';
import genericError from '../../types';
import { checkProjectExists, checkProjectParticipant } from './commons';
import { RepositoryError } from '../../errors';

type ProjectReadData = {
  callerId: string;
  id: string;
};

const read = async (data: ProjectReadData): Promise<Result<Project>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.id),
          checkProjectExists(tx, data.id),
        ]);

        return await tx.project.findUniqueOrThrow({
          where: {
            id: data.id,
          },
          include: {
            ProjectParticipant: {
              where: {
                deletedAt: null,
              },
              include: {
                user: true, // todo maybe no need to include stuff
              },
            },
            tasks: {
              where: {
                deletedAt: null,
              },
            },
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

export default read;

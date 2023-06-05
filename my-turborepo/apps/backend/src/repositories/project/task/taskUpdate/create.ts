import { Result } from '@badrap/result';
import type { TaskUpdate } from '@prisma/client';
import client from '../../../client';
import genericError from '../../../../types';
import {
  checkProjectExists,
  checkProjectParticipant,
  checkTaskBelongsToProject,
} from '../../commons';
import { RepositoryError } from '../../../../errors';

type CreateTaskUpdateData = {
  callerId: string;
  projectId: string;
  name: string;
  taskId: string;
  content: string;
};

const create = async (
  data: CreateTaskUpdateData
): Promise<Result<TaskUpdate>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectExists(tx, data.projectId),
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkTaskBelongsToProject(tx, data.taskId, data.projectId),
        ]);

        const taskUpdate = await tx.taskUpdate.create({
          data: {
            name: data.name,
            content: data.content,
            creator: {
              connect: {
                id: data.callerId,
              },
            },
            task: {
              connect: {
                id: data.taskId,
              },
            },
          },
        });

        return taskUpdate;
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

export default create;

import { Result } from '@badrap/result';
import type { TaskUpdate } from '@prisma/client';
import client from '../../../client';
import {
  checkProjectExists,
  checkProjectParticipant,
  checkTaskExists,
  checkTaskBelongsToProject,
  checkTaskUpdateBelongsToTask,
} from '../../commons';
import genericError from '../../../../types';
import { RepositoryError } from '../../../../errors';

type ReadTaskUpdateData = {
  callerId: string;
  projectId: string;
  taskId: string;
  taskUpdateId: string;
};

const read = async (data: ReadTaskUpdateData): Promise<Result<TaskUpdate>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectExists(tx, data.projectId),
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkTaskExists(tx, data.taskId),
          checkTaskBelongsToProject(tx, data.taskId, data.projectId),
          checkTaskUpdateBelongsToTask(tx, data.taskId, data.taskUpdateId),
        ]);

        const taskUpdate = await tx.taskUpdate.findFirstOrThrow({
          where: {
            id: data.taskUpdateId,
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

export default read;

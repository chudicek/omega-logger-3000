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

type ListTaskUpdateData = {
  callerId: string;
  projectId: string;
  taskId: string;
};

/**
 * reads all the task updates of a task
 * (if the sent data is valid ie the task belongs to the project and the caller is a participant of the project)
 */
const list = async (
  data: ListTaskUpdateData
): Promise<Result<TaskUpdate[]>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectExists(tx, data.projectId),
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkTaskBelongsToProject(tx, data.taskId, data.projectId),
        ]);

        const taskUpdates = await tx.taskUpdate.findMany({
          where: {
            // deletedAt: null, // those do not have a deletedAt field
            taskId: data.taskId,
          },
        });

        return taskUpdates;
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

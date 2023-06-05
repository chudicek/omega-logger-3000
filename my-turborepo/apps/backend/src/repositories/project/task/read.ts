import { Result } from '@badrap/result';
import type { Task } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectParticipant, checkProjectExists } from '../commons';
import { RepositoryError } from '../../../errors';

type CreateTaskData = {
  callerId: string;
  projectId: string;
  taskId: string;
};

const read = async (data: CreateTaskData): Promise<Result<Task>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        const task = await tx.task.findFirstOrThrow({
          where: {
            id: data.taskId,
            deletedAt: null,
            projectId: data.projectId,
          },
          include: {
            taskUpdates: true,
          },
        });

        return task;
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

import { Result } from '@badrap/result';
import type { Task } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import {
  checkProjectParticipant,
  checkProjectExists,
  checkTaskExists,
} from '../commons';
import { RepositoryError } from '../../../errors';

type UpdateTaskData = {
  projectId: string;
  taskId: string;
  callerId: string;
} & (
  | {
      name: string;
      description?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      deadline?: Date;
      state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
    }
  | {
      name?: string;
      description: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      deadline?: Date;
      state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
    }
  | {
      name?: string;
      description?: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
      deadline?: Date;
      state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
    }
  | {
      name?: string;
      description?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      deadline: Date;
      state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
    }
  | {
      name?: string;
      description?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH';
      deadline?: Date;
      state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
    }
);

const update = async (data: UpdateTaskData): Promise<Result<Task>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        const { projectId, taskId, callerId, ...updateData } = data;

        await Promise.all([
          checkProjectParticipant(tx, callerId, projectId),
          checkProjectExists(tx, projectId),
          checkTaskExists(tx, taskId),
        ]);

        const task = await tx.task.update({
          where: {
            id: taskId,
          },
          data: updateData,
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

export default update;

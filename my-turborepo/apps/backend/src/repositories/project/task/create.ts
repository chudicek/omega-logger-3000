import { Result } from '@badrap/result';
import type { Task } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectParticipant, checkProjectExists } from '../commons';
import { RepositoryError } from '../../../errors';

type CreateTaskData = {
  callerId: string;
  projectId: string;
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
  deadline: Date;
};

const create = async (data: CreateTaskData): Promise<Result<Task>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        // todo maybe check if caller is not deleted but fck that for now

        const task = await tx.task.create({
          data: {
            name: data.name,
            description: data.description,
            priority: data.priority,
            state: data.state,
            deadline: data.deadline,
            creator: {
              connect: {
                id: data.callerId,
              },
            },
            project: {
              connect: {
                id: data.projectId,
              },
            },
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

export default create;

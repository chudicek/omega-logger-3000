import { Result } from '@badrap/result';
import type { Priority, State, Task } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectExists, checkProjectParticipant } from '../commons';
import { RepositoryError } from '../../../errors';

type ListTasksData = {
  projectId: string;
  callerId: string;
  orderBy: string;
  searchName?: string | undefined;
  priorityFilter?: string | undefined;
  stateFilter?: string | undefined;
};

type ListTasksResult = Promise<Result<Task[], Error>>;

/**
 * repository call that retreives all tasks of a project.
 *
 * @param data - The data required to list tasks
 * @returns - On success: the list of tasks
 *          - On failure: a generic error
 */
const list = async (data: ListTasksData): ListTasksResult => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        const tasks = await tx.task.findMany({
          where: {
            deletedAt: null,
            projectId: data.projectId,
          },
          orderBy: {
            [data.orderBy]: 'asc',
          },
        });

        return applyFilters(tasks, data);
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

const applyFilters = (tasks: Task[], data: ListTasksData) => {
  return tasks.filter((task) => {
    if (data.priorityFilter != '') {
      const priority = data.priorityFilter as Priority;

      if (priority != task.priority) return false;
    }

    if (data.stateFilter != '') {
      const state = data.stateFilter as State;

      if (state != task.state) return false;
    }

    return task.name.includes(data.searchName ?? '');
  });
};

export default list;

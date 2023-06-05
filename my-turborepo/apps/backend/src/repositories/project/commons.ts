import { RepositoryError } from '../../errors';
import type { PrismaTransactionHandle } from '../../types';

export const checkProjectParticipant = async (
  transaction: PrismaTransactionHandle,
  userId: string,
  projectId: string,
  isOwner = false
) => {
  const participant = await transaction.projectParticipant.findFirst({
    where: {
      userId,
      projectId,
      deletedAt: null,
    },
  });

  if (!participant) {
    throw new RepositoryError('User is not a participant of the project', 404);
  }

  if (isOwner && !participant.isOwner) {
    throw new RepositoryError('User is not the project owner', 400);
  }
};

export const checkProjectParticipantIsUnique = async (
  transaction: PrismaTransactionHandle,
  userId: string,
  projectId: string
) => {
  const participant = await transaction.projectParticipant.findFirst({
    where: {
      userId,
      projectId,
      deletedAt: null,
    },
  });

  if (participant) {
    throw new RepositoryError(
      'User is already a participant of the project',
      400
    );
  }
};

export const checkProjectExists = async (
  transaction: PrismaTransactionHandle,
  projectId: string
) => {
  const project = await transaction.project.findFirst({
    where: {
      id: projectId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new RepositoryError('Project does not exist', 404);
  }
};

export const checkTaskUpdateBelongsToTask = async (
  transaction: PrismaTransactionHandle,
  taskId: string,
  taskUpdateId: string
) => {
  const taskUpdate = await transaction.taskUpdate.findFirst({
    where: {
      id: taskUpdateId,
      taskId,
    },
  });

  if (!taskUpdate) {
    throw new RepositoryError('Task update does not exist', 404);
  }
};

export const checkTaskExists = async (
  transaction: PrismaTransactionHandle,
  taskId: string
) => {
  const task = await transaction.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
    },
  });

  if (!task) {
    throw new RepositoryError('Task does not exist', 404);
  }
};

export const checkTaskBelongsToProject = async (
  transaction: PrismaTransactionHandle,
  taskId: string,
  projectId: string
) => {
  const task = await transaction.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
  });

  if (!task) {
    throw new RepositoryError('Task does not exist', 404);
  }
};

export const xloginToUserId = async (
  transaction: PrismaTransactionHandle,
  xlogin: string
) => {
  const user = await transaction.user.findFirst({
    where: {
      xlogin,
    },
  });

  if (!user) {
    throw new RepositoryError('User does not exist', 404);
  }

  return user.id;
};

import { Result } from '@badrap/result';
import type { Project } from '@prisma/client';
import client from '../client';
import genericError from '../../types';
import { RepositoryError } from '../../errors';

type ListProjectData = {
  callerId: string;
};

const list = async (data: ListProjectData): Promise<Result<Project[]>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        const targetParticipantsWithProjects =
          await tx.projectParticipant.findMany({
            where: {
              userId: data.callerId,
              deletedAt: null,
            },
            include: {
              project: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

        const undeletedProjectsOfCaller = targetParticipantsWithProjects
          .map((participant) => participant.project)
          // filter should not be necessary (deleted project should imply deleted projectParticipant); safeguard
          .filter((project) => project.deletedAt == null);

        return undeletedProjectsOfCaller;
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

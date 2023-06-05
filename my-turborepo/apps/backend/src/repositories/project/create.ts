import { Result } from '@badrap/result';
import type { Project } from '@prisma/client';
import client from '../client';
import genericError from '../../types';
import { RepositoryError } from '../../errors';

type ProjectCreateData = {
  name: string;
  description: string;
  creatorId: string; // todo @auth; later from awt
};

const create = async (data: ProjectCreateData): Promise<Result<Project>> => {
  try {
    return Result.ok(
      await client.project.create({
        data: {
          name: data.name,
          description: data.description,
          ProjectParticipant: {
            create: {
              user: {
                connect: { id: data.creatorId },
              },
              isOwner: true,
            },
          },
        },

        include: {
          ProjectParticipant: {
            include: {
              user: true, // todo maybe no need to include stuff
            },
          },
        },
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

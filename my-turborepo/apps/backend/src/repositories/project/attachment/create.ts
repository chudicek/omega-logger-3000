import { Result } from '@badrap/result';
import type { Attachment } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectExists, checkProjectParticipant } from '../commons';
import { RepositoryError } from '../../../errors';

type CreateAttachmentData = {
  callerId: string;
  name: string;
  projectId: string;
};

const create = async (
  data: CreateAttachmentData
): Promise<Result<Attachment>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        return await tx.attachment.create({
          data: {
            name: data.name,
            project: {
              connect: {
                id: data.projectId,
              },
            },
          },
        });
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

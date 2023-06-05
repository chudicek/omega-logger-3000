import { Result } from '@badrap/result';
import type { Attachment } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectExists, checkProjectParticipant } from '../commons';
import { RepositoryError } from '../../../errors';

type ReadAttachmentData = {
  callerId: string;
  attachmentId: string;
  projectId: string;
};

const remove = async (
  data: ReadAttachmentData
): Promise<Result<Attachment>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId, true),
          checkProjectExists(tx, data.projectId),
        ]);

        const attachment = await tx.attachment.update({
          where: {
            id: data.attachmentId,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        if (attachment == null) {
          throw new Error('Attachment not found');
        }

        return attachment;
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

export default remove;

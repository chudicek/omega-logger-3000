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

const read = async (data: ReadAttachmentData): Promise<Result<Attachment>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        const attachment = await tx.attachment.findFirst({
          where: {
            id: data.attachmentId,
            deletedAt: null,
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

export default read;

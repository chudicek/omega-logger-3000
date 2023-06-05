import { Result } from '@badrap/result';
import type { Attachment } from '@prisma/client';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectExists, checkProjectParticipant } from '../commons';
import { RepositoryError } from '../../../errors';

type ListAttachmentData = {
  callerId: string;
  projectId: string;
};

const list = async (
  data: ListAttachmentData
): Promise<Result<Attachment[]>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await Promise.all([
          checkProjectParticipant(tx, data.callerId, data.projectId),
          checkProjectExists(tx, data.projectId),
        ]);

        const attachments = await tx.attachment.findMany({
          where: {
            projectId: data.projectId,
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return attachments;
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

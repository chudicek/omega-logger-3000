import { Result } from '@badrap/result';
import client from '../../client';
import genericError from '../../../types';
import { checkProjectParticipant } from '../commons';
import { RepositoryError } from '../../../errors';

type RemoveParticipantData = {
  callerId: string;
  projectId: string;
} & (
  | {
      userId: string;
    }
  | {
      xlogin: string;
    }
);

const remove = async (data: RemoveParticipantData): Promise<Result<void>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await checkProjectParticipant(tx, data.callerId, data.projectId, true);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { callerId, ...dataWithoutCallerId } = data; // todo @auth; use callerId

        await tx.projectParticipant.updateMany({
          // update many -> this way the call 'succeeds' even if the user is not a participant
          where: {
            ...dataWithoutCallerId,
            deletedAt: null,
            isOwner: false, // cannot remove owner
          },
          data: {
            deletedAt: new Date(),
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

export default remove;

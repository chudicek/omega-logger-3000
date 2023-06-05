import { Result } from '@badrap/result';
import client from '../../client';
import genericError from '../../../types';
import {
  checkProjectParticipant,
  checkProjectParticipantIsUnique,
  xloginToUserId,
} from '../commons';
import { RepositoryError } from '../../../errors';

type AddParticipantData = {
  callerId: string;
  // userId: string;
  projectId: string;
} & (
  | {
      userId: string;
    }
  | {
      xlogin: string;
    }
);

const add = async (data: AddParticipantData): Promise<Result<void>> => {
  try {
    return Result.ok(
      await client.$transaction(async (tx) => {
        await checkProjectParticipant(tx, data.callerId, data.projectId, true);

        const userId =
          'userId' in data
            ? data.userId
            : await xloginToUserId(tx, data.xlogin);

        await checkProjectParticipantIsUnique(tx, userId, data.projectId);

        await tx.projectParticipant.create({
          data: {
            project: {
              connect: {
                id: data.projectId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return undefined;
      })
    );
  } catch (error) {
    if (error instanceof RepositoryError) {
      return Result.err(error);
    }
    return genericError;
  }
};

export default add;

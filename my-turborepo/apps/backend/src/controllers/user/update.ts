import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import userRepo from '../../repositories/user';
import handleError from '../common';

const requestParamSchema = z
  .object({
    id: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z // TODO @auth-old caller id is in body, maybe change
  .object({
    callerId: z.string().nonempty(),
    username: z.string().nonempty(),
    profilePic: z.string().nonempty().optional(),
  })
  .or(
    z.object({
      callerId: z.string().nonempty(),
      username: z.string().nonempty().optional(),
      profilePic: z.string().nonempty(),
    })
  );

const updateUser = async (req: Request, res: Response) => {
  try {
    const params = requestParamSchema.parse(req.params);
    requestQuerySchema.parse(req.query); // check empty
    const body = requestBodySchema.parse(req.body);

    if (params.id !== body.callerId) {
      throw new Error('Unauthorized');
    }

    const bullshit = {
      id: body.callerId,
      ...(body.username
        ? { username: body.username }
        : { profilePic: body.profilePic }),
      ...(body.profilePic
        ? { profilePic: body.profilePic }
        : { username: body.username }),
    } as {
      id: string;
    } & (
      | {
          username?: string;
          profilePic: string;
        }
      | {
          username: string;
          profilePic?: string;
        }
    );

    const updatedUser = await userRepo.update(bullshit);
    const userUpdateResultUnwrapped = updatedUser.unwrap();

    const response: ApiResponse<typeof userUpdateResultUnwrapped> = {
      status: 'success',
      data: userUpdateResultUnwrapped,
      message: 'User updated successfully',
    };

    return res.status(200).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default updateUser;

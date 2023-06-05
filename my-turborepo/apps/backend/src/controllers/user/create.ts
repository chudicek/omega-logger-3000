import type { Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import userRepo from '../../repositories/user';
import handleError from '../common';
import { env } from 'process';

import type { RequestAndCallerId } from '../types';

const requestParamSchema = z.object({}).strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({}).strict();

const createUser = async (req: RequestAndCallerId, res: Response) => {
  try {
    await Promise.all([
      // check all empty
      requestParamSchema.parseAsync(req.params),
      requestQuerySchema.parseAsync(req.query),
      requestBodySchema.parseAsync(req.body),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const email = req.auth?.payload[
      env['KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN']!
    ] as string;

    const createdUser = await userRepo.create({
      userId: callerId,
      xlogin: email,
    });
    const userCreateResultUnwrapped = createdUser.unwrap();

    const response: ApiResponse<typeof userCreateResultUnwrapped> = {
      status: 'success',
      data: userCreateResultUnwrapped,
      message: 'User created successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default createUser;

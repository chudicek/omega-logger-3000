import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import participantRepo from '../../repositories/project/participant';
import handleError from '../common';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
  })
  .strict();

const requestQuerySchema = z.object({}).strict();

const requestBodySchema = z
  .object({
    userId: z.string().nonempty(), // the id of the user to add to the project
  })
  .or(
    z.object({
      xlogin: z.string().nonempty(), // the xlogin of the user to add to the project
    })
  );

const add = async (req: Request, res: Response) => {
  try {
    const [params, body /*, unused */] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query), // no return value; check empty
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('Caller id not found');
    }

    (
      await participantRepo.add({
        callerId,
        ...body,
        ...params,
      })
    ).unwrap(); // do not forget to unwrap to detect errors

    const response: ApiResponse<void> = {
      status: 'success',
      data: undefined,
      message: 'User added to project successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default add;

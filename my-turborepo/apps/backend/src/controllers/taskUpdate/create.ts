import type { Request, Response } from 'express';
import { z } from 'zod';
import handleError from '../common';
import type { ApiResponse } from '../types';
import taskUpdateRepo from '../../repositories/project/task/taskUpdate';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
    taskId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z
  .object({
    name: z.string().nonempty(),
    content: z.string().nonempty(),
  })
  .strict();

const create = async (req: Request, res: Response) => {
  try {
    const [params, body /*, unused */] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query), // no return value; check empty
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const taskUpdate = (
      await taskUpdateRepo.create({
        callerId,
        ...body,
        ...params,
      })
    ).unwrap();

    const response: ApiResponse<typeof taskUpdate> = {
      status: 'success',
      data: taskUpdate,
      message: 'Task update created successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default create;

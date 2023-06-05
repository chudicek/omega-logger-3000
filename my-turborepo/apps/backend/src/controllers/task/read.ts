import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import handleError from '../common';
import taskRepo from '../../repositories/project/task';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
    taskId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({}).strict();

const read = async (req: Request, res: Response) => {
  try {
    const [params] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestQuerySchema.parseAsync(req.query),
      requestBodySchema.parseAsync(req.body),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const task = (
      await taskRepo.read({
        callerId,
        projectId: params.projectId,
        taskId: params.taskId,
      })
    ).unwrap();

    const response: ApiResponse<typeof task> = {
      status: 'success',
      data: task,
      message: 'Task created successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default read;

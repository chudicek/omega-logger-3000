import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import handleError from '../common';
import taskRepo from '../../repositories/project/task';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']),
  deadline: z.string().transform((value) => new Date(value)),
});

const create = async (req: Request, res: Response) => {
  try {
    const [params, body] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const task = (
      await taskRepo.create({
        callerId,
        projectId: params.projectId,
        name: body.name,
        description: body.description,
        priority: body.priority,
        state: body.state,
        deadline: body.deadline,
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

export default create;

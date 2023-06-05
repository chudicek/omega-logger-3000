import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import handleError from '../common';
import taskRepo from '../../repositories/project/task';

const requestParamSchema = z
  .object({ projectId: z.string().nonempty(), taskId: z.string().nonempty() })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z
  .object({
    name: z.string().nonempty(),
    description: z.string().nonempty().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    deadline: z
      .string()
      .transform((value) => new Date(value))
      .optional(),
    state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']).optional(),
  })
  .or(
    z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      deadline: z
        .string()
        .transform((value) => new Date(value))
        .optional(),
      state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']).optional(),
    })
  )
  .or(
    z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      deadline: z
        .string()
        .transform((value) => new Date(value))
        .optional(),
      state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']).optional(),
    })
  )
  .or(
    z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      deadline: z.string().transform((value) => new Date(value)),
      state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']).optional(),
    })
  )
  .or(
    z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      deadline: z
        .string()
        .transform((value) => new Date(value))
        .optional(),
      state: z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE']),
    })
  );

const update = async (req: Request, res: Response) => {
  try {
    const [params, body /*, query*/] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const megabullshit = {
      projectId: params.projectId,
      taskId: params.taskId,
      callerId,
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.priority && { priority: body.priority }),
      ...(body.deadline && { deadline: body.deadline }),
      ...(body.state && { state: body.state }),
    } as {
      projectId: string;
      taskId: string;
      callerId: string;
    } & (
      | {
          name: string;
          description?: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH';
          deadline?: Date;
          state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
        }
      | {
          name?: string;
          description: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH';
          deadline?: Date;
          state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
        }
      | {
          name?: string;
          description?: string;
          priority: 'LOW' | 'MEDIUM' | 'HIGH';
          deadline?: Date;
          state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
        }
      | {
          name?: string;
          description?: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH';
          deadline: Date;
          state?: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
        }
      | {
          name?: string;
          description?: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH';
          deadline?: Date;
          state: 'TODO' | 'SENT_FOR_REVIEW' | 'DONE';
        }
    );

    const task = (
      await taskRepo.update({
        ...megabullshit,
      })
    ).unwrap();

    const response: ApiResponse<typeof task> = {
      status: 'success',
      data: task,
      message: 'Task updated successfully',
    };

    return res.status(200).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default update;

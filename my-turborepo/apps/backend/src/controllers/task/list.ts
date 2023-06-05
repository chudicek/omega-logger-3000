import type { Request, Response } from 'express';
import { z } from 'zod';
import handleError from '../common';
import taskRepo from '../../repositories/project/task';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z
  .object({
    orderBy: z.string(),
    searchName: z.string().optional(),
    priorityFilter: z.string().optional(),
    stateFilter: z.string().optional(),
  })
  .strict();
const requestBodySchema = z.object({});

const listTasks = async (req: Request, res: Response) => {
  try {
    const [params, queryParams, body] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestQuerySchema.parseAsync(req.query),
      requestBodySchema.parseAsync(req.body),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    validateOrderAndFilters(queryParams);

    const tasks = (
      await taskRepo.list({
        callerId,
        projectId: params.projectId,
        ...body,
        ...queryParams,
      })
    ).unwrap();

    return res.status(200).send({
      status: 'success',
      data: tasks,
      message: 'Tasks read successfully',
    });
  } catch (e) {
    return handleError(e, res);
  }
};

type QueryType = {
  orderBy: string;
  searchName?: string | undefined;
  priorityFilter?: string | undefined;
  stateFilter?: string | undefined;
};

const validateOrderAndFilters = (body: QueryType) => {
  const orders = z.enum([
    'id',
    'name',
    'description',
    'createdAt',
    'state',
    'weight',
    'priority',
    'deadline',
  ]);
  orders.parse(body.orderBy);

  if (body.priorityFilter !== undefined) {
    const priorities = z.enum(['LOW', 'MEDIUM', 'HIGH', '']);
    priorities.parse(body.priorityFilter);
  }

  if (body.stateFilter !== undefined) {
    const states = z.enum(['TODO', 'SENT_FOR_REVIEW', 'DONE', '']);
    states.parse(body.stateFilter);
  }
};

export default listTasks;

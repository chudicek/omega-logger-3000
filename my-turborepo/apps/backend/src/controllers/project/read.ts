import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import projectRepo from '../../repositories/project';
import handleError from '../common';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({});

const read = async (req: Request, res: Response) => {
  try {
    const [params /*, _emptyQuery, _emptyBody*/] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestQuerySchema.parseAsync(req.query), // check empty
      requestBodySchema.parseAsync(req.body), // check empty
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const readProject = (
      await projectRepo.read({
        id: params.projectId,
        callerId,
      })
    ).unwrap();

    const response: ApiResponse<typeof readProject> = {
      status: 'success',
      data: readProject,
      message: 'Project read successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default read;

import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import projectRepo from '../../repositories/project';
import handleError from '../common';

const requestParamSchema = z.object({}).strict();
const requestBodySchema = z.object({}).strict();
const requestQuerySchema = z.object({}).strict();

const list = async (req: Request, res: Response) => {
  try {
    /* const [_emptyParams, _emptyBody, _emptyQuery] =*/ await Promise.all([
      requestParamSchema.parseAsync(req.params), // check empty
      requestBodySchema.parseAsync(req.body), // check empty
      requestQuerySchema.parseAsync(req.query), // check empty
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub missing from auth payload');
    }

    const usersProjects = (
      await projectRepo.list({
        callerId,
      })
    ).unwrap();

    const response: ApiResponse<typeof usersProjects> = {
      status: 'success',
      data: usersProjects,
      message: 'Projects listed successfully',
    };

    return res.status(200).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default list;

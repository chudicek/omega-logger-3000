import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import projectRepo from '../../repositories/project';
import handleError from '../common';

const requestParamSchema = z.object({}).strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

const createProject = async (req: Request, res: Response) => {
  try {
    const [body] = await Promise.all([
      requestBodySchema.parseAsync(req.body),
      requestParamSchema.parseAsync(req.params),
      requestQuerySchema.parseAsync(req.query),
    ]);

    const creatorId = req.auth?.payload.sub;
    if (!creatorId) {
      throw new Error('sub missing from auth payload');
    }

    const createdProject = await projectRepo.create({ ...body, creatorId });
    const createdProjectUnwrapped = createdProject.unwrap();

    const response: ApiResponse<typeof createdProjectUnwrapped> = {
      status: 'success',
      data: createdProjectUnwrapped,
      message: 'Project created successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default createProject;

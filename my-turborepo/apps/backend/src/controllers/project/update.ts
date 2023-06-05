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
const requestBodySchema = z
  .object({
    name: z.string().nonempty().optional(),
    description: z.string().nonempty(),
  })
  .or(
    z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty().optional(),
    })
  );

const updateProject = async (req: Request, res: Response) => {
  try {
    const [params, body] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query),
    ]);

    const callerId = req.auth?.payload.sub;
    if (!callerId) {
      throw new Error('sub not found in auth payload');
    }

    const updateData = {
      id: params.projectId,
      callerId,
      ...(body.name ? { name: body.name } : { description: body.description }),
      ...(body.description
        ? { description: body.description }
        : { name: body.name }),
    } as {
      id: string;
      callerId: string;
    } & (
      | {
          name: string;
          description?: string;
        }
      | {
          name?: string;
          description: string;
        }
    );

    const updatedProject = (await projectRepo.update(updateData)).unwrap();

    const response: ApiResponse<typeof updatedProject> = {
      status: 'success',
      data: updatedProject,
      message: 'Project updated successfully',
    };

    return res.status(200).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default updateProject;

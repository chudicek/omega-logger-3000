import type { Request, Response } from 'express';
import { z } from 'zod';
import handleError from '../common';
import type { ApiResponse } from '../types';
import attachmentRepo from '../../repositories/project/attachment';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z.object({
  callerId: z.string().nonempty(), // todo Remove if we ever want to use attachment
  name: z.string().nonempty(),
});

const create = async (req: Request, res: Response) => {
  try {
    const params = requestParamSchema.parse(req.params);
    requestQuerySchema.parse(req.query); // check empty
    const body = requestBodySchema.parse(req.body);

    const attachment = (
      await attachmentRepo.create({
        callerId: body.callerId,
        projectId: params.projectId,
        name: body.name,
      })
    ).unwrap();

    const response: ApiResponse<typeof attachment> = {
      status: 'success',
      data: attachment,
      message: 'Task created successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default create;

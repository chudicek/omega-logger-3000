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
const requestBodySchema = z
  .object({
    callerId: z.string().nonempty(), // the id of the user performing the call // todo @auth
    attachmentId: z.string().nonempty(),
  })
  .strict();

const remove = async (req: Request, res: Response) => {
  try {
    const [params, body /*, unused */] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query), // no return value; check empty
    ]);

    const deleted = (
      await attachmentRepo.remove({
        ...body,
        ...params,
      })
    ).unwrap();

    const response: ApiResponse<typeof deleted> = {
      status: 'success',
      data: deleted,
      message: 'Attachment deleted successfully',
    };

    return res.status(204).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default remove;

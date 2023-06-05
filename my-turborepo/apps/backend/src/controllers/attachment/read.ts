import type { Request, Response } from 'express';
import { z } from 'zod';
import handleError from '../common';
import type { ApiResponse } from '../types';
import attachmentRepo from '../../repositories/project/attachment';

const requestParamSchema = z
  .object({
    projectId: z.string().nonempty(),
    attachmentId: z.string().nonempty(),
  })
  .strict();
const requestQuerySchema = z.object({}).strict();
const requestBodySchema = z
  .object({
    callerId: z.string().nonempty(), // the id of the user performing the call // todo @auth
  })
  .strict();

const read = async (req: Request, res: Response) => {
  try {
    const [params, body /*, unused */] = await Promise.all([
      requestParamSchema.parseAsync(req.params),
      requestBodySchema.parseAsync(req.body),
      requestQuerySchema.parseAsync(req.query), // no return value; check empty
    ]);

    const attachment = (
      await attachmentRepo.read({
        ...body,
        ...params,
      })
    ).unwrap();

    const response: ApiResponse<typeof attachment> = {
      status: 'success',
      data: attachment,
      message: 'Attachment retrieved successfully',
    };

    return res.status(200).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default read;

import type { Request, Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from '../types';
import userRepo from '../../repositories/user';
import handleError from '../common';

const requestBodySchema = z.object({}).strict();
const requestQuerySchema = z.object({}).strict();
const requestParamSchema = z
  .object({
    id: z.string().nonempty(),
  })
  .strict();

const readUser = async (req: Request, res: Response) => {
  try {
    requestBodySchema.parse(req.body); // check empty
    requestQuerySchema.parse(req.query); // check empty
    const params = requestParamSchema.parse(req.params);

    const user = (await userRepo.read(params)).unwrap();

    const response: ApiResponse<typeof user> = {
      status: 'success',
      data: user,
      message: 'User read successfully',
    };

    return res.status(201).send(response);
  } catch (e) {
    return handleError(e, res);
  }
};

export default readUser;

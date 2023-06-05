import type { Request, Response } from 'express';
import userRepo from '../../repositories/user';
import handleError from '../common';

const list = async (_req: Request, res: Response) => {
  try {
    const result = (await userRepo.list()).unwrap();

    return res.status(200).send({
      status: 'success',
      data: result,
      message: 'Users read successfully',
    });
  } catch (e) {
    return handleError(e, res);
  }
};

export default list;

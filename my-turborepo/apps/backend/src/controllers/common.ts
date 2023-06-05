import type { Response } from 'express';
import { z } from 'zod';
import type { ApiResponse } from './types';
import { RepositoryError } from '../errors';

// stolen from Tomas Sedlacek's video tbh

const handleError = (e: unknown, res: Response) => {
  if (e instanceof z.ZodError) {
    const response: ApiResponse<typeof e> = {
      status: 'failure',
      data: e,
      error: e.message,
    };

    return res.status(400).send(response);
  }

  if (e instanceof RepositoryError) {
    const response: ApiResponse<typeof e> = {
      status: 'failure',
      data: e,
      error: e.message,
    };

    return res.status(e.status).send(response);
  }

  if (e instanceof Error) {
    const response: ApiResponse<typeof e> = {
      status: 'failure',
      data: e,
      error: e.message,
    };

    return res.status(500).send(response);
  }

  const response: ApiResponse<void> = {
    status: 'failure',
    data: undefined,
    error: 'Something went really wrong',
  };

  return res.status(500).send(response);
};

export default handleError;

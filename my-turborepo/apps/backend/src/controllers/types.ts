import type { Request } from 'express';

export type ApiResponse<T> =
  | {
      status: 'success';
      data: T;
      message: string;
    }
  | {
      status: 'failure';
      data: T;
      error: string;
    };

// necessary so that you can then assign userId to req
export type RequestAndCallerId = Request & { callerId?: string };

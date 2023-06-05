import express from 'express';
import cors from 'cors';
import { config as configEnvVariables } from 'dotenv';
import { env } from 'process';
import type { ApiResponse } from './controllers/types';
import user from './routes/user';
import project from './routes/project';

configEnvVariables();
const PORT = env['PORT'];
const CORS_ORIGIN = env['CORS_ORIGIN'];
const AUTH0_DOMAIN = env['AUTH0_DOMAIN'];
// const AUTH0_CLIENT_ID = env['AUTH0_CLIENT_ID'];
const AUTH0_AUDIENCE = env['AUTH0_AUDIENCE'];
const KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN =
  env['KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN']; // used in authMiddleware.ts; here only checked for existence in env
if (
  !(
    PORT &&
    CORS_ORIGIN &&
    AUTH0_DOMAIN /*&& AUTH0_CLIENT_ID */ &&
    AUTH0_AUDIENCE &&
    KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN
  )
) {
  throw new Error('you forgot the env variables you silly goose');
}

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

// JSON middleware
app.use(express.json());

// parse URL encoded strings
app.use(express.urlencoded({ extended: true }));

app.use(user);
app.use(project);

// No route was taken - 404 - Resource (API endpoint) not found.
app.use((_req, res) => {
  const response: ApiResponse<void> = {
    status: 'failure',
    data: undefined,
    error: 'No matching endpoint was found.',
  };

  return res.status(404).send(response);
});

if (env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `[${new Date().toISOString()}] RESTful API for omega-logger-3000 is listening on port ${PORT}`
    );
  });
}

export default app;

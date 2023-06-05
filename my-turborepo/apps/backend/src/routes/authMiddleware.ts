import { auth } from 'express-oauth2-jwt-bearer';
import { env } from 'process';
import type { Request, Response, NextFunction } from 'express';
import client from '../repositories/client';
// import { v4 } from 'uuid';

const authConfig = {
  domain: env['AUTH0_DOMAIN']!,
  clientId: env['AUTH0_CLIENT_ID']!,
  audience: env['AUTH0_AUDIENCE']!,
};
const KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN =
  env['KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN']!;

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

// todo
// this middleware wastefully intercepts any calls to the server & tries to create new user
// to handle the fact that this might be the caller's first login
// in prod, this should be handled via a hook in auth0
// however, in dev, this is not possible (is hard), since auth0 cannot call localhost obviously
const createIfNotExists = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const callerId = req.auth?.payload.sub;
  if (!callerId) {
    _res.json({ error: 'sub missing from auth payload' });
    return;
  }

  const email = req.auth?.payload[KEY_FOR_EMAIL_WITHIN_AUTH0_TOKEN];
  if (!email) {
    _res.json({ error: 'email missing from auth payload' });
    return;
  }

  const emailButString = email as string;

  try {
    await client.user.create({
      data: {
        id: callerId,
        xlogin: emailButString,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}
  next();
};

export { checkJwt, createIfNotExists };

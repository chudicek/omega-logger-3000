import { Router } from 'express';
import user from '../controllers/user';
import { checkJwt } from './authMiddleware';

const userRouter = Router();
userRouter.use(checkJwt);

const userRoute = '/users';

userRouter.post(userRoute, user.create);

export default userRouter;

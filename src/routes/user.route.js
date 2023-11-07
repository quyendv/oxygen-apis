import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/', verifyToken, (req, res, next) => {
  res.status(200).json({ success: true });
});

export default userRouter;

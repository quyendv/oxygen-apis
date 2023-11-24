import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const userRouter = Router();

userRouter.put('/diseases', verifyToken, userController.setDiseases);
userRouter.post('/', verifyToken, userController.createUser);
userRouter.put('/', verifyToken, userController.updateUser);
userRouter.get('/', verifyToken, userController.getOwnInfo);

export default userRouter;

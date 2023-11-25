import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import uploader from '../middlewares/uploader.middleware.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const userRouter = Router();

userRouter.use(verifyToken);

userRouter.put('/diseases', userController.setDiseases);
userRouter.post('/avatar', uploader.single('file'), userController.setAvatar);
userRouter.post('/', userController.createUser);
userRouter.put('/', userController.updateUser);
userRouter.get('/', userController.getOwnInfo);

export default userRouter;

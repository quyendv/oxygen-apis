import { Router } from 'express';
import locationController from '../controllers/location.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const locationRouter = Router();

locationRouter.get('/history', verifyToken, locationController.getLocationHistory);
locationRouter.post('/history', verifyToken, locationController.addLocationHistory);

export default locationRouter;

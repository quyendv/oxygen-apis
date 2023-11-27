import { Router } from 'express';
import locationController from '../controllers/location.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const locationRouter = Router();

locationRouter.get('/history/7days', verifyToken, locationController.getLocationHistoryLast7Days);
locationRouter.get('/history/today', verifyToken, locationController.getLocationHistoryToday);
locationRouter.get('/history', verifyToken, locationController.getLocationHistoryByDate);
locationRouter.post('/history', verifyToken, locationController.addLocationHistory);

export default locationRouter;

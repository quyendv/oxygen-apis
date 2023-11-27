import { Router } from 'express';
import locationListController from '../controllers/locationlist.controller';

const locationListRouter = Router();

locationListRouter.get('/cities', locationListController.getCities);
locationListRouter.get('/districts', locationListController.getDistricts);
locationListRouter.get('/wards', locationListController.getWards);

// locationRouter.get('/find', articleController.findArticle);

export default locationListRouter;

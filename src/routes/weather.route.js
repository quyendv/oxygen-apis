import { Router } from 'express';
import weatherController from '../controllers/weather.controller.js';

const weatherRouter = Router();

weatherRouter.get('/current', weatherController.current);
weatherRouter.get('/forecast24h', weatherController.forecast24h);
weatherRouter.get('/forecast7d', weatherController.forecast7d);
weatherRouter.get('/forecast3dAqi', weatherController.forecast3dAqi);
export default weatherRouter;

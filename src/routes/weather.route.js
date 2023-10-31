import { Router } from 'express';
import weatherController from '../controllers/weather.controller.js';

const weatherRouter = Router();

weatherRouter.get('/current', weatherController.current);

export default weatherRouter;

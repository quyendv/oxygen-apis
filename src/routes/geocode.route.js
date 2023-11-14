import { Router } from 'express';

import geocodeController from '../controllers/geocode.controller';

const geocodeRouter = Router();

geocodeRouter.get('/reverse-geocoding', geocodeController.reverseGeocode);
geocodeRouter.get('/related-location', geocodeController.getRelatedLocation);

export default geocodeRouter;

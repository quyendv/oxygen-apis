import { Router } from 'express';

import aiController from '../controllers/ai.controller';

const aiRouter = Router();

aiRouter.get('/suggestion/short', aiController.shortSuggestion);
aiRouter.get('/suggestion/long', aiController.longSuggestions);
aiRouter.get('/analyze-disease', aiController.analyzeDisease);

export default aiRouter;

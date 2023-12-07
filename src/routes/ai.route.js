import { Router } from 'express';

import aiController from '../controllers/ai.controller';

const aiRouter = Router();

aiRouter.get('/suggestion/short', aiController.shortSuggestion);
aiRouter.get('/suggestion/long', aiController.longSuggestions);
aiRouter.get('/analyze-disease', aiController.analyzeDisease);
aiRouter.get('/set-url', aiController.setAiUrl);

export default aiRouter;

import { Router } from 'express';

import articleController from '../controllers/article.controller';

const articleRouter = Router();

articleRouter.get('/', articleController.getArticle);
articleRouter.get('/find', articleController.findArticle);

export default articleRouter;

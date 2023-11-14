import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import * as admin from 'firebase-admin';
import serviceAccount from './firebase-admin-key.json';
import { connectDB } from './src/configs/database.config.js';
import initRoutes from './src/routes/index.js';
import article from './src/helpers/getArticle.js';

/** Init app with base config */
const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

article.getArticleFromSrc();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/** app.use(middleware) */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Routes */
initRoutes(app);

/** Run */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

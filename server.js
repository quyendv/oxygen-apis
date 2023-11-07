import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './src/configs/database.config.js';
import initRoutes from './src/routes/index.js';

/** Init app with base config */
const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

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

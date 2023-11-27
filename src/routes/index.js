import articleRouter from './article.route.js';
import geocodeRouter from './geocode.route.js';
import locationRouter from './location.route.js';
import userRouter from './user.route.js';
import weatherRouter from './weather.route.js';
import locationListRouter from './locationlist.route.js';

const initRoutes = (app) => {
  // app.use(path, otherRouter)
  app.use('/api/v1/weather/', weatherRouter);
  app.use('/api/v1/users/', userRouter);
  app.use('/api/v1/article', articleRouter);
  app.use('/api/v1/geocode', geocodeRouter);

  app.use('/api/v1/locationlist', locationListRouter);
  app.use('/api/v1/locations', locationRouter);

  app.use('/', (req, res) => {
    res.send('Server on root route. Path not found!');
  });
};

export default initRoutes;

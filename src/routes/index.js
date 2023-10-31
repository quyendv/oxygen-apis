import weatherRouter from './weather.route.js';

const initRoutes = (app) => {
  // app.use(path, otherRouter)
  app.use('/api/v1/weather/', weatherRouter);

  app.use('/', (req, res) => {
    res.send('Server on root route. Path not found!');
  });
};

export default initRoutes;

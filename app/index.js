const express = require('express');
const app = express();

require('./bootstrap')(app);
require('./middlewares/render')(app);
require('./routes')(app);

require('./middlewares/errors404Middleware')(app);
require('./middlewares/errorHandlerMiddleware')(app);
require('./middlewares/exceptionMiddleware')(app);

module.exports = () => {
  const port = process.env.APP_PORT;
  app.listen(port, () => {
    console.log(`app is running on port : ${port}`);
  });
};

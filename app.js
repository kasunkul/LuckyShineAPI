/* eslint-disable no-console */
const express = require('express');

const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');

app.use(cors());
const morgan = require('morgan');

app.use(morgan('dev'));
const bodyParser = require('body-parser');
// const { swaggerDocument } = require('./swagger.js');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./src/controllers/index');

routes.forEach(([name, handler]) => app.use(`/${name}`, handler));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port, ${port} ${process.env.NODE_ENV}`);
});

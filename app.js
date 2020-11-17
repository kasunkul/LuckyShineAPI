/* eslint-disable no-console */
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const morgan = require('morgan');
app.use(morgan('dev'));
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./src/routes/index');
routes.forEach(([name, handler]) => app.use(`/${name}`, handler));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port, ${port} ${process.env.NODE_ENV}`);
});
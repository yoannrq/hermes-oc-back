// [ Node imports ]
import { fileURLToPath } from 'url';
import path from 'path';

// [ Packages imports ]
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';

// [ Local imports ]
import router from './routers/router.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerSpec from './api-docs/swagger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(__dirname, '../../projet-05-hermes-front/dist');

const app = express();

app.use(express.urlencoded({ extended: true })); // Add a body parser before the router
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Log HTTP requests
app.use(express.static(STATIC_DIR));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Added Swagger documentation
app.use(router);

app.use(errorHandler);

export default app;

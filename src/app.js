import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './routers/router.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerSpec from './api-docs/swagger.js';

const app = express();

// Ajout d'un body parser (avant le routeur)
app.use(express.urlencoded({ extended: true }));

// Ajout de la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware pour analyser le corps des requêtes au format JSON
// afin de les passer en objet JS dans req.body
app.use(express.json());

// Brancher le router
app.use(router);

// Brancher le middleware de gestion d'erreur
app.use(errorHandler);

// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});

import 'dotenv/config'
import express from 'express';
import router from './app/router.js';
import errorHandler from './app/middlewares/errorHandler.js'

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ajout d'un body parser (avant le routeur)
app.use(express.urlencoded({ extended: true }));

// Middleware pour analyser le corps des requêtes au format JSON afin de les passer en objet JS dans req.body
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

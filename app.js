import express from 'express';
// import router from './app/router.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ajout d'un body parser (avant le routeur)
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Brancher le router
// app.use(router);

// Brancher la page 404
// app.use((req, res) => {
//   res.status(404).render('404');
// });

// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});

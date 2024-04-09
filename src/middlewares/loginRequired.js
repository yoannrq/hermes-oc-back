import jwt from 'jsonwebtoken';
import fs from 'fs';
import postgresClient from '../models/postgresClient.js';

async function loginRequired(req, res, next) {
  // Récupération du token dans le header, split pour retirer le 'Bearer
  const token = req.headers.authorization?.split(' ')[1];
  // Si le token n'est pas présent
  if (!token) {
    return next({
      status: 401,
      message: 'Unauthorized',
    });
  }

  // Vérification du token
  try {
    const publicKey = fs.readFileSync(process.env.PATH_TO_PUBLIC_KEY, 'utf8');
    const decodedToken = jwt.verify(token, publicKey, { algorithm: 'ES256' });
    const { userId } = decodedToken;

    // Vérification de l'utilisateur en BDD
    const user = await postgresClient.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });
    console.log(user);

    if (!user) {
      return next({
        status: 404,
        message: 'User not found',
      });
    }

    // Ajout des données du token dans l'objet res.locals
    delete user.password;
    res.locals.user = user;

    return next();
  } catch (err) {
    return next({
      status: 401,
      message: 'Unauthorized',
    });
  }
}

export default loginRequired;

// [ packages imports ]
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import '../helpers/envLoader.js';

// [ local imports ]
import postgresClient from '../models/postgresClient.js';
import userSchema from '../utils/validation/userSchema.js';
import formatingName from '../utils/formatingFunctions/formatingName.js';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

export default {
  async signup(req, res, next) {
    try {
      const { success, data, error } = userSchema.safeParse(req.body);

      if (!success) {
        // erreur de validation de schéma zod !
        return next({
          status: 400,
          message: 'Schema validation error.',
          errors: error.errors,
        });
      }

      const { email, firstname, lastname, password, rppsCode } = data;

      const hashedPassword = await bcrypt.hash(password, 10);

      // Vérification si le mail ou le code RPPS existe déjà en BDD
      const user = await postgresClient.user.findFirst({
        where: {
          OR: [{ email }, { rppsCode }],
        },
      });

      if (user) {
        return next({
          status: 409,
          message: 'User already exists.',
          email,
          rppsCode,
        });
      }

      const formatedFirstname = formatingName(firstname);
      const formatedLastname = formatingName(lastname);

      // Création de l'utilisateur en BDD
      const newUser = await postgresClient.user.create({
        data: {
          email,
          firstname: formatedFirstname,
          lastname: formatedLastname,
          password: hashedPassword,
          rppsCode,
        },
      });
      delete newUser.password;

      return res.status(201).json(newUser);
    } catch (error) {
      return next(error);
    }
  },

  async login(req, res, next) {
    try {
      // Todo: Check user input with zod
      const { email, password } = req.body;

      const user = await postgresClient.user.findUnique({
        where: { email },
        include: {
          roles: true,
        },
      });

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch || !user) {
        return next({
          status: 401,
          message: 'Invalid email or password.',
        });
      }

      // Générer un token JWT
      const privateKey = process.env.JWT_ES256_PRIVATE_KEY;
      const token = jwt.sign({ userId: user.id }, privateKey, {
        expiresIn: '1h',
        algorithm: 'ES256',
      });

      // Ajouter le token dans un cookie
      const cookieOptions = {
        httpOnly: true, // Le cookie n'est pas accessible via JavaScript côté client
        secure: process.env.NODE_ENV === 'production', // En production, envoyer le cookie uniquement sur HTTPS
        maxAge: ONE_HOUR, // Durée de vie du cookie 1 heure
        sameSite: 'strict', // Le cookie est envoyé uniquement pour les requêtes du même site
      };
      res.cookie('Authorization', token, cookieOptions);

      return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    try {
      // Effacer le token JWT dans les cookies
      res.cookie('Authorization', '');

      return res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
      return next(error);
    }
  },
};

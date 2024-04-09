import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import postgresClient from '../models/postgresClient.js';
import userSchema from '../utils/validation/userSchema.js';
import formatingName from '../utils/formatingName.js';

export default {
  signup: async (req, res, next) => {
    try {
      // Validation des données avec zod
      const { success, data, error } = userSchema.safeParse(req.body);

      if (!success) {
        // erreur de validation de schéma zod !
        return next({
          status: 400,
          message: 'Schema validation error.',
          errors: error.errors,
        });
      }

      const {
        email, firstname, lastname, password, rppsCode,
      } = data;

      const hashedPassword = await bcrypt.hash(password, 10);

      // Vérification si le mail ou le code RPPS existe déjà en BDD
      const user = await postgresClient.user.findFirst({
        where: {
          OR: [
            { email },
            { rppsCode },
          ],
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

  login: async (req, res, next) => {
    try {
      // Validation des données avec zod
      const { success, data, error } = userSchema.partial().safeParse(req.body);

      if (!success) {
        // erreur de validation de schéma zod !
        return next({
          status: 400,
          message: 'Schema validation error.',
          errors: error.errors,
        });
      }

      const user = await postgresClient.user.findUnique({
        where: { email: data.email },
        include: {
          roles: true,
        },
      });

      if (!user) {
        return next({
          status: 404,
          message: 'User not found.',
        });
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password);

      if (!passwordMatch) {
        return next({
          status: 401,
          message: 'Invalid password.',
        });
      }

      // Générer un token JWT
      const privateKey = fs.readFileSync(process.env.PATH_TO_PRIVATE_KEY, 'utf8');
      const token = jwt.sign({ userId: user.id }, privateKey, { expiresIn: '1h', algorithm: 'ES256' });

      // Ajouter le token dans les headers de la réponse
      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      return next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Effacer le token JWT dans les headers
      res.setHeader('Authorization', '');

      return res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
      return next(error);
    }
  },

};

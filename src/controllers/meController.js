import bcrypt from 'bcrypt';
import postgresClient from '../models/postgresClient.js';
import userSchema from '../utils/validation/userSchema.js';
import formatingName from '../utils/formatingName.js';

export default {
  getMe: async (req, res) => {
    // Reconstitution de l'objet user pour formater les données roles
    const user = {
      ...res.locals.user,
      roles: res.locals.user.roles.map((userHasRole) => userHasRole.role),
    };

    return res.status(200).json({ user });
  },

  updateMe: async (req, res, next) => {
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

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.firstname) {
      data.firstname = formatingName(data.firstname);
    }

    if (data.lastname) {
      data.lastname = formatingName(data.lastname);
    }

    const { user } = res.locals;

    try {
      const updatedUser = await postgresClient.user.update({
        where: { id: user.id },
        data,
      });

      delete updatedUser.password;

      res.locals.user = updatedUser;

      return res.status(200).json(updatedUser);
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },
};

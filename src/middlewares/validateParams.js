import paramSchema from '../utils/validation/paramSchema.js';

const validateParams = (req, res, next) => {
// Si présence de conversationId dans les paramètres de la requête
  if ('conversationId' in req.params) {
    const { success, data, error } = paramSchema.conversationIdSchema.safeParse(req.params.conversationId);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    req.validatedConversationIdParam = data;
  }

  // Si présence de messageId dans les paramètres de la requête
  if ('messageId' in req.params) {
    const { success, data, error } = paramSchema.messageIdSchema.safeParse(req.params.messageId);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    req.validatedMessageIdParam = data;
  }
  return next();
};

export default validateParams;

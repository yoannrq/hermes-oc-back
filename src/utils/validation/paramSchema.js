import { z } from 'zod';

// Fonction de schéma pour valider les ID
const idSchema = () => z
  .string({ required_error: 'Param is required.' })
  .regex(/^\d+$/, 'The param must contain number(s).')
  .transform((value) => parseInt(value, 10));

const paramSchema = {
  conversationIdSchema: idSchema(),
  messageIdSchema: idSchema(),
};

export default paramSchema;

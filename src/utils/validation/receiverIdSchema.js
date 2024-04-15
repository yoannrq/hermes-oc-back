import { z } from 'zod';

export default z.object({
  receiverId: z.string({
    required_error: {
      value: "The field 'receiverId' is required.",
      code: 'receiverIdRequired',
    },
    invalid_type_error: "The field 'receiverId' must be a string.",
  })
    .regex(/\d/, {
      message: {
        value: "The field 'receiverId' must contain only numbers.",
        code: 'receiverIdInvalid',
      },
    })
    .min(1, {
      message: {
        value: "The field 'receiverId' must be at least 1 character long.",
        code: 'receiverIdTooShort',
      },
    }),
});

import { z } from 'zod';

export default z.object({
  content: z.string({
    required_error: {
      value: "The field 'content' is required.",
      code: 'contentRequired',
    },
    invalid_type_error: "The field 'content' must be a string.",
  })
    .min(1, {
      message: {
        value: "The field 'content' must be at least 1 character long.",
        code: 'contentTooShort',
      },
    }),

  roomId: z.string({
    required_error: {
      value: "The field 'roomId' is required.",
      code: 'roomIdRequired',
    },
    invalid_type_error: "The field 'roomId' must be a string.",
  })
    .regex(/\d/, {
      message: {
        value: "The field 'receiverId' must contain only numbers.",
        code: 'receiverIdInvalid',
      },
    })
    .min(1, {
      message: {
        value: "The field 'roomId' must be at least 1 character long.",
        code: 'roomIdTooShort',
      },
    }),

  roomType: z.string({
    required_error: {
      value: "The field 'roomType' is required.",
      code: 'roomTypeRequired',
    },
    invalid_type_error: "The field 'roomType' must be a string.",
  })
    .regex(/team|conversation|channel/, {
      message: {
        value: "The field 'roomType' must be either 'team', 'conversation', or 'channel'.",
        code: 'roomTypeInvalid',
      },
    }),
});

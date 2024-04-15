import { z } from 'zod';

export default z.object({
  messageId: z.string({
    required_error: {
      value: "The field 'messageId' is required.",
      code: 'messageIdRequired',
    },
    invalid_type_error: "The field 'messageId' must be a string.",
  })
    .regex(/^[a-z0-9]{24}$/, {
      message: {
        value: "The field 'messageId' must contain only numbers and lowercase letters and be 24 characters long.",
        code: 'messageIdInvalid',
      },
    }),

  channelId: z.string({
    required_error: {
      value: "The field 'channelId' is required.",
      code: 'channelIdRequired',
    },
    invalid_type_error: "The field 'channelId' must be a string.",
  })
    .regex(/\d/, {
      message: {
        value: "The field 'channelId' must contain only numbers.",
        code: 'channelIdInvalid',
      },
    })
    .min(1, {
      message: {
        value: "The field 'channelId' must be at least 1 character long.",
        code: 'channelIdTooShort',
      },
    })
    .optional(),

  teamId: z.string({
    required_error: {
      value: "The field 'teamId' is required.",
      code: 'teamIdRequired',
    },
    invalid_type_error: "The field 'teamId' must be a string.",
  })
    .regex(/\d/, {
      message: {
        value: "The field 'teamId' must contain only numbers.",
        code: 'teamIdInvalid',
      },
    })
    .min(1, {
      message: {
        value: "The field 'teamId' must be at least 1 character long.",
        code: 'teamIdTooShort',
      },
    })
    .optional(),

  privateId: z.string({
    required_error: {
      value: "The field 'privateId' is required.",
      code: 'privateIdRequired',
    },
    invalid_type_error: "The field 'privateId' must be a string.",
  })
    .regex(/\d/, {
      message: {
        value: "The field 'privateId' must contain only numbers.",
        code: 'privateIdInvalid',
      },
    })
    .min(1, {
      message: {
        value: "The field 'privateId' must be at least 1 character long.",
        code: 'privateIdTooShort',
      },
    })
    .optional(),
});

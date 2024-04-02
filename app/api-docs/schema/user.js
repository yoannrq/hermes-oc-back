export default {
  user: {
    type: 'object',
    required: ['firstname', 'lastname', 'RPPS_code', 'email', 'password'],
    properties: {
      id: { type: 'integer', description: 'The auto-generated id for the user.' },
      firstname: { type: 'string', description: "User's firstname." },
      lastname: { type: 'string', description: "User's lastname." },
      RPPS_code: { type: 'string', description: "User's RPPS code." },
      email: { type: 'string', description: "User's email." },
      password: { type: 'string', description: "User's password." },
      profile_picture_url: { type: 'string', description: "User's profile picture." },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date of creation.',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date of last update.',
      },
    },
    example: {
      id: 2,
      firstname: 'John',
      lastname: 'Doe',
      RPPS_code: '123456789',
      email: 'john@doe.fr',
      password: 'password',
      profile_picture_url: 'https://www.example.com/profile.jpg',
      createdAt: '2024-03-10 09:43:05.757',
      updatedAt: '2024-03-10 09:43:05.757',
    },
  },
};

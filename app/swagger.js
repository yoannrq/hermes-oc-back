import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hermès API Documentation',
      version: '1.0.0',
      description: 'Hermès messagerie API documentation',
    },
    servers: [{ url: 'http://localhost:3000/hermes/api' }],
    tags: [
      {
        name: 'user',
        description: 'User management',
      },
      {
        name: 'role',
        description: 'Role management',
      },
      {
        name: 'speciality',
        description: 'Speciality management',
      },
      {
        name: 'permission',
        description: 'Permission management',
      },
      {
        name: 'team',
        description: 'Team management',
      },
      {
        name: 'conversation',
        description: 'Conversation management',
      },
      {
        name: 'settings',
        description: 'Settings management',
      },
      {
        name: 'settingKey',
        description: 'Setting key management',
      },
      {
        name: 'patient',
        description: 'Patient management',
      },
      {
        name: 'zipCode',
        description: 'Zip code management',
      },
      {
        name: 'city',
        description: 'City management',
      },
      {
        name: 'channelType',
        description: 'Channel management',
      },
      {
        name: 'message',
        description: 'Message management',
      },
      {
        name: 'lastMessageRead',
        description: 'Last message read management',
      },
    ],
    components: {
      schemas: {
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
        role: {
          type: 'object',
          required: ['title'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the role.' },
            title: { type: 'string', description: "Role's title." },
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
            title: 'HAD Manager',
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10 09:43:05.757',
          },
        },
        speciality: {
          type: 'object',
          required: ['title'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the speciality.' },
            title: { type: 'string', description: "Speciality's title." },
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
            title: 'Cardiologist',
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10 09:43:05.757',
          },
        },
        team: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the team.' },
            name: { type: 'string', description: "Team's name." },
            profile_picture_url: { type: 'string', description: "Team's profile picture." },
            color: { type: 'string', description: "Team's color." },
            owner_id: { type: 'integer', description: "Team's owner id." },
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
            name: 'Yellow Team',
            profile_picture_url: 'https://www.example.com/profile.jpg',
            color: '#FF0000',
            owner_id: 2,
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10 09:43:05.757',
          },
        },
        settings: {
          type: 'object',
          required: ['user_id', 'key_id', 'value'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the setting.' },
            user_id: { type: 'integer', description: "Setting's user id." },
            key_id: { type: 'integer', description: "Setting's key id." },
            value: { type: 'string', description: "Setting's value." },
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
            user_id: 2,
            key_id: 2,
            value: 'value',
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10 09:43:05.757',
          },
        },
        patient: {
          type: 'object',
          required: ['firstname', 'lastname', 'birthdate', 'social_security_number', 'phone_number', 'email', 'address'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the patient.' },
            firstname: { type: 'string', description: "Patient's firstname." },
            lastname: { type: 'string', description: "Patient's lastname." },
            birthdate: { type: 'string', description: "Patient's birthdate." },
            social_security_number: { type: 'string', description: "Patient's social_security_number." },
            phone_number: { type: 'string', description: "Patient's phone number." },
            email: { type: 'string', description: "Patient's email." },
            address: { type: 'string', description: "Patient's address." },
            zip_code_id: { type: 'integer', description: "Patient's zip code id." },
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
            firstname: 'Jane',
            lastname: 'Doe',
            birthdate: '1990-01-01',
            social_security_number: '123456789',
            phone_number: '0601020304',
            email: 'jane@doe.com',
            address: '5 rue de la paix',
            zip_code_id: 2,
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10',
          },
        },
        zipCode: {
          type: 'object',
          required: ['code', 'city_id'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the zip code.' },
            code: { type: 'string', description: "Zip code's code." },
            city_id: { type: 'integer', description: "Zip code's city id." },
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
            code: '75000',
            city_id: 2,
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10',
          },
        },
        city: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the city.' },
            name: { type: 'string', description: "City's name." },
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
            name: 'Paris',
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10',
          },
        },
        channelType: {
          type: 'object',
          required: ['title'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the channel.' },
            title: { type: 'string', description: "Channel's title." },
            color: { type: 'string', description: "Channel's color." },
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
            title: 'General',
            color: '#FF0000',
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10',
          },
        },
        message: {
          type: 'object',
          required: ['content', 'deleted', 'author_id'],
          properties: {
            id: { type: 'integer', description: 'The auto-generated id for the message.' },
            content: { type: 'string', description: "Message's content." },
            deleted: { type: 'boolean', description: 'Message is deleted or not.' },
            related_at: { type: 'integer', description: 'Message related at.' },
            author_id: { type: 'integer', description: "Message's sender id." },
            conversation_id: { type: 'integer', description: "Message's conversation id." },
            team_id: { type: 'integer', description: "Message's team id." },
            channel_id: { type: 'integer', description: "Message's channel id." },
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
            content: 'Hello',
            deleted: false,
            related_at: 1,
            author_id: 2,
            conversation_id: 1,
            team_id: null,
            channel_id: null,
            createdAt: '2024-03-10 09:43:05.757',
            updatedAt: '2024-03-10 09:43:05.757',
          },
        },
      },
    },
  },
  apis: ['./app/routers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

const crud = {
  canCreate: 'canCreate',
  canRead: 'canRead',
  canUpdate: 'canUpdate',
  canDelete: 'canDelete',
};

const permissions = {
  // [ postgres table name ]
  user: {
    all: { ...crud },
    one: {},
  },
  speciality: {
    all: { ...crud },
    one: {},
  },
  role: {
    all: { ...crud },
    one: {},
  },
  team: {
    all: { ...crud },
    one: {
      canAddUserInTeamId: 'canAddUserInTeamId',
      canRemoveUserInTeamId: 'canRemoveUserInTeamId',
    },
  },
  setting: {
    all: { ...crud },
    one: {},
  },
  settingKey: {
    all: { ...crud },
    one: {},
  },
  conversation: {
    all: { ...crud },
    one: {},
  },
  patient: {
    all: {
      ...crud,
    },
    one: {
      canAssignUserToPatientId: 'canAssignUserToPatientId',
      canUnassignUserToPatientId: 'canUnassignUserToPatientId',
    },
  },
  channel: {
    all: { ...crud },
    one: {},
  },
  channelType: {
    all: { ...crud },
    one: {
      canReadInChannelTypeId: 'canReadInChannelTypeId',
      canWriteInChannelTypeId: 'canWriteInChannelTypeId',
    },
  },
  zipCode: {
    all: { ...crud },
    one: {},
  },
  city: {
    all: { ...crud },
    one: {},
  },

  // [ mongo table name ]
  message: {
    all: { ...crud },
    one: {},
  },
  attachment: {
    all: { ...crud },
    one: {},
  },
  lastMessageRead: {
    all: { ...crud },
    one: {},
  },
  permission: {
    all: { ...crud },
    one: {},
  },
  refreshToken: {
    all: { ...crud },
    one: {},
  },
};

for (const tableName of Object.keys(permissions)) {
  const table = permissions[tableName];
  permissions[tableName] = {
    all: Object.fromEntries(
      Object.entries(table.all).map(([pKey, pName]) => [
        pKey,
        {
          tableName,
          permissionName: pName,
        },
      ]),
    ),

    one: Object.fromEntries(
      Object.entries(table.one).map(([pKey, pName]) => [
        pKey,
        (id) => ({
          recordId: id,
          tableName,
          permissionName: pName,
        }),
      ]),
    ),
  };
}

export default permissions;

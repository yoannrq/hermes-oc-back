CREATE TABLE "User" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "password" TEXT NOT NULL,
    "rppsCode" VARCHAR(11),
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Setting" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "settingKeyId" INTEGER NOT NULL,
    "value" TEXT NOT NULL
);

CREATE TABLE "SettingKey" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "defaultValue" TEXT NOT NULL
);

CREATE TABLE "Role" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "Speciality" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "UserHasSpeciality" (
    "userId" INTEGER NOT NULL,
    "specialityId" INTEGER NOT NULL,

    PRIMARY KEY ("userId","specialityId")
);

CREATE TABLE "UserHasRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    PRIMARY KEY ("userId","roleId")
);

CREATE TABLE "Team" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "ownerId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "UserHasTeam" (
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    PRIMARY KEY ("userId","teamId")
);

CREATE TABLE "Conversation" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

CREATE TABLE "UserHasConversation" (
    "userId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,

    PRIMARY KEY ("userId","conversationId")
);

CREATE TABLE "Patient" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "zipCodeId" INTEGER NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "socialSecurityNumber" VARCHAR(15) NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "address" VARCHAR(140) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "UserHasPatient" (
    "userId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    PRIMARY KEY ("userId","patientId")
);

CREATE TABLE "ZipCode" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "code" VARCHAR(5) NOT NULL,
    "cityId" INTEGER NOT NULL
);

CREATE TABLE "City" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(60) NOT NULL
);

CREATE TABLE "Channel" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "patientId" INTEGER NOT NULL,
    "channelTypeId" INTEGER NOT NULL
);

CREATE TABLE "ChannelType" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "order" DOUBLE PRECISION NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_rppsCode_key" ON "User"("rppsCode");
CREATE UNIQUE INDEX "Patient_socialSecurityNumber_key" ON "Patient"("socialSecurityNumber");
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
CREATE UNIQUE INDEX "ZipCode_code_key" ON "ZipCode"("code");

ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Setting" ADD CONSTRAINT "Setting_settingKeyId_fkey" FOREIGN KEY ("settingKeyId") REFERENCES "SettingKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasSpeciality" ADD CONSTRAINT "UserHasSpeciality_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasSpeciality" ADD CONSTRAINT "UserHasSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasRole" ADD CONSTRAINT "UserHasRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasRole" ADD CONSTRAINT "UserHasRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasTeam" ADD CONSTRAINT "UserHasTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasTeam" ADD CONSTRAINT "UserHasTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasConversation" ADD CONSTRAINT "UserHasConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasConversation" ADD CONSTRAINT "UserHasConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Patient" ADD CONSTRAINT "Patient_zipCodeId_fkey" FOREIGN KEY ("zipCodeId") REFERENCES "ZipCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasPatient" ADD CONSTRAINT "UserHasPatient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserHasPatient" ADD CONSTRAINT "UserHasPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ZipCode" ADD CONSTRAINT "ZipCode_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Channel" ADD CONSTRAINT "Channel_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Channel" ADD CONSTRAINT "Channel_channelTypeId_fkey" FOREIGN KEY ("channelTypeId") REFERENCES "ChannelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

CREATE TABLE "Team" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "ownerId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Conversation" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
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

CREATE TABLE "_UserHasRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE TABLE "_UserHasSpeciality" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE TABLE "_UserHasTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE TABLE "_UserHasConversation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE TABLE "_UserHasPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "User_rppsCode_key" ON "User"("rppsCode");

CREATE UNIQUE INDEX "Patient_socialSecurityNumber_key" ON "Patient"("socialSecurityNumber");

CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

CREATE UNIQUE INDEX "ZipCode_code_key" ON "ZipCode"("code");

CREATE UNIQUE INDEX "_UserHasRole_AB_unique" ON "_UserHasRole"("A", "B");

CREATE INDEX "_UserHasRole_B_index" ON "_UserHasRole"("B");

CREATE UNIQUE INDEX "_UserHasSpeciality_AB_unique" ON "_UserHasSpeciality"("A", "B");

CREATE INDEX "_UserHasSpeciality_B_index" ON "_UserHasSpeciality"("B");

CREATE UNIQUE INDEX "_UserHasTeam_AB_unique" ON "_UserHasTeam"("A", "B");

CREATE INDEX "_UserHasTeam_B_index" ON "_UserHasTeam"("B");

CREATE UNIQUE INDEX "_UserHasConversation_AB_unique" ON "_UserHasConversation"("A", "B");

CREATE INDEX "_UserHasConversation_B_index" ON "_UserHasConversation"("B");

CREATE UNIQUE INDEX "_UserHasPatient_AB_unique" ON "_UserHasPatient"("A", "B");

CREATE INDEX "_UserHasPatient_B_index" ON "_UserHasPatient"("B");

ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Setting" ADD CONSTRAINT "Setting_settingKeyId_fkey" FOREIGN KEY ("settingKeyId") REFERENCES "SettingKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Patient" ADD CONSTRAINT "Patient_zipCodeId_fkey" FOREIGN KEY ("zipCodeId") REFERENCES "ZipCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ZipCode" ADD CONSTRAINT "ZipCode_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Channel" ADD CONSTRAINT "Channel_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Channel" ADD CONSTRAINT "Channel_channelTypeId_fkey" FOREIGN KEY ("channelTypeId") REFERENCES "ChannelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "_UserHasRole" ADD CONSTRAINT "_UserHasRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasRole" ADD CONSTRAINT "_UserHasRole_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasSpeciality" ADD CONSTRAINT "_UserHasSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasSpeciality" ADD CONSTRAINT "_UserHasSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasTeam" ADD CONSTRAINT "_UserHasTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasTeam" ADD CONSTRAINT "_UserHasTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasConversation" ADD CONSTRAINT "_UserHasConversation_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasConversation" ADD CONSTRAINT "_UserHasConversation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasPatient" ADD CONSTRAINT "_UserHasPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserHasPatient" ADD CONSTRAINT "_UserHasPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

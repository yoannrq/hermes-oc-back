// Prisma Seed file
import seed from "./seed.json" assert { type: 'json'};
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password){
  const hachedPassword = await bcrypt.hash(password, 10);
  return hachedPassword;
}

async function main() {

  for (const settingKey of seed.settingsKeys){
    const settingKeyRecord = await prisma.settingKey.create({
      data: {
        name: settingKey.name,
        defaultValue: settingKey.defaultValue
      }
    })
  }

  for (const city of seed.cities){
    const cityRecord = await prisma.city.create({
      data: {
        name: city.name
      }
    })
  }

  for (const channelType of seed.channelsTypes){
    const channelTypeRecord = await prisma.channelType.create({
      data: {
        name: channelType.name,
        color: channelType.color,
        order: channelType.order
    }
    })
  }
  for (const user of seed.users){

    // Methode 2: Utiliser la syntaxe prisma pour faire ça pour nous !
    // Il faudra certainement rendre le champs name de speciality et role unique.
    // Sinon ça risque à devenir bizarre d'avoir deux rôles différents avec un même nom.
    
    // Doc connect            https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect
    // Doc connectOrCreate    https://www.prisma.io/docs/orm/reference/prisma-client-reference#connectorcreate

    // Et surtout la doc à lire pour travailler avec les relations
    // https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
    const hachedPassword = await hashPassword(user.password);

    const userRecord = await prisma.user.create({
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        password: hachedPassword,
        profilePictureUrl: user.profilePictureUrl,
        roles: {
          connectOrCreate: user.roles.map((role) => {
            return {
              where: { name: role.name },
              create: { name: role.name }
            }
          })
        },
        //TODO : Ajouter l'id dans chaque passage Where
        specialities: {
          connectOrCreate: user.specialities.map((speciality) => {
            return {
              where: { name: speciality },
              create: { name: speciality }
            }
          })
        },

        conversations: {
          connectOrCreate: user.conversations.map((conversationId) => {
            return {
              where: { id: conversationId },
              create: { id: conversationId }
            }
          })
        },

        teams: {
          connectOrCreate: user.teams.map((team) => {
            return {
              where: { name: team.name },
              create: { ownerId: team.ownerId, name: team.name, color: team.color }
            }
          })
        },

        settings: {
          connectOrCreate: user.settings.map((setting) => {
            return {
              where: { settingKeyId: setting.settingKeyId },
              create: { userId: setting.userId, settingKeyId: setting.settingKeyId, value: setting.value }
            }
          })
        },
      }
    })
  }
  for (const patient of seed.patients){
    const patientRecord = await prisma.patient.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        firstname: patient.firstname,
        lastname: patient.lastname,
        birthdate: patient.birthdate,
        socialSecurityNumber: patient.socialSecurityNumber,
        phoneNumber: patient.phoneNumber,
        email: patient.email,
        address: patient.address,

        zipCode: {
          connectOrCreate: {
            where: { code: patient.zipCode.code },
            create: {
                code: patient.zipCode.code,
                city: {
                  connnectOrCreate: {
                    where: { name: patient.zipCode.cityName },
                    create: { name: patient.zipCode.cityName }
                  }
                },
              }
          }
        },

        channels: {
          connectOrCreate: patient.channels.map((channel) => {
            return {
              where: {
                AND: [
                  { patientId: channel.patientIdId },
                  { channelTypeId: channel.channelTypeId }
              ]},
              create: { patientId: channel.patientId, channelTypeId: channel.channelTypeId }
            }
          })
        },

        users: {
          connect: patient.users.map((userEmail) => {
            return {
              where: { email: userEmail }
            }
          })
        }
      }
    })
  }

  // for (const patient of seed.patients){
  //   const patientRecord = await prisma.patient.create({
  //     data: {
  //       firstname: patient.firstname,
  //       lastname: patient.lastname,
  //       birthdate: patient.birthdate,
  //       socialSecurityNumber: patient.socialSecurityNumber,
  //       phoneNumber: patient.phoneNumber,
  //       email: patient.email,
  //       address: patient.address,

  //       zipCode: {
  //         connectOrCreate: {
  //           where: { code: patient.zipCode.code },
  //           create: { code: patient.zipCode.code, cityId: patient.zipCode.cityId }
  //         }
  //       },

  //       channels: {
  //         connectOrCreate: patient.channels.map((channel) => {
  //           return {
  //             where: {
  //               AND: [
  //                 { patientId: channel.patientIdId },
  //                 { channelTypeId: channel.channelTypeId }
  //             ]},
  //             create: { patientId: channel.patientId, channelTypeId: channel.channelTypeId }
  //           }
  //         })
  //       },

  //       users: {
  //         connect: patient.users.map((userId) => {
  //           return {
  //             where: { id: userId }
  //           }
  //         })
  //       }
  //     }
  //   })
  // }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

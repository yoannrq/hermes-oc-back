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
    const settingKeyRecord = await prisma.settingKey.upsert({
      where: { name: settingKey.name },
      create: {
        name: settingKey.name,
        defaultValue: settingKey.defaultValue
      },
      update: {
        defaultValue: settingKey.defaultValue
      },
    })
  }

  for (const channelType of seed.channelsTypes){
    const channelTypeRecord = await prisma.channelType.upsert({
      where: { name: channelType.name },
      create: {
        name: channelType.name,
        color: channelType.color,
        order: channelType.order
      },
      update: {
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

    const userRecord = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        password: hachedPassword,
        rppsCode: user.rppsCode,
        profilePictureUrl: user.profilePictureUrl,
        roles: {
          connectOrCreate: user.roles.map((roleName) => {
            return {
              where: { name: roleName },
              create: { name: roleName }
            }
          })
        },
        specialities: {
          connectOrCreate: user.specialities.map((specialityName) => {
            return {
              where: { name: specialityName },
              create: { name: specialityName }
            }
          })
        },


        // conversations: {
        //   connectOrCreate: user.conversations.map((conversationId) => {
        //     return {
        //       where: { id: conversationId },
        //       create: { id: conversationId }
        //     }
        //   })
        // },


      }
    })
  }

  for (const team of seed.teams){
    await prisma.team.upsert({
      where: { name: team.name },
      update: {
        color: team.color,
        owner: {
          connect: {
            email: team.ownerEmail,
          }
        },
        users: {
          connect: team.usersEmail.map((userEmail) => {
            return {
              email: userEmail,
            }
          })
        }
      },
      create: { 
        name: team.name,
        color: team.color,
        owner: {
          connect: {
            email: team.ownerEmail,
          }
        },
        users: {
          connect: team.usersEmail.map((userEmail) => {
            return {
              email: userEmail,
            }
          })
        },
      }
    })
  }
  for (const patient of seed.patients){
    const patientRecord = await prisma.patient.upsert({
      where: {
        email: patient.email,
      },
      update: {},
      create: {
        firstname: patient.firstname,
        lastname: patient.lastname,
        birthdate: new Date(patient.birthdate),
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
                  connectOrCreate: {
                    where: { name: patient.zipCode.cityName },
                    create: { name: patient.zipCode.cityName }
                  }
                },
              }
          }
        },

        users: {
          connect: patient.users.map((userEmail) => {
            return {
              email: userEmail, 
            }
          })
        }

        // channels: {
        //   connectOrCreate: patient.channels.map((channel) => {
        //     return {
        //       where: {
        //         AND: [
        //           { patientId: channel.patientIdId },
        //           { channelTypeId: channel.channelTypeId }
        //       ]},
        //       create: { patientId: channel.patientId, channelTypeId: channel.channelTypeId }
        //     }
        //   })
        // },

      }
    })
  }

  // for (const setting of seed.settings){
  //   await prisma.settings.upsert({
  //     where: {
  //       AND: [
  //         {user: { email: setting.userEmail}},
  //         {settingKey: { name: setting.settingKeyName}},
  //       ]
  //      },


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

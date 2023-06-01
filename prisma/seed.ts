import { PrismaClient } from "@prisma/client";
import { parseArgs } from "util";

const options = {
  environment: { type: "string" as const, required: true },
};

const prisma = new PrismaClient();

const developmentSeed = async () => {
  console.time("Seeding Development Database");
  await prisma.user.create({
    data: {
      name: "Dev",
      email: "dev@email.com",
    },
  });
  console.timeEnd("Seeding Development Database");
};

const testSeed = async () => {
  console.time("Seeding Test Database");
  await prisma.user.create({
    data: {
      name: "Test user",
      email: "test@email.com",
    },
  });
  console.timeEnd("Seeding Test Database");
};

const prodSeed = async () => {
  console.time("Seeding Production Database");

  await prisma.user.create({
    data: {
      name: "Prod user",
      email: "prod@email.com",
    },
  });

  console.timeEnd("Seeding Production Database");
};

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options });

  switch (environment) {
    case "development": {
      await developmentSeed();
      break;
    }
    case "test": {
      await testSeed();
      break;
    }
    case "production": {
      await prodSeed();
      break;
    }
    default: {
      console.log("Skip seeding by default");
      break;
    }
  }
}

main();

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const main = async () => {
  const user = await db.user.findFirst();

  if (!user) {
    console.log("No user in database");
    return;
  }

  console.log(`${user.name} says Hi 👋!`);
};

main().catch(console.log);

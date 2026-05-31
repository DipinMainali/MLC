import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME?.trim() || "Admin";

  if (!email) {
    throw new Error("ADMIN_SEED_EMAIL is required to seed the admin user.");
  }

  if (!password) {
    throw new Error("ADMIN_SEED_PASSWORD is required to seed the admin user.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { data: true },
  });

  const existingData =
    existingUser && existingUser.data && typeof existingUser.data === "object"
      ? existingUser.data
      : {};

  const data = {
    ...existingData,
    role: "ADMIN",
    displayName: name,
    seededAt: new Date().toISOString(),
    seededBy: "prisma-seed",
  };

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
      data,
      lastLoginAt: null,
    },
    create: {
      email,
      passwordHash,
      isActive: true,
      data,
    },
  });

  console.log(`Seeded admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

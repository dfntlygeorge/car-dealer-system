import { bcryptPasswordHash } from "@/lib/bcrypt";
import { PrismaClient } from "@prisma/client";

export async function seedAdmin(prisma: PrismaClient) {
  const password = await bcryptPasswordHash("abc123#");

  const admin = await prisma.user.create({
    data: {
      email: "g.a.donayre.business@gmail.com",
      hashedPassword: password,
    },
  });

  console.log("Added an admin", { admin });
  return admin;
}

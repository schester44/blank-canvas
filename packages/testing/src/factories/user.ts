import { faker } from "@faker-js/faker";
import { PrismaClient } from "@__APP_NAME__/db";

interface CreateUserParams {
  name?: string;
  email?: string;
  role?: string;
}

export function createUser(db: PrismaClient, options?: CreateUserParams) {
  return db.user.create({
    data: {
      id: faker.string.uuid(),
      name: options?.name ?? faker.person.fullName(),
      email: options?.email ?? faker.internet.email(),
      emailVerified: true,
      role: options?.role ?? "user",
    },
  });
}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ["info"],
});

await prisma.user.upsert({
  where: { id: "DtOe3hm7pChWcB9jNDWxETWMPfZTvYXq" },
  update: {},
  create: {
    id: "DtOe3hm7pChWcB9jNDWxETWMPfZTvYXq",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    accounts: {
      create: {
        id: "Ab0t1jlz1t0EgkgL0ZUvQUxt5r6PYFxx",
        accountId: "9nq8KaL07MRGiIDRYURQ3JAlqjFIqX65",
        providerId: "credential",
        // password: "Password1!" (hashed via @better-auth/utils/password)
        password:
          "6ccd5c782e94dbd521a315b4a77ead48:bf564f041f1bda2199d0a7e13d836b921d003efb34e0e3d2b95ed3dc92920a43bae67d7046e3d30300602f1771611b5e38ecd1a42ad1a843b2c740cbe06b1f84",
      },
    },
  },
});

console.log("Seeded user: test@example.com");

await prisma.$disconnect();
console.log("Seed complete!");

// import { PrismaClient } from "@/app/generated/prisma";

// const prisma = new PrismaClient();

// export default prisma;


import { PrismaClient } from "@/app/generated/prisma"; 

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;